import { migrateLegacyData, validateV2Data } from './symrella-data-v2.mjs';
import { V2_STORAGE_KEY } from './symrella-storage-migration.mjs';

export function syncLegacySnapshotToV2(storage, snapshot, options = {}) {
  const raw = storage.getItem(V2_STORAGE_KEY);
  let previous = null;
  if (raw !== null) {
    try { previous = JSON.parse(raw); } catch { throw new Error('Les données v2 existantes sont illisibles.'); }
    if (!validateV2Data(previous)) throw new Error('Les données v2 existantes sont invalides.');
  }

  const next = migrateLegacyData(snapshot, options);
  if (previous) {
    next.currentCycle.id = previous.currentCycle.id;
    const idsByDate = new Map(previous.currentCycle.observations.map(item => [item.date, item.id]));
    next.currentCycle.observations = next.currentCycle.observations.map(item => ({
      ...item,
      id: idsByDate.get(item.date) || item.id
    }));
  }
  if (!validateV2Data(next)) throw new Error('La structure v2 générée est invalide.');
  return next;
}
