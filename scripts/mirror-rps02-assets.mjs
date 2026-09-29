#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '@playwright/test';

const PAGE='https://mucus.justisse.ca/finger-testable-observations';
const corpus=JSON.parse(await fs.readFile('data/rps02-visual-corpus.json','utf8'));
const outDir='data/rps02-blind-assets';
await fs.mkdir(outDir,{recursive:true});
const records=corpus.records||[];
if(records.length!==9) throw new Error('Le corpus source doit contenir exactement 9 références.');

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({
  viewport:{width:1440,height:1200},
  userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36'
});
const page=await context.newPage();
await page.goto(PAGE,{waitUntil:'networkidle',timeout:120000});

const imageEntries=await page.locator('img').evaluateAll(imgs=>imgs.map((img,index)=>({index,url:img.currentSrc||img.src||img.getAttribute('data-src')||''})).filter(x=>x.url.includes('lh7-us.googleusercontent.com/sitesv-images-rt/')));
const unique=[...new Map(imageEntries.map(x=>[x.url,x])).values()];
if(unique.length<13) throw new Error('La galerie n’expose pas les 13 premières images attendues; trouvé '+unique.length+'.');

const sourceIndexes=[0,2,3,4,5,6,7,11,12];
const local=[];
for(let i=0;i<records.length;i++){
  const id='RPS02-A0'+(i+1);
  const expected=records[i].assetUrl;
  const actual=unique[sourceIndexes[i]].url;
  const imageIndex=unique[sourceIndexes[i]].index;
  if(actual!==expected) throw new Error('URL source inattendue pour '+id+'; la page Justisse a changé ou le corpus n’est plus synchronisé.');

  const loc=page.locator('img').nth(imageIndex);
  await loc.scrollIntoViewIfNeeded();
  await loc.waitFor({state:'visible',timeout:30000});
  await page.waitForTimeout(250);
  const ready=await loc.evaluate(img=>({complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight}));
  if(!ready.complete||!ready.naturalWidth) throw new Error('Image non chargée dans le navigateur: '+id);
  await loc.evaluate((img)=>{
    img.style.width=img.naturalWidth+'px';
    img.style.height=img.naturalHeight+'px';
    img.style.maxWidth='none';
  });
  const dst=path.join(outDir,id+'.jpg');
  await loc.screenshot({path:dst,type:'jpeg',quality:100});
  const bytes=await fs.readFile(dst);
  if(!bytes.length) throw new Error('Asset vide: '+id);
  const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  local.push({
    blindImageId:id,
    assetPath:'../../data/rps02-blind-assets/'+id+'.jpg',
    sha256,
    bytes:bytes.length,
    sourceUrl:actual,
    sourceRecordId:records[i].imageId,
    license:records[i].license,
    rightsStatus:records[i].rightsStatus,
    acquisition:'browser-rendered local mirror from the official Justisse gallery; no source-host access-control bypass'
  });
}
await browser.close();
await fs.writeFile('data/rps02-local-asset-manifest.json',JSON.stringify({
  version:'1.1.0',
  purpose:'Provenance non aveugle et intégrité des assets locaux RPS-02.',
  generatedAt:new Date().toISOString(),
  sourcePage:PAGE,
  records:local
},null,2)+'\n');
console.log('Miroir RPS-02 créé: 9 assets locaux, rendus depuis la galerie officielle, sans EXIF de source.');
