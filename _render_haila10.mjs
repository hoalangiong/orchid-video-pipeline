// Render solo HaiLaComedy10 -> out/221-haila-phongnam.mp4
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const RTMP = path.resolve("_rendertmp");
fs.mkdirSync(RTMP, { recursive: true });
process.env.TMPDIR = RTMP; process.env.TEMP = RTMP; process.env.TMP = RTMP;

const BUNDLE = path.resolve("_fixedbundle");

async function main() {
  console.log("Bundling ...");
  const serveUrl = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    outDir: BUNDLE,
    onProgress: (p) => { if (p % 25 === 0) console.log("  bundle", p + "%"); },
  });
  const out = path.resolve("out", "221-haila-phongnam.mp4");
  const comp = await selectComposition({ serveUrl, id: "HaiLaComedy10", inputProps: {} });
  console.log("Rendering", comp.durationInFrames, "frames ...");
  let last = -1;
  await renderMedia({
    composition: comp, serveUrl, codec: "h264", outputLocation: out, concurrency: 1,
    timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct !== last && pct % 20 === 0) { console.log(`  ${pct}%`); last = pct; }
    },
  });
  console.log("DONE ->", out);
}
main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
