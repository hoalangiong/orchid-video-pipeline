// Hardened solo render for crash-prone episodes. Usage: node _render_solo_hardened.mjs <compId> <outSlug>
// Fixes "Page crashed!" (Chromium OOM / Intel GPU crash) via software GL + disabled GPU + capped video cache.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const COMP = process.argv[2];
const SLUG = process.argv[3];
if (!COMP || !SLUG) { console.error("need <compId> <outSlug>"); process.exit(2); }

const RTMP = path.resolve("_rendertmp");
fs.mkdirSync(RTMP, { recursive: true });
process.env.TMPDIR = RTMP; process.env.TEMP = RTMP; process.env.TMP = RTMP;
const BUNDLE = path.resolve("_fixedbundle");

async function main() {
  console.log("Bundling ...");
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), outDir: BUNDLE });
  const out = path.resolve("out", SLUG + ".mp4");
  const comp = await selectComposition({ serveUrl, id: COMP, inputProps: {} });
  console.log("Rendering", comp.durationInFrames, "frames (hardened) ...");
  let last = -1;
  await renderMedia({
    composition: comp, serveUrl, codec: "h264", outputLocation: out,
    concurrency: 1,
    timeoutInMilliseconds: 180000,
    // memory/crash hardening:
    chromiumOptions: { gl: "swiftshader", headless: true },
    offthreadVideoCacheSizeInBytes: 300 * 1024 * 1024, // cap video-frame RAM at 300MB
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct !== last && pct % 20 === 0) { console.log(`  ${pct}%`); last = pct; }
    },
  });
  console.log("DONE ->", out);
}
main().catch((e) => { console.error("FATAL:", e.message || e); process.exit(1); });
