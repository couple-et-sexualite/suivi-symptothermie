const MAX_ENTRIES_PER_CYCLE = 3700;
const MAX_HISTORY_CYCLES = 200;

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function nextId(options, prefix, index) {
  return typeof options.idFactory === 'function'
    ? options.idFactory(prefix, index)
    : prefix + '-' + (index + 1);
}

function mapEntry(entry, index, options) {
  if (!isObject(entry) || !validDate(entry.date)) throw new TypeError('Une observation possède une date invalide.');
  const temperature = entry.temp === null || entry.temp === undefined ? null : entry.temp;
  if (temperature !== null && (typeof temperature !== 'number' || !Number.isFinite(temperature) || temperature < 34 || temperature > 42)) {
    throw new TypeError('Une température enregistrée est invalide.');
  }
  return {
    id: nextId(options, 'observation', index),
    date: entry.date,
    temperature: { valueC: temperature },
    mucus: typeof entry.mucus === 'string' ? entry.mucus : 'sec',
    notes: typeof entry.notes === 'string' ? entry.notes : '',
    factors: Array.isArray(entry.factors) ? entry.factors.slice() : [],
    bleeding: typeof entry.bleeding === 'string' ? entry.bleeding : 'aucun',
    time: typeof entry.time === 'string' ? entry.time : null,
    ...(isObject(entry.cervical) ? { cervical: { ...entry.cervical } } : {})
  };
}

export function migrateLegacyData(snapshot, options = {}) {
  if (!isObject(snapshot) || !Array.isArray(snapshot.current) || !Array.isArray(snapshot.history) ||
      !isObject(snapshot.profile) || !isObject(snapshot.learning)) {
    throw new TypeError('Une sauvegarde complète est requise.');
  }
  if (snapshot.current.length > MAX_ENTRIES_PER_CYCLE || snapshot.history.length > MAX_HISTORY_CYCLES) {
    throw new TypeError('La sauvegarde dépasse les limites autorisées.');
  }
  const observations = snapshot.current.map((entry, index) => mapEntry(entry, index, options));
  const history = snapshot.history.map((cycle, cycleIndex) => {
    if (!isObject(cycle) || !validDate(cycle.start) || !validDate(cycle.end) ||
        cycle.start > cycle.end || !Array.isArray(cycle.entries) || !cycle.entries.length) {
      throw new TypeError('Un cycle archivé est invalide.');
    }
    return {
      id: nextId(options, 'history-cycle', cycleIndex),
      start: cycle.start,
      end: cycle.end,
      observations: cycle.entries.map((entry, index) => mapEntry(entry, index, options))
    };
  });
  return {
    version: 2,
    currentCycle: {
      id: nextId(options, 'current-cycle', 0),
      observations
    },
    history,
    profile: { ...snapshot.profile },
    learning: { ...snapshot.learning },
    migratedAt: options.migratedAt === undefined ? new Date().toISOString() : options.migratedAt
  };
}

export function validateV2Data(value) {
  if (!isObject(value) || value.version !== 2 || !isObject(value.currentCycle) ||
      typeof value.currentCycle.id !== 'string' || !Array.isArray(value.currentCycle.observations) ||
      !Array.isArray(value.history) || !isObject(value.profile) || !isObject(value.learning)) return false;
  if (value.currentCycle.observations.length > MAX_ENTRIES_PER_CYCLE || value.history.length > MAX_HISTORY_CYCLES) return false;
  const validObservation = item => isObject(item) && typeof item.id === 'string' && validDate(item.date) &&
    isObject(item.temperature) && (item.temperature.valueC === null ||
      (typeof item.temperature.valueC === 'number' && Number.isFinite(item.temperature.valueC) &&
       item.temperature.valueC >= 34 && item.temperature.valueC <= 42)) &&
    typeof item.mucus === 'string' && typeof item.notes === 'string' &&
    Array.isArray(item.factors) && typeof item.bleeding === 'string' &&
    (item.time === null || typeof item.time === 'string');
  if (!value.currentCycle.observations.every(validObservation)) return false;
  return value.history.every(cycle => isObject(cycle) && typeof cycle.id === 'string' &&
    validDate(cycle.start) && validDate(cycle.end) && cycle.start <= cycle.end &&
    Array.isArray(cycle.observations) && cycle.observations.length > 0 &&
    cycle.observations.every(validObservation));
}
