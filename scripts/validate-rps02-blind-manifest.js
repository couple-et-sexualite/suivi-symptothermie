#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const blindPath='data/rps02-blind-annotation-view.json';
const provenancePath='data/rps02-local-asset-manifest.json';
const blind=JSON.parse(fs.readFileSync(blindPath,'utf8'));
const provenance=JSON.parse(fs.readFileSync(provenancePath,'utf8'));

const forbidden=['sourceUrl','sourceRecordId','imageId','label','mapping','justisse','rps02Mapping','expected','category'];
const bad=[];
if(!Array.isArray(blind.records)||blind.records.length!==9) throw new Error('Le jeu aveugle doit contenir exactement 9 images.');
for(const r of blind.records){
  for(const k of Object.keys(r)) if(forbidden.includes(k)||forbidden.some(f=>String(r[k]??'').toLowerCase().includes(f))) bad.push([r.blindImageId,k,r[k]]);
}
if(bad.length) throw new Error('Fuite de métadonnées aveugles: '+JSON.stringify(bad));

const ids=blind.records.map(r=>r.blindImageId);
if(new Set(ids).size!==9) throw new Error('IDs aveugles dupliqués.');

const provenanceById=new Map((provenance.records||[]).map(r=>[r.blindImageId,r]));
if(provenanceById.size!==9) throw new Error('La provenance locale doit contenir exactement 9 assets.');

for(let i=1;i<=9;i++){
 const id=`RPS02-A0${i}`;
 const r=blind.records.find(v=>v.blindImageId===id);
 if(!r) throw new Error('ID aveugle manquant: '+id);
 if(Object.keys(r).sort().join(',')!=='assetPath,blindImageId') throw new Error('Schéma aveugle inattendu: '+id);
 if(typeof r.assetPath!=='string'||!/^\.\/rps02-blind-assets\/RPS02-A0[1-9]\.jpg$/.test(r.assetPath)) throw new Error('assetPath local invalide: '+id);

 const p=provenanceById.get(id);
 if(!p) throw new Error('Provenance manquante: '+id);
 if(p.assetPath!==r.assetPath) throw new Error('Chemin divergent entre manifest aveugle et provenance: '+id);

 const file=path.normalize(path.join(path.dirname(blindPath),r.assetPath));
 if(!fs.existsSync(file)) throw new Error('Asset local manquant: '+file);
 const bytes=fs.readFileSync(file);
 if(bytes.length===0) throw new Error('Asset vide: '+id);
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 if(hash!==p.sha256) throw new Error('SHA-256 divergent: '+id);
 if(bytes.length!==p.bytes) throw new Error('Taille divergente: '+id);
 console.log(id,hash,bytes.length);
}
console.log('RPS-02 blind manifest: OK — 9 assets locaux présents, aveugles et intégralement vérifiés.');
