/**
 * SymRella local data schema v2.
 * Pure migration/validation helpers. No fertility interpretation is performed here.
 */
export const DATA_SCHEMA = "symrella.local-data";
export const DATA_SCHEMA_VERSION = 2;

const LEGACY_MUCUS = new Set(["sec", "collante", "cremeuse", "blanc-oeuf"]);
const LEGACY_BLEEDING = new Set(["aucun", "regles", "spotting"]);
const LEGACY_FACTORS = new Set(["maladie", "sommeil", "horaire", "voyage", "alcool", "medicament"]);
const DISTURBANCE_TYPES = new Set(["illness", "sleep", "unusual_time", "travel", "alcohol", "medication"]);
const DERIVED_STATUSES = new Set([
  "not_evaluated",
  "potentially_fertile",
  "fertile",
  "end_pending",
  "postovulatory_infertile",
  "indeterminate"
]);
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
let generatedIdSequence = 0;
function defaultId(prefix, index) {
  generatedIdSequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${generatedIdSequence.toString(36)}-${index.toString(36)}`;
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
    (entry.factors === undefined || (Array.isArray(entry.factors) &&
      entry.factors.every(x => LEGACY_FACTORS.has(x)) && new Set(entry.factors).size === entry.factors.length)) &&
    (entry.notes === undefined || typeof entry.notes === "string");
}
function uniqueSortedEntries(entries) {
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.date)) {
      throw new TypeError(`Plusieurs observations portent la même date : ${entry.date}.`);
    }
    seen.add(entry.date);
  }
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
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

/** Migrate legacy arrays without modifying or deleting them. */
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
    id: idFactory("cycle", 0), startDate: null, endDate: null, idFactory
  });
  const migratedHistory = history.map((cycle, index) => makeCycle(cycle.entries, {
    id: idFactory("history-cycle", index), startDate: cycle.start, endDate: cycle.end, idFactory
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

function validObservation(observation) {
  if (!isObject(observation) || typeof observation.id !== "string" || !observation.id ||
      !validDate(observation.date) || !isObject(observation.bleeding) ||
      !LEGACY_BLEEDING.has(observation.bleeding.level) ||
      !isObject(observation.temperature) || !isObject(observation.cervicalMucus) ||
      !Array.isArray(observation.cervicalMucus.appearance) ||
      !isObject(observation.cervix) || !Array.isArray(observation.disturbances) ||
      !isObject(observation.intercourse) ||
      typeof observation.generalNotes !== "string") return false;

  const t = observation.temperature;
  if (!(t.valueC === null || (typeof t.valueC === "number" && Number.isFinite(t.valueC) && t.valueC >= 34 && t.valueC <= 42)) ||
      !(t.measuredAt === null || (typeof t.measuredAt === "string" && ISO_TIME.test(t.measuredAt))) ||
      !["oral", "vaginal", "rectal", "other", "unknown"].includes(t.measurementRoute) ||
      !["usable", "disturbed", "unknown"].includes(t.quality) ||
      !Array.isArray(t.disturbanceIds)) return false;

  const disturbanceIds = new Set();
  for (const d of observation.disturbances) {
    if (!isObject(d) || typeof d.id !== "string" || !d.id ||
        !DISTURBANCE_TYPES.has(d.type) || disturbanceIds.has(d.id)) return false;
    disturbanceIds.add(d.id);
  }
  if (t.disturbanceIds.some(id => typeof id !== "string" || !disturbanceIds.has(id))) return false;

  const mucus = observation.cervicalMucus;
  if (!(mucus.legacyCategory === null || LEGACY_MUCUS.has(mucus.legacyCategory)) ||
      mucus.appearance.some(item => typeof item !== "string")) return false;
  return true;
}

function validCycle(cycle) {
  if (!isObject(cycle) || cycle.schema !== "symrella.cycle" ||
      cycle.schemaVersion !== DATA_SCHEMA_VERSION || typeof cycle.id !== "string" || !cycle.id ||
      !(cycle.startDate === null || validDate(cycle.startDate)) ||
      !(cycle.endDate === null || validDate(cycle.endDate)) ||
      (cycle.startDate && cycle.endDate && cycle.startDate > cycle.endDate) ||
      !["conception", "evitement", "observe"].includes(cycle.goal) ||
      !isObject(cycle.method) || cycle.method.id !== "sensiplan" ||
      !["not_approved", "pending_review", "approved"].includes(cycle.method.reviewStatus) ||
      !Array.isArray(cycle.observations) || !isObject(cycle.derived) ||
      !DERIVED_STATUSES.has(cycle.derived.status) || !Array.isArray(cycle.derived.days)) return false;

  const dates = new Set();
  const observationIds = new Set();
  for (const observation of cycle.observations) {
    if (!validObservation(observation) || dates.has(observation.date) ||
        observationIds.has(observation.id)) return false;
    if (cycle.startDate && observation.date < cycle.startDate) return false;
    if (cycle.endDate && observation.date > cycle.endDate) return false;
    dates.add(observation.date);
    observationIds.add(observation.id);
  }
  return true;
}

/** Structural guard for local v2 data; deliberately does not validate fertility rules. */
export function validateV2Data(value) {
  if (!isObject(value) || value.schema !== DATA_SCHEMA ||
      value.schemaVersion !== DATA_SCHEMA_VERSION ||
      !validCycle(value.currentCycle) || !Array.isArray(value.history) ||
      !isObject(value.migration) ||
      value.migration.from !== "legacy-array-v1" ||
      value.migration.status !== "completed" ||
      value.migration.fertilityClassification !== "not_created" ||
      !(value.profile === null || isObject(value.profile)) ||
      !(value.learning === null || isObject(value.learning))) return false;

  const cycleIds = new Set([value.currentCycle.id]);
  const observationIds = new Set(value.currentCycle.observations.map(o => o.id));
  for (const cycle of value.history) {
    if (!validCycle(cycle) || cycleIds.has(cycle.id)) return false;
    cycleIds.add(cycle.id);
    for (const observation of cycle.observations) {
      if (observationIds.has(observation.id)) return false;
      observationIds.add(observation.id);
    }
  }
  return true;
}
