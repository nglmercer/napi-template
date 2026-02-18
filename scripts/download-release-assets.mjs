#!/usr/bin/env node
/**
 * Download all assets from a GitHub release.
 *
 * Usage:
 *   node scripts/download-release-assets.mjs --owner USER --repo REPO [options]
 *
 * Options:
 *   --owner   GitHub owner/org (or GITHUB_OWNER env)
 *   --repo    Repository name (or GITHUB_REPO env)
 *   --tag     Release tag (default: "latest")
 *   --token   GitHub PAT (optional, increases rate limit)
 *   --out     Output directory (default: "./downloads")
 *   --filter  Regex to filter assets (e.g. "\.node$")
 *   --help    Show help
 *
 * Examples:
 *   GITHUB_OWNER=nglmercer GITHUB_REPO=napi-template node scripts/download-release-assets.mjs
 *   node scripts/download-release-assets.mjs --owner nglmercer --repo napi-template --tag v1.0.0 --filter "\.node$"
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { URL } from "node:url";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node scripts/download-release-assets.mjs [options]

Options:
  --owner   GitHub owner/org (or GITHUB_OWNER env)
  --repo    Repository name (or GITHUB_REPO env)
  --tag     Release tag (default: "latest")
  --token   GitHub PAT (optional)
  --out     Output directory (default: "./downloads")
  --filter  Regex to filter assets
  --help    Show this help`);
  process.exit(0);
}

function parseArgs() {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      opts[args[i].slice(2)] = args[++i];
    }
  }
  return {
    owner: opts.owner || process.env.GITHUB_OWNER || "",
    repo: opts.repo || process.env.GITHUB_REPO || "",
    tag: opts.tag || process.env.RELEASE_TAG || "latest",
    token: opts.token || process.env.GITHUB_TOKEN || "",
    out: opts.out || process.env.OUTPUT_DIR || "./downloads",
    filter: opts.filter || "",
  };
}

function formatBytes(b) {
  if (!b) return "0 B";
  const k = 1024;
  const s = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${s[i]}`;
}

function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https
      .get(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          headers: {
            "User-Agent": "download-release-assets/1.0",
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...headers,
          },
        },
        (res) => {
          if ([301, 302, 307].includes(res.statusCode)) {
            return resolve(httpGet(res.headers.location, headers));
          }
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => resolve({ status: res.statusCode, body: data }));
        }
      )
      .on("error", reject);
  });
}

function downloadFile(url, dest, headers = {}) {
  return new Promise((resolve, reject) => {
    const doReq = (reqUrl) => {
      const u = new URL(reqUrl);
      https
        .get(
          {
            hostname: u.hostname,
            path: u.pathname + u.search,
            headers: {
              "User-Agent": "download-release-assets/1.0",
              Accept: "application/octet-stream",
              ...headers,
            },
          },
          (res) => {
            if ([301, 302, 307].includes(res.statusCode)) {
              return doReq(res.headers.location);
            }
            if (res.statusCode !== 200) {
              return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const total = parseInt(res.headers["content-length"] || "0", 10);
            let received = 0;
            const file = fs.createWriteStream(dest);
            res.on("data", (chunk) => {
              received += chunk.length;
              const pct = total ? Math.round((received / total) * 100) : 0;
              process.stdout.write(`\r  Downloading: ${pct}% (${formatBytes(received)})`);
            });
            res.on("end", () => {
              file.end();
              process.stdout.write("\n");
              resolve(received);
            });
            res.on("error", (e) => {
              file.destroy();
              fs.unlink(dest, () => {});
              reject(e);
            });
            res.pipe(file);
          }
        )
        .on("error", reject);
    };
    doReq(url);
  });
}

async function main() {
  const cfg = parseArgs();

  if (!cfg.owner || !cfg.repo) {
    console.error("Error: --owner and --repo are required (or set GITHUB_OWNER/GITHUB_REPO env)");
    process.exit(1);
  }

  const auth = cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {};

  console.log(`Repository: ${cfg.owner}/${cfg.repo}`);
  console.log(`Tag: ${cfg.tag}`);
  console.log(`Output: ${cfg.out}`);

  // Get release info
  const releaseUrl =
    cfg.tag === "latest"
      ? `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/releases/latest`
      : `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/releases/tags/${cfg.tag}`;

  const res = await httpGet(releaseUrl, auth);
  if (res.status === 404) {
    console.error(`Error: Release "${cfg.tag}" not found`);
    process.exit(1);
  }
  if (res.status !== 200) {
    console.error(`Error: API returned ${res.status}`);
    process.exit(1);
  }

  const release = JSON.parse(res.body);
  let assets = release.assets || [];

  if (assets.length === 0) {
    console.log("No assets found in this release.");
    process.exit(0);
  }

  if (cfg.filter) {
    const re = new RegExp(cfg.filter, "i");
    assets = assets.filter((a) => re.test(a.name));
    console.log(`Filter applied: ${assets.length} asset(s) match`);
  }

  // Create output directory
  const outDir = path.resolve(cfg.out, release.tag_name);
  fs.mkdirSync(outDir, { recursive: true });

  // Download assets
  let success = 0, failed = 0, skipped = 0;

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const dest = path.join(outDir, asset.name);
    console.log(`\n[${i + 1}/${assets.length}] ${asset.name} (${formatBytes(asset.size)})`);

    // Skip if exists with same size
    if (fs.existsSync(dest) && fs.statSync(dest).size === asset.size) {
      console.log("  Already exists, skipping");
      skipped++;
      continue;
    }

    try {
      await downloadFile(asset.url, dest, { ...auth, Accept: "application/octet-stream" });
      console.log(`  Saved: ${dest}`);
      success++;
    } catch (e) {
      console.error(`  Failed: ${e.message}`);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      failed++;
    }
  }

  console.log(`\nDone: ${success} downloaded, ${skipped} skipped, ${failed} failed`);
  console.log(`Output: ${outDir}`);

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});