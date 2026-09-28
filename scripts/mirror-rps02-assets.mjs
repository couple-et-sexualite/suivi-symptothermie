#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const corpus=JSON.parse(await fs.readFile('data/rps02-visual-corpus.json','utf8'));
const outDir='data/rps02-blind-assets';
await fs.mkdir(outDir,{recursive:true});
const records=corpus.records||[];
if(records.length!==9) throw new Error('Le corpus source doit contenir exactement 9 références.');
const local=[];
for(let i=0;i<9;i++){
  const id='RPS02-A0'+(i+1);
  const src=records[i].assetUrl;
  if(!/^https?:\\/\\//.test(src)) throw new Error('URL source invalide pour '+id);
  const res=await fetch(src,{redirect:'follow'});
  if(!res.ok) throw new Error('Téléchargement '+id+': HTTP '+res.status);
  const input=Buffer.from(await res.arrayBuffer());
  if(!input.length) throw new Error('Asset vide: '+id);
  const tmp=path.join(outDir,'.'+id+'.source');
  const dst=path.join(outDir,id+'.jpg');
  await fs.writeFile(tmp,input);
  execFileSync('magick',[tmp,'-strip','-interlace','Plane',dst],{stdio:'inherit'});
  await fs.unlink(tmp);
  const bytes=await fs.readFile(dst);
  const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  local.push({blindImageId:id,assetPath:'../../data/rps02-blind-assets/'+id+'.jpg',sha256,bytes:bytes.length,sourceUrl:src,sourceRecordId:records[i].imageId,license:records[i].license,rightsStatus:records[i].rightsStatus});
}
await fs.writeFile('data/rps02-local-asset-manifest.json',JSON.stringify({version:'1.0.0',purpose:'Provenance non aveugle et intégrité des assets locaux RPS-02.',generatedAt:new Date().toISOString(),records:local},null,2)+'\\n');
console.log('Miroir RPS-02 créé: 9 assets locaux, EXIF retirés, SHA-256 calculés.');
