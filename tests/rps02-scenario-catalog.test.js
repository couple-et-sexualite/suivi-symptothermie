import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const catalog=JSON.parse(fs.readFileSync("data/rps02-scenario-catalog.json","utf8"));

test("RPS-02 scenario catalog contains the complete engineering scenario set",()=>{
  assert.equal(catalog.scenarios.length,28);
  assert.deepEqual(catalog.scenarios.map(x=>x.id),Array.from({length:28},(_,i)=>"S"+String(i+1).padStart(2,"0")));
  for(const s of catalog.scenarios){
    assert.ok(s.area);
    assert.ok(s.expect);
    assert.ok(s.description);
  }
});

test("RPS-02 scenario catalog explicitly keeps methodological gates pending",()=>{
  const s=catalog.scenarios.find(x=>x.id==="S28");
  assert.equal(s.expect,"pending_expert");
  assert.match(s.description,/independent annotation/i);
});
