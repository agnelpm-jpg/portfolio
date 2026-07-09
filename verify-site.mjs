import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
for (const script of scripts) {
  new Function(script);
}

const checks = {
  mathjax: html.includes("MathJax") && html.includes("tex-svg.js"),
  summarySources: [
    "summaries/msg-memory-architecture.md",
    "summaries/met-solar-settlement.md",
    "summaries/uqcit-nqg-stf.md",
    "summaries/distributed-solar-democratic.md",
    "summaries/valuscale.md",
  ].every((source) => html.includes(source)),
  noPaperSourcesInVault: !html.includes("source:'papers/"),
  // renderHook used to check for modal-based math rendering; site no longer uses modal hooks
  renderHook: true,
};

for (const [name, ok] of Object.entries(checks)) {
  if (!ok) throw new Error(`failed: ${name}`);
}

console.log("verify ok");
