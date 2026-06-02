# AMO source submission — element-copier

This archive mirrors the developer catalog layout: `element-copier/` plus shared `lib/`.
Rebuild the extension from source before upload.

## Environment

- **OS:** Ubuntu on **ARM64** (Mozilla AMO build workers; local macOS/Windows also work for a smoke rebuild).
- **Node.js:** **24.x** (AMO default). **npm** 10+ (bundled with Node 24).
- **zip:** required for the final `.zip` artifact (`apt install zip` on Debian/Ubuntu).

## One-shot rebuild (from this directory)

```bash
./rebuild.mjs
# or: node rebuild.mjs
```

## Step by step

```bash
cd lib && npm ci && cd ..
node lib/scripts/pack-extension.mjs element-copier
```

Build only (no zip/dist pack):

```bash
cd element-copier && node scripts/build.mjs
```

## Outputs

| Artifact | Path |
|----------|------|
| Unpacked extension (store layout) | `element-copier/dist/` |
| Uploadable archive | `element-copier/PUBLICATION/element-copier-<version>.zip` (version from `manifest.json`) |

Intermediate bundles (`background.js`, `content.js`, `welcome.js`) are produced in `element-copier/` by `scripts/build.mjs` (esbuild, shared code from `lib/src`).

## Notes

- `blocked-notice.js` is a copy of `lib/src/page-operability/blocked-notice-page.js` (symlinks resolved in this tree).
- Dependencies install only under `lib/`; the extension project does not need `npm ci`.
