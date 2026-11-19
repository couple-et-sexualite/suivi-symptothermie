import { migrateLegacyData, validateV2Data } from "./symrella-data-v2.mjs";
import { LEGACY_STORAGE_KEYS, V2_STORAGE_KEY } from "./symrella-storage-migration.mjs";
import { classifyV2Cycle } from "./symrella-v2-classification.mjs";
import { RPS02_VERSION } from "./rps02-engine.mjs";

const MAX_HISTORY_CYCLES = 200;
const clone = value => JSON.parse(JSON.stringify(value));
function readStore(storage) {
  const raw=storage.getItem(V2_STORAGE_KEY);
  if(raw===null) throw new Error("Aucune base SymRella v2 n'est initialisée.");
  let data; try{data=JSON.parse(raw);}catch{throw new Error("La base SymRella v2 est illisible.");}
  if(!validateV2Data(data)) throw new Error("La base SymRella v2 est invalide ; aucune modification effectuée.");
  return {raw,data};
}
function commitStore(storage,previousRaw,next) {
  if(!validateV2Data(next)) throw new Error("La modification produirait une base invalide.");
  const serialized=JSON.stringify(next);
  try {
    storage.setItem(V2_STORAGE_KEY,serialized);
    const check=storage.getItem(V2_STORAGE_KEY);
    if(check!==serialized||!validateV2Data(JSON.parse(check))) throw new Error("La vérification après écriture a échoué.");
    return JSON.parse(check);
  } catch(error) {
    try { if(previousRaw===null) storage.removeItem(V2_STORAGE_KEY); else storage.setItem(V2_STORAGE_KEY,previousRaw); } catch {}
    throw error;
  }
}
function findObservation(data,id,cycleId) {
  for(const cycle of [data.currentCycle,...data.history]) {
    if(cycleId&&cycle.id!==cycleId) continue;
    const index=cycle.observations.findIndex(item=>item.id===id);
    if(index!==-1) return {cycle,index};
  }
  return null;
}
export function readV2Store(storage){return clone(readStore(storage).data);}
export function updateV2Observation(storage,id,patch,cycleId=null) {
  if(!patch||typeof patch!=="object"||Array.isArray(patch)) throw new TypeError("Modification invalide.");
  const {raw,data}=readStore(storage),next=clone(data),found=findObservation(next,id,cycleId);
  if(!found) throw new Error("Observation introuvable.");
  for(const key of Object.keys(patch)) if(["id","date","source"].includes(key)) throw new Error(`Le champ ${key} ne peut pas être modifié ici.`);
  found.cycle.observations[found.index]={...found.cycle.observations[found.index],...clone(patch)};
  found.cycle.updatedAt=new Date().toISOString();
  found.cycle.derived={engineVersion:null,rulesetId:null,calculatedAt:null,status:"not_evaluated",days:[]};
  return commitStore(storage,raw,next);
}
export function deleteV2Observation(storage,id,cycleId=null) {
  const {raw,data}=readStore(storage),next=clone(data),found=findObservation(next,id,cycleId);
  if(!found) return data;
  found.cycle.observations.splice(found.index,1);
  found.cycle.updatedAt=new Date().toISOString();
  found.cycle.derived={engineVersion:null,rulesetId:null,calculatedAt:null,status:"not_evaluated",days:[]};
  return commitStore(storage,raw,next);
}
export function archiveV2CurrentCycle(storage,{newCycleId}={}) {
  const {raw,data}=readStore(storage);
  if(!data.currentCycle.observations.length) throw new Error("Le cycle en cours ne contient aucune observation.");
  if(data.history.length>=MAX_HISTORY_CYCLES) throw new Error("La limite de cycles archivés est atteinte.");
  if(typeof newCycleId!=="string"||!newCycleId.trim()) throw new TypeError("Un identifiant de nouveau cycle est requis.");
  if([data.currentCycle,...data.history].some(cycle=>cycle.id===newCycleId)) throw new Error("Cet identifiant de cycle existe déjà.");
  const next=clone(data),archived=next.currentCycle,dates=archived.observations.map(x=>x.date).sort();
  archived.startDate=dates[0]; archived.endDate=dates[dates.length-1]; archived.updatedAt=new Date().toISOString();
  next.history.unshift(archived);
  next.currentCycle={schema:"symrella.cycle",schemaVersion:2,id:newCycleId,createdAt:new Date().toISOString(),updatedAt:null,startDate:null,endDate:null,goal:archived.goal,method:clone(archived.method),observations:[],derived:{engineVersion:null,rulesetId:null,calculatedAt:null,status:"not_evaluated",days:[]}};
  return commitStore(storage,raw,next);
}
export function deleteV2HistoryCycle(storage,id) {
  const {raw,data}=readStore(storage),next=clone(data),index=next.history.findIndex(c=>c.id===id);
  if(index<0) return data;
  next.history.splice(index,1);
  return commitStore(storage,raw,next);
}
export function exportV2Store(storage){return JSON.stringify(readStore(storage).data,null,2);}
export function importV2Store(storage,jsonText) {
  if(typeof jsonText!=="string") throw new TypeError("La sauvegarde doit être un texte JSON.");
  let imported; try{imported=JSON.parse(jsonText);}catch{throw new Error("Le fichier de sauvegarde n'est pas un JSON valide.");}
  if(!validateV2Data(imported)) throw new Error("Cette sauvegarde n'est pas une base SymRella v2 valide.");
  return commitStore(storage,storage.getItem(V2_STORAGE_KEY),clone(imported));
}
export function clearV2Store(storage) {
  const keys=[V2_STORAGE_KEY,"symptothermie_current_cycle","symptothermie_history","symptothermie_profile","symptothermie_learning_progress"];
  const previous={};
  keys.forEach(key=>{previous[key]=storage.getItem(key);});
  try {
    keys.forEach(key=>storage.removeItem(key));
    if(keys.some(key=>storage.getItem(key)!==null)) throw new Error("La suppression n'a pas pu être vérifiée.");
    return true;
  } catch(error) {
    try {keys.forEach(key=>{if(previous[key]===null)storage.removeItem(key);else storage.setItem(key,previous[key]);});} catch {}
    throw error;
  }
}


