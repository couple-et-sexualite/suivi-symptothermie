import { validateV2Data } from "./symrella-data-v2.mjs";
import { V2_STORAGE_KEY } from "./symrella-storage-migration.mjs";
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
