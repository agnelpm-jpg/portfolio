import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync("index.html", "utf8");

// Only inline JS scripts (not JSON-LD or scripts with a src) should parse as JavaScript.
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attrs]) => !/type\s*=\s*["']application\/(ld\+json|json)["']/i.test(attrs))
  .map(([, , body]) => body);
for (const script of scripts) {
  new Function(script);
}

// Every /papers/*.html link referenced from the homepage must exist on disk.
const paperLinks = [...html.matchAll(/\/papers\/([\w-]+\.html)/g)].map((m) => m[1]);
const missingPaperPages = paperLinks.filter((f) => !fs.existsSync(path.join("papers", f)));

// Each paper page fetches a markdown source (relative to its own directory); confirm it exists.
const paperFiles = fs.readdirSync("papers").filter((f) => f.endsWith(".html"));
const missingSources = [];
for (const file of paperFiles) {
  const content = fs.readFileSync(path.join("papers", file), "utf8");
  const match = content.match(/fetch\(['"]([^'"]+\.md)['"]/);
  if (!match) continue;
  const resolved = path.join("papers", match[1]);
  if (!fs.existsSync(resolved)) missingSources.push(`${file} -> ${match[1]}`);
}

const checks = {
  mathjaxOnEveryPaperPage: paperFiles.every((f) =>
    fs.readFileSync(path.join("papers", f), "utf8").includes("tex-svg.js")
  ),
  allPaperLinksExist: missingPaperPages.length === 0,
  allPaperSourcesExist: missingSources.length === 0,
};

for (const [name, ok] of Object.entries(checks)) {
  if (!ok) {
    if (name === "allPaperLinksExist") console.error("missing pages:", missingPaperPages);
    if (name === "allPaperSourcesExist") console.error("missing sources:", missingSources);
    throw new Error(`failed: ${name}`);
  }
}

console.log("verify ok");
