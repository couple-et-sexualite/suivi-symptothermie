#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const corpusPath = "data/rps02-visual-corpus.json";
const localManifestPath = "data/rps02-local-asset-manifest.json";
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));
const localManifest = JSON.parse(fs.readFileSync(localManifestPath, "utf8"));

function dimensions(buffer, type) {
  if (type === "image/png") {
    if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (type === "image/jpeg") {
    let i = 2;
    while (i + 9 < buffer.length) {
      if (buffer[i] !== 0xff) { i++; continue; }
      const marker = buffer[i + 1];
      i += 2;
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        const h = buffer.readUInt16BE(i + 3);
        const w = buffer.readUInt16BE(i + 5);
        return { width: w, height: h };
      }
      if (i + 2 > buffer.length) break;
      const len = buffer.readUInt16BE(i);
      if (len < 2) break;
      i += len;
    }
  }
  return null;
}

const failures = [];
const warnings = [];
const required = ["imageId","sourceType","rightsStatus","qualityStatus","pedagogicalStatus","mappedFeatures"];
const enums = {
  sourceType: ["licensed_external","user_contributed","commissioned","original_symrella","synthetic_training_only"],
  rightsStatus: ["documented","restricted","pending","withdrawn"],
  qualityStatus: ["sufficient","insufficient","uncertain"],
  pedagogicalStatus: ["candidate","candidate_pending_expert","rights_verified","pedagogical_review","expert_review","validated","rejected","withdrawn"],
  rps02Mapping: ["validated","pending_expert","not_applicable","rejected"]
};

if (!Array.isArray(corpus.records) || corpus.records.length !== 9) {
  failures.push("Corpus: exactly 9 records are required");
}
if (!Array.isArray(localManifest.records) || localManifest.records.length !== 9) {
  failures.push("Local manifest: exactly 9 records are required");
}
const localById = new Map((localManifest.records || []).map(record => [record.blindImageId, record]));

for (const record of corpus.records || []) {
  for (const key of required) if (!(key in record)) failures.push(record.imageId + ": missing " + key);
  for (const [key, values] of Object.entries(enums)) if (key in record && !values.includes(record[key])) failures.push(record.imageId + ": invalid " + key + "=" + record[key]);
  const mf = record.mappedFeatures || {};
  for (const key of ["presence","visibleColor","texture","stretchiness","transparency","apparentAmount"]) if (!(key in mf)) failures.push(record.imageId + ": missing mappedFeatures." + key);
  if (record.rps02Mapping === "pending_expert" && Object.values(mf).some(v => v !== "unknown")) failures.push(record.imageId + ": pending_expert record contains a non-unknown mapped feature");

  const local = localById.get(record.internalId ? "RPS02-" + record.internalId : "");
  if (!record.localAssetPath || !record.sha256) {
    failures.push(record.imageId + ": localAssetPath/sha256 missing");
  } else if (!local) {
    failures.push(record.imageId + ": local provenance missing for " + record.internalId);
  } else {
    if (local.assetPath !== record.localAssetPath) failures.push(record.imageId + ": localAssetPath differs from provenance manifest");
    if (local.sha256 !== record.sha256) failures.push(record.imageId + ": corpus SHA-256 differs from provenance manifest");
    const localFile = path.resolve(path.dirname(localManifestPath), record.localAssetPath);
    if (!fs.existsSync(localFile)) {
      failures.push(record.imageId + ": local asset missing: " + localFile);
    } else {
      const bytes = fs.readFileSync(localFile);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");
      if (bytes.length !== local.bytes) failures.push(record.imageId + ": local byte size differs from provenance manifest");
      if (hash !== record.sha256) failures.push(record.imageId + ": local asset SHA-256 mismatch");
      if (!dimensions(bytes, "image/jpeg")) warnings.push({ imageId: record.imageId, reason: "local_jpeg_dimensions_unreadable" });
    }
  }
}

const report = [];
for (const record of corpus.records || []) {
  if (!record.assetUrl) {
    failures.push(record.imageId + ": assetUrl missing");
    continue;
  }
  try {
    const response = await fetch(record.assetUrl, {
      redirect: "follow",
      headers: { "user-agent": "SymRella-RPS02-corpus-check/1.0" }
    });
    if (!response.ok) {
      if (response.status === 400 || response.status === 403) {
        warnings.push({ imageId: record.imageId, reason: "external_asset_blocked_or_rejected", httpStatus: response.status });
        report.push({ imageId: record.imageId, url: record.assetUrl, status: "blocked_external", httpStatus: response.status });
        continue;
      }
      throw new Error("HTTP " + response.status);
    }
    const contentType = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
    if (!["image/jpeg","image/png","image/webp"].includes(contentType)) throw new Error("unsupported content-type: " + contentType);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) throw new Error("empty response");
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    const dim = dimensions(bytes, contentType);
    report.push({ imageId: record.imageId, url: record.assetUrl, finalUrl: response.url, contentType, bytes: bytes.length, sha256: hash, dimensions: dim });
    if (record.originalHash && record.originalHash !== hash) failures.push(record.imageId + ": SHA-256 mismatch");
  } catch (error) {
    failures.push(record.imageId + ": " + error.message);
  }
}

fs.mkdirSync("artifacts", { recursive: true });
fs.writeFileSync("artifacts/rps02-corpus-technical-report.json", JSON.stringify({
  generatedAt: new Date().toISOString(),
  records: report,
  localMirror: { records: localManifest.records?.length || 0, verified: failures.filter(f => f.includes("local")).length === 0 },
  failures,
  warnings
}, null, 2) + "\n");

if (failures.length) {
  console.error("RPS-02 corpus technical validation FAILED");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("RPS-02 corpus registry validation OK: " + corpus.records.length + "/" + corpus.records.length + " records structurally valid; local mirror integrity verified.");
if (warnings.length) console.warn("RPS-02 external/local checks completed with " + warnings.length + " warning(s).");
