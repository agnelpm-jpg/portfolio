import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SITE = "https://agnel.machfold.in";

// Each entry's lastmod is derived from the latest git commit touching its `files`,
// so the sitemap can never drift from what's actually been published.
const pages = [
  { loc: "/", files: ["index.html"], changefreq: "weekly", priority: "1.0" },
  { loc: "/papers/msg.html", files: ["papers/msg.html", "papers/msg-memory-architecture.md"], changefreq: "monthly", priority: "0.9" },
  { loc: "/papers/met.html", files: ["papers/met.html", "papers/met-solar-settlement.md"], changefreq: "monthly", priority: "0.9" },
  { loc: "/papers/uqcit.html", files: ["papers/uqcit.html", "papers/uqcit-nqg-stf.md"], changefreq: "monthly", priority: "0.9" },
  { loc: "/papers/distributed-solar.html", files: ["papers/distributed-solar.html", "papers/distributed-solar-democratic.md"], changefreq: "monthly", priority: "0.9" },
  { loc: "/papers/valuscale.html", files: ["papers/valuscale.html", "summaries/valuscale.md"], changefreq: "monthly", priority: "0.8" },
  { loc: "/thank-you/", files: ["thank-you/index.html"], changefreq: "yearly", priority: "0.3" },
];

function lastCommitDate(files) {
  const existing = files.filter((f) => fs.existsSync(f));
  if (existing.length) {
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...existing], { encoding: "utf8" }).trim();
      if (out) return out;
    } catch {
      // fall through to uncommitted/no-history case below
    }
  }
  return new Date().toISOString().slice(0, 10);
}

const urls = pages.map((p) => {
  const lastmod = lastCommitDate(p.files);
  return `  <url>\n    <loc>${SITE}${p.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

const outPath = "sitemap.xml";
const checkOnly = process.argv.includes("--check");

if (checkOnly) {
  const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
  if (current !== sitemap) {
    console.error("sitemap.xml is stale. Run `node scripts/generate-sitemap.mjs` and commit the result.");
    process.exit(1);
  }
  console.log("sitemap.xml is up to date");
} else {
  fs.writeFileSync(outPath, sitemap);
  console.log(`wrote ${outPath}`);
}
