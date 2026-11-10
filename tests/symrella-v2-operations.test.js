import test from "node:test";
import assert from "node:assert/strict";
import { migrateLegacyData } from "../src/symrella-data-v2.mjs";
import { V2_STORAGE_KEY } from "../src/symrella-storage-migration.mjs";
import {
  readV2Store, updateV2Observation, deleteV2Observation,
  archiveV2CurrentCycle, deleteV2HistoryCycle,
  exportV2Store, importV2Store, clearV2Store
} from "../src/symrella-v2-operations.mjs";

function storage(initial={}) {
  const map=new Map(Object.entries(initial));
  return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),snapshot:()=>Object.fromEntries(map)};
}
function fixture() {
  return migrateLegacyData({
    current:[
      {date:"2026-01-02",temp:36.4,mucus:"cremeuse",bleeding:"aucun",notes:"Note A",factors:[],time:"06:30"},
      {date:"2026-01-03",temp:36.5,mucus:"blanc-oeuf",bleeding:"aucun",notes:"Note B",factors:[],time:"06:35"}
    ],history:[]
  },{idFactory:(prefix,index)=>prefix+"-"+index});
}
function setup() {const data=fixture();return {data,store:storage({[V2_STORAGE_KEY]:JSON.stringify(data)})};}

test("update preserves identity and invalidates calculated results",()=>{
  const {data,store}=setup(),id=data.currentCycle.observations[0].id;
  const result=updateV2Observation(store,id,{generalNotes:"Texte corrigé"});
  assert.equal(result.currentCycle.observations[0].generalNotes,"Texte corrigé");
  assert.equal(result.currentCycle.observations[0].id,id);
  assert.equal(result.currentCycle.derived.status,"not_evaluated");
  assert.throws(()=>updateV2Observation(store,id,{date:"2026-02-01"}),/ne peut pas être modifié/);
});
test("delete removes only the requested observation",()=>{
  const {data,store}=setup(),[first,second]=data.currentCycle.observations;
  const result=deleteV2Observation(store,first.id);
  assert.deepEqual(result.currentCycle.observations.map(x=>x.id),[second.id]);
  assert.equal(result.currentCycle.observations[0].generalNotes,"Note B");
});
test("archive moves the complete current cycle and creates an empty current cycle",()=>{
  const {data,store}=setup();
  const result=archiveV2CurrentCycle(store,{newCycleId:"cycle-next"});
  assert.equal(result.history.length,1);
  assert.equal(result.history[0].id,data.currentCycle.id);
  assert.equal(result.history[0].startDate,"2026-01-02");
  assert.equal(result.history[0].endDate,"2026-01-03");
  assert.equal(result.history[0].observations.length,2);
  assert.equal(result.currentCycle.id,"cycle-next");
  assert.equal(result.currentCycle.observations.length,0);
});
test("archive rejects a new cycle identifier already used by the current cycle",()=>{
  const {data,store}=setup();
  assert.throws(()=>archiveV2CurrentCycle(store,{newCycleId:data.currentCycle.id}),/existe déjà/);
  assert.equal(readV2Store(store).history.length,0);
});
test("archive refuses an empty current cycle and missing new identifier",()=>{
  const {store}=setup();
  const data=JSON.parse(store.getItem(V2_STORAGE_KEY));data.currentCycle.observations=[];
  store.setItem(V2_STORAGE_KEY,JSON.stringify(data));
  assert.throws(()=>archiveV2CurrentCycle(store,{newCycleId:"next"}),/aucune observation/);
});
test("delete archived cycle leaves current cycle untouched",()=>{
  const {data,store}=setup();
  archiveV2CurrentCycle(store,{newCycleId:"cycle-next"});
  const result=deleteV2HistoryCycle(store,data.currentCycle.id);
  assert.equal(result.history.length,0);
  assert.equal(result.currentCycle.id,"cycle-next");
});
test("export and import round-trip a complete v2 store",()=>{
  const {store}=setup(),backup=exportV2Store(store),target=storage();
  const imported=importV2Store(target,backup);
  assert.deepEqual(imported,JSON.parse(backup));
  assert.equal(exportV2Store(target),JSON.stringify(imported,null,2));
});
test("invalid import never overwrites the existing store",()=>{
  const {store}=setup(),before=store.getItem(V2_STORAGE_KEY);
  assert.throws(()=>importV2Store(store,'{"schema":"wrong"}'),/pas une base/);
  assert.equal(store.getItem(V2_STORAGE_KEY),before);
});
test("failed write rolls back to the previous complete store",()=>{
  const {store}=setup(),before=store.getItem(V2_STORAGE_KEY),original=store.setItem.bind(store);
  let writes=0;store.setItem=(k,v)=>{writes++;if(writes===1)throw new Error("quota");original(k,v);};
  assert.throws(()=>updateV2Observation(store,fixture().currentCycle.observations[0].id,{generalNotes:"x"}),/quota/);
  assert.equal(store.getItem(V2_STORAGE_KEY),before);
});
test("clear removes v2 and all legacy data to prevent accidental resurrection",()=>{
  const {store}=setup();
  for(const key of ["symptothermie_current_cycle","symptothermie_history","symptothermie_profile","symptothermie_learning_progress"]) store.setItem(key,"legacy");
  assert.equal(clearV2Store(store),true);
  for(const key of [V2_STORAGE_KEY,"symptothermie_current_cycle","symptothermie_history","symptothermie_profile","symptothermie_learning_progress"]) assert.equal(store.getItem(key),null);
});
test("clear rolls back every key if a deletion fails",()=>{
  const {store}=setup();store.setItem("symptothermie_current_cycle","legacy");
  const before=store.snapshot(),remove=store.removeItem.bind(store);let count=0;
  store.removeItem=key=>{if(++count===2)throw new Error("blocked");remove(key);};
  assert.throws(()=>clearV2Store(store),/blocked/);
  assert.deepEqual(store.snapshot(),before);
});
