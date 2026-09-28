#!/usr/bin/env node
const fs=require('node:fs');
const p='data/rps02-blind-annotation-view.json';
const x=JSON.parse(fs.readFileSync(p,'utf8'));
const forbidden=['sourceUrl','imageId','label','mapping','justisse','rps02Mapping','expected','category'];
const bad=[];
for(const r of x.records||[]){
  for(const k of Object.keys(r)) if(forbidden.includes(k)||forbidden.some(f=>String(r[k]??'').toLowerCase().includes(f))) bad.push([r.blindImageId,k]);
}
if(!Array.isArray(x.records)||x.records.length!==9) throw new Error('Le jeu aveugle doit contenir exactement 9 images.');
if(bad.length) throw new Error('Fuite de métadonnées aveugles: '+JSON.stringify(bad));
for(const r of x.records){
 if(!/^RPS02-A0[1-9]$/.test(r.blindImageId)) throw new Error('ID aveugle invalide: '+r.blindImageId);
 if(typeof r.assetUrl!=='string'||!/^https?:\/\//.test(r.assetUrl)) throw new Error('assetUrl invalide: '+r.blindImageId);
}
console.log('RPS-02 blind manifest: OK (9 IDs, aucune métadonnée source exposée).');