/** Recalculate daily fertility statuses for the current or selected archived cycle. */
export function recalculateV2Cycle(storage, cycleId = null, language = "fr") {
  const {raw,data}=readStore(storage),next=clone(data);
  const cycle=cycleId
    ? [next.currentCycle,...next.history].find(item=>item.id===cycleId)
    : next.currentCycle;
  if(!cycle) throw new Error("Cycle introuvable.");
  const needsCalculation = cycle.derived?.status === "not_evaluated" ||
    cycle.derived?.engineVersion !== RPS02_VERSION ||
    cycle.derived?.days?.length !== cycle.observations.length;
  if (!needsCalculation) return data;
  cycle.derived=classifyV2Cycle(cycle,language);
  return commitStore(storage,raw,next);
}


const BACKUP_FORMAT = "symrella.backup";
const BACKUP_VERSION = 2;
const BACKUP_KEYS = Object.freeze([V2_STORAGE_KEY, ...Object.values(LEGACY_STORAGE_KEYS)]);

function validateBackupLegacy(legacy) {
  if (!legacy || typeof legacy !== "object" || Array.isArray(legacy) ||
      !Array.isArray(legacy.current) || !Array.isArray(legacy.history) ||
      legacy.history.length > MAX_HISTORY_CYCLES ||
      !(legacy.profile === null || (typeof legacy.profile === "object" && !Array.isArray(legacy.profile))) ||
      !(legacy.learning === null || (typeof legacy.learning === "object" && !Array.isArray(legacy.learning)))) {
    throw new Error("La partie historique de la sauvegarde est invalide.");
  }
  migrateLegacyData({
    current: legacy.current,
    history: legacy.history,
    profile: legacy.profile,
    learning: legacy.learning
  }, { idFactory: (prefix, index) => `backup-validation-${prefix}-${index}`, migratedAt: null });
  return true;
}

/**
 * Export both the complete v2 database and the snapshot consumed by the
 * current classic-script UI. V2 remains authoritative for detailed cervical
 * observations that the legacy projection cannot represent.
 */
export function exportCompleteBackup(storage, legacySnapshot) {
  const data = readV2Store(storage);
  const legacy = {
    current: clone(legacySnapshot?.current),
    history: clone(legacySnapshot?.history),
    profile: clone(legacySnapshot?.profile ?? null),
    learning: clone(legacySnapshot?.learning ?? null)
  };
  validateBackupLegacy(legacy);
  if (JSON.stringify(data.profile) !== JSON.stringify(legacy.profile) ||
      JSON.stringify(data.learning) !== JSON.stringify(legacy.learning)) {
    throw new Error("Le profil ou la progression ne correspondent pas à la base v2.");
  }
  return JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    legacy,
    v2: data
  }, null, 2);
}

/**
 * Restore all representations as one transaction. No key is changed until
 * the complete envelope and both data representations have been validated.
 */
export function importCompleteBackup(storage, jsonText) {
  if (typeof jsonText !== "string") throw new TypeError("La sauvegarde doit être un texte JSON.");
  let backup;
  try { backup = JSON.parse(jsonText); }
  catch { throw new Error("Le fichier de sauvegarde n'est pas un JSON valide."); }
  if (!backup || typeof backup !== "object" || Array.isArray(backup) ||
      backup.format !== BACKUP_FORMAT || backup.version !== BACKUP_VERSION ||
      typeof backup.exportedAt !== "string" || Number.isNaN(Date.parse(backup.exportedAt)) ||
      !validateV2Data(backup.v2)) {
    throw new Error("Cette sauvegarde SymRella complète est invalide.");
  }
  validateBackupLegacy(backup.legacy);
  if (JSON.stringify(backup.v2.profile) !== JSON.stringify(backup.legacy.profile) ||
      JSON.stringify(backup.v2.learning) !== JSON.stringify(backup.legacy.learning)) {
    throw new Error("Les représentations du profil ou de la progression sont incohérentes.");
  }

  const legacy = backup.legacy;
  const values = {
    [V2_STORAGE_KEY]: JSON.stringify(backup.v2),
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify(legacy.current),
    [LEGACY_STORAGE_KEYS.history]: JSON.stringify(legacy.history),
    [LEGACY_STORAGE_KEYS.profile]: JSON.stringify(legacy.profile),
    [LEGACY_STORAGE_KEYS.learning]: JSON.stringify(legacy.learning)
  };
  const previous = Object.fromEntries(BACKUP_KEYS.map(key => [key, storage.getItem(key)]));
  try {
    for (const key of BACKUP_KEYS) storage.setItem(key, values[key]);
    for (const key of BACKUP_KEYS) {
      if (storage.getItem(key) !== values[key]) throw new Error("La vérification après restauration a échoué.");
    }
    const restored = JSON.parse(storage.getItem(V2_STORAGE_KEY));
    if (!validateV2Data(restored)) throw new Error("La base v2 restaurée est invalide.");
    return clone(restored);
  } catch (error) {
    for (const key of BACKUP_KEYS) {
      try {
        if (previous[key] === null) storage.removeItem(key);
        else storage.setItem(key, previous[key]);
      } catch {}
    }
    throw error;
  }
}
