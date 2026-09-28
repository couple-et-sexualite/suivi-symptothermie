#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const p='data/rps02-blind-annotation-view.json';
const x=JSON.parse(fs.readFileSync(p,'utf8'));
const forbidden=['sourceUrl','imageId','label','mapping','justisse','rps02Mapping','expected','category'];
const bad=[];
if(!Array.isArray(x.records)||x.records.length!==9) throw new Error('Le jeu aveugle doit contenir exactement 9 images.');
for(const r of x.records||[]){
  for(const k of Object.keys(r)) if(forbidden.includes(k)||forbidden.some(f=>String(r[k]??'').toLowerCase().includes(f))) bad.push([r.blindImageId,k,r[k]]);
}
if(bad.length) throw new Error('Fuite de métadonnées aveugles: '+JSON.stringify(bad));
const ids=x.records.map(r=>r.blindImageId);
for(let i=1;i<=9;i++){
 const id=`RPS02-A0${i}`;
 const r=x.records.find(v=>v.blindImageId===id);
 if(!r) throw new Error('ID aveugle manquant: '+id);
 if(Object.keys(r).sort().join(',')!=='assetPath,blindImageId') throw new Error('Schéma aveugle inattendu: '+id);
 if(typeof r.assetPath!=='string'||!/^\.\.\/\.\.\/data\/rps02-blind-assets\/RPS02-A0[1-9]\.jpg$/.test(r.assetPath)) throw new Error('assetPath local invalide: '+id);
 const file=path.normalize(path.join(path.dirname(p),r.assetPath));
 if(!fs.existsSync(file)) throw new Error('Asset local manquant: '+file);
 const bytes=fs.readFileSync(file);
 if(bytes.length===0) throw new Error('Asset vide: '+id);
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 console.log(id,hash,bytes.length);
}
if(new Set(ids).size!==9) throw new Error('IDs aveugles dupliqués.');
console.log('RPS-02 blind manifest: OK — 9 assets locaux présents et non exposants.');
