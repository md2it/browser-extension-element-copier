#!/usr/bin/env node
/** AMO one-shot: npm ci in lib/, then build + pack element-copier. */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const libDir = join(root, "lib");
const npmCache = join(root, ".npm-cache");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log("▶ npm ci (lib/)...");
run("npm", ["ci"], {
  cwd: libDir,
  env: { ...process.env, NPM_CONFIG_CACHE: npmCache },
});

console.log("▶ pack-extension...");
run("node", [join(libDir, "scripts/pack-extension.mjs"), "element-copier"], {
  cwd: root,
});

console.log("✅ Rebuild complete.");
