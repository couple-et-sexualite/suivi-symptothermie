/**
 * Guarded one-time migration coordinator for SymRella browser storage.
 * This module is intentionally not wired into the live startup yet.
 * Legacy keys are read-only; only the dedicated v2 key may be written.
 */
import { migrateLegacyData, validateV2Data } from "./symrella-data-v2.mjs";

export const LEGACY_STORAGE_KEYS = Object.freeze({
  current: "symptothermie_current_cycle",
  history: "symptothermie_history",
  profile: "symptothermie_profile",
  learning: "symptothermie_learning_progress"
});
export const V2_STORAGE_KEY = "symptothermie_data_v2";

function readJson(storage, key, fallback) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Donnée locale illisible : ${key}`);
  }
}

/**
 * Outcomes: already_migrated, migrated, legacy_missing, blocked.
 * A pre-existing v2 value is never overwritten. Legacy values are never
 * modified or deleted. A failed write/readback is rolled back where possible.
 */
export function migrateBrowserStorage(storage, options = {}) {
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function") {
    return { status: "blocked", reason: "storage_unavailable" };
  }

  try {
    const existingV2 = storage.getItem(V2_STORAGE_KEY);
    if (existingV2 !== null) {
      let parsed;
      try { parsed = JSON.parse(existingV2); } catch {
        return { status: "blocked", reason: "v2_unreadable" };
      }
      return validateV2Data(parsed)
        ? { status: "already_migrated", data: parsed }
        : { status: "blocked", reason: "v2_invalid" };
    }

    const currentRaw = storage.getItem(LEGACY_STORAGE_KEYS.current);
    const historyRaw = storage.getItem(LEGACY_STORAGE_KEYS.history);
    if (currentRaw === null && historyRaw === null) {
      return { status: "legacy_missing" };
    }

    const data = migrateLegacyData({
      current: readJson(storage, LEGACY_STORAGE_KEYS.current, []),
      history: readJson(storage, LEGACY_STORAGE_KEYS.history, []),
      profile: readJson(storage, LEGACY_STORAGE_KEYS.profile, null),
      learning: readJson(storage, LEGACY_STORAGE_KEYS.learning, null)
    }, options);

    if (!validateV2Data(data)) {
      return { status: "blocked", reason: "migration_validation_failed" };
    }

    const serialized = JSON.stringify(data);
    storage.setItem(V2_STORAGE_KEY, serialized);
    const readBack = storage.getItem(V2_STORAGE_KEY);
    if (readBack !== serialized) {
      try { storage.removeItem(V2_STORAGE_KEY); } catch {}
      return { status: "blocked", reason: "write_verification_failed" };
    }

    let verified;
    try { verified = JSON.parse(readBack); } catch {
      try { storage.removeItem(V2_STORAGE_KEY); } catch {}
      return { status: "blocked", reason: "readback_unreadable" };
    }
    if (!validateV2Data(verified)) {
      try { storage.removeItem(V2_STORAGE_KEY); } catch {}
      return { status: "blocked", reason: "readback_invalid" };
    }

    return { status: "migrated", data: verified };
  } catch (error) {
    return {
      status: "blocked",
      reason: error instanceof Error ? error.message : "migration_error"
    };
  }
}
