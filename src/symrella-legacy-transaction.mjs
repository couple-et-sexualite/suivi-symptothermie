import { migrateLegacyData, validateV2Data } from "./symrella-data-v2.mjs";
import { LEGACY_STORAGE_KEYS, V2_STORAGE_KEY } from "./symrella-storage-migration.mjs";
import { syncLegacySnapshotToV2 } from "./symrella-legacy-sync.mjs";

const ALL_KEYS = Object.freeze([
  V2_STORAGE_KEY,
  ...Object.values(LEGACY_STORAGE_KEYS)
]);

function serializeSnapshot(snapshot) {
  return {
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify(snapshot.current),
    [LEGACY_STORAGE_KEYS.history]: JSON.stringify(snapshot.history),
    [LEGACY_STORAGE_KEYS.profile]: JSON.stringify(snapshot.profile),
    [LEGACY_STORAGE_KEYS.learning]: JSON.stringify(snapshot.learning)
  };
}

/**
 * Atomically persist one complete legacy-UI snapshot and its v2 counterpart.
 * Both representations are rolled back if any write or readback fails.
 * The caller must pass the complete in-memory state, not a partial update.
 */
export function commitLegacySnapshot(storage, snapshot, options = {}) {
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("Le stockage local est indisponible.");
  }
  if (!snapshot || !Array.isArray(snapshot.current) || !Array.isArray(snapshot.history)) {
    throw new TypeError("Une sauvegarde complète est requise.");
  }

  const previous = Object.fromEntries(ALL_KEYS.map(key => [key, storage.getItem(key)]));
  try {
    if (previous[V2_STORAGE_KEY] === null) {
      const initial = migrateLegacyData(snapshot, {
        idFactory: options.idFactory,
        migratedAt: null
      });
      if (!validateV2Data(initial)) throw new Error("La structure initiale v2 est invalide.");
      storage.setItem(V2_STORAGE_KEY, JSON.stringify(initial));
    }

    const v2 = syncLegacySnapshotToV2(storage, snapshot, options);
    const legacy = serializeSnapshot(snapshot);
    for (const [key, value] of Object.entries(legacy)) storage.setItem(key, value);

    for (const key of ALL_KEYS) {
      const expected = key === V2_STORAGE_KEY
        ? JSON.stringify(v2)
        : legacy[key];
      if (storage.getItem(key) !== expected) {
        throw new Error("La vérification de sauvegarde a échoué.");
      }
    }
    return v2;
  } catch (error) {
    for (const key of ALL_KEYS) {
      try {
        if (previous[key] === null) storage.removeItem(key);
        else storage.setItem(key, previous[key]);
      } catch {}
    }
    throw error;
  }
}
