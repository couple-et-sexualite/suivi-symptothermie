#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');

const [aPath,bPath]=process.argv.slice(2);
if(!aPath||!bPath){console.error('Usage: node scripts/compare-rps02-annotations.js <annotateur-A.json> <annotateur-B.json>');process.exit(2);}
const a=JSON.parse(fs.readFileSync(path.resolve(aPath),'utf8'));
const b=JSON.parse(fs.readFileSync(path.resolve(bPath),'utf8'));
const dims=['presence','visibleColor','texture','stretchiness','transparency','apparentAmount','support','lightingClass','qualityStatus'];
const byId=x=>new Map((x.annotations||[]).map(r=>[r.blindImageId,r]));
const ma=byId(a), mb=byId(b);
const ids=[...new Set([...ma.keys(),...mb.keys()])].sort();
if(ids.length!==9||ids.some(id=>!/^RPS02-A0[1-9]$/.test(id))) throw new Error('Le jeu comparé doit contenir exactement les 9 IDs aveugles.');
const rows=[];
for(const id of ids){
 const ra=ma.get(id), rb=mb.get(id);
 if(!ra||!rb) throw new Error('Annotation manquante pour '+id);
 for(const dim of dims){
  const va=ra[dim]||'', vb=rb[dim]||'';
  rows.push({blindImageId:id,dimension:dim,a:va,b:vb,agree:va!==''&&vb!==''&&va===vb});
 }
}
const summary=dims.map(dim=>{
 const x=rows.filter(r=>r.dimension===dim);
 const comparable=x.filter(r=>r.a!==''&&r.b!=='');
 return {dimension:dim,comparable:comparable.length,agreement:comparable.length?comparable.filter(r=>r.agree).length/comparable.length:null};
});
console.log(JSON.stringify({schemaVersion:'1.0.0',purpose:'Accord inter-annotateurs descriptif RPS-02; aucune vérité clinique ou catégorisation de fertilité.',annotators:[a.annotatorId||'A',b.annotatorId||'B'],images:9,summary,disagreements:rows.filter(r=>r.a!==r.b)},null,2));
