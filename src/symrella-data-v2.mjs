/**
 * SymRella local data schema v2.
 * Pure migration/validation helpers. No fertility interpretation is performed here.
 */

export const DATA_SCHEMA = "symrella.local-data";
export const DATA_SCHEMA_VERSION = 2;

const LEGACY_MUCUS = new Set(["sec", "collante", "cremeuse", "blanc-oeuf"]);
const LEGACY_BLEEDING = new Set(["aucun", "regles", "spotting"]);
const LEGACY_FACTORS = new Set(["maladie", "sommeil", "horaire", "voyage", "alcool", "medicament"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function validDate(value) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function defaultId(prefix, index) {
  return `${prefix}-${Date.now().toString(36)}-${index.toString(36)}`;
}
function cleanText(value, max = 2000) {
  return typeof value === "string" ? value.slice(0, max) : "";
}
function legacyEntryIsValid(entry) {
  return isObject(entry) &&
    validDate(entry.date) &&
    (entry.temp === null || (typeof entry.temp === "number" && Number.isFinite(entry.temp) && entry.temp >= 34 && entry.temp <= 42)) &&
    typeof entry.mucus === "string" && LEGACY_MUCUS.has(entry.mucus) &&
    (entry.time === undefined || entry.time === null || (typeof entry.time === "string" && ISO_TIME.test(entry.time))) &&
    (entry.bleeding === undefined || LEGACY_BLEEDING.has(entry.bleeding)) &&
    (entry.factors === undefined || (Array.isArray(entry.factors) && entry.factors.every(x => LEGACY_FACTORS.has(x)))) &&
    typeof entry.notes === "string";
}
function uniqueSortedEntries(entries) {
  const seen = new Set();
  return [...entries].sort((a, b) => a.date.localeCompare(b.date)).filter(entry => {
    if (seen.has(entry.date)) return false;
    seen.add(entry.date);
    return true;
  });
}
function migrateEntry(entry, id) {
  const disturbances = (entry.factors || []).map((type, i) => ({
    id: `${id}-disturbance-${i + 1}`,
    type: type === "maladie" ? "illness" :
      type === "sommeil" ? "sleep" :
      type === "horaire" ? "unusual_time" :
      type === "voyage" ? "travel" :
      type === "alcool" ? "alcohol" : "medication",
    source: "migration",
    note: ""
  }));
  return {
    id,
    date: entry.date,
    cycleDay: null,
    bleeding: { level: entry.bleeding || "aucun", notes: "" },
    temperature: {
      valueC: entry.temp ?? null,
      originalValue: null,
      originalUnit: null,
      measuredAt: entry.time || null,
      measurementRoute: "unknown",
      device: null,
      disturbanceIds: disturbances.map(x => x.id),
      quality: "unknown",
      notes: ""
    },
    cervicalMucus: {
      sensation: null,
      appearance: [],
      legacyCategory: entry.mucus,
      peakQualityCandidate: null,
      notes: ""
    },
    cervix: { position: null, opening: null, consistency: null, notes: "" },
    disturbances,
    intercourse: { occurred: null, details: null },
    generalNotes: cleanText(entry.notes),
    source: "migration"
  };
}
function makeCycle(entries, { id, startDate = null, endDate = null, goal = "observe", idFactory }) {
  const observations = uniqueSortedEntries(entries).map((entry, index) =>
    migrateEntry(entry, idFactory("observation", index))
  );
  return {
    schema: "symrella.cycle",
    schemaVersion: DATA_SCHEMA_VERSION,
    id,
    createdAt: null,
    updatedAt: null,
    startDate,
    endDate,
    goal,
    method: { id: "sensiplan", edition: null, rulesetVersion: null, reviewStatus: "not_approved" },
    observations,
    derived: {
      engineVersion: null,
      rulesetId: null,
      calculatedAt: null,
      status: "not_evaluated",
      days: []
    }
  };
}

/**
 * Migrate the legacy current/history arrays without modifying or deleting them.
 * A current cycle start date is deliberately left null: the first recorded
 * observation is not necessarily the first day of menstruation.
 */
export function migrateLegacyData({ current = [], history = [], profile = null, learning = null } = {}, options = {}) {
  const idFactory = options.idFactory || defaultId;
  if (!Array.isArray(current) || !Array.isArray(history)) {
    throw new TypeError("Les données historiques doivent être des tableaux.");
  }
  if (!current.every(legacyEntryIsValid)) {
    throw new TypeError("Le cycle actuel contient des données historiques invalides.");
  }
  if (!history.every(c => isObject(c) && validDate(c.start) && validDate(c.end) && c.start <= c.end &&
      Array.isArray(c.entries) && c.entries.length > 0 &&
      c.entries.every(e => legacyEntryIsValid(e) && e.date >= c.start && e.date <= c.end))) {
    throw new TypeError("L'historique contient un cycle invalide.");
  }

  const currentCycle = makeCycle(current, {
    id: idFactory("cycle", 0),
    startDate: null,
    endDate: null,
    idFactory
  });
  const migratedHistory = history.map((cycle, index) => makeCycle(cycle.entries, {
    id: idFactory("history-cycle", index),
    startDate: cycle.start,
    endDate: cycle.end,
    idFactory
  }));

  return {
    schema: DATA_SCHEMA,
    schemaVersion: DATA_SCHEMA_VERSION,
    migratedAt: options.migratedAt || null,
    currentCycle,
    history: migratedHistory,
    profile: isObject(profile) ? structuredCloneSafe(profile) : null,
    learning: isObject(learning) ? structuredCloneSafe(learning) : null,
    migration: { from: "legacy-array-v1", status: "completed", fertilityClassification: "not_created" }
  };
}
function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}
export function validateV2Data(value) {
  if (!isObject(value) || value.schema !== DATA_SCHEMA || value.schemaVersion !== DATA_SCHEMA_VERSION ||
      !isObject(value.currentCycle) || !Array.isArray(value.history) ||
      !isObject(value.migration) || value.migration.fertilityClassification !== "not_created") return false;
  const cycleValid = cycle => isObject(cycle) && cycle.schema === "symrella.cycle" &&
    cycle.schemaVersion === DATA_SCHEMA_VERSION && typeof cycle.id === "string" &&
    (cycle.startDate === null || validDate(cycle.startDate)) &&
    (cycle.endDate === null || validDate(cycle.endDate)) &&
    Array.isArray(cycle.observations) && cycle.observations.every(o =>
      isObject(o) && typeof o.id === "string" && validDate(o.date) &&
      isObject(o.temperature) && (o.temperature.valueC === null ||
        (typeof o.temperature.valueC === "number" && Number.isFinite(o.temperature.valueC))) &&
      isObject(o.cervicalMucus) && Array.isArray(o.cervicalMucus.appearance) &&
      Array.isArray(o.disturbances));
  return cycleValid(value.currentCycle) && value.history.every(cycleValid);
}
