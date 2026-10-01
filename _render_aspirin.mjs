// Render lai rieng 186-aspirin (fail timeout <Img> 120s -> tang len 300s).
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const RTMP = path.resolve("_rendertmp");
fs.mkdirSync(RTMP, { recursive: true });
process.env.TMPDIR = RTMP; process.env.TEMP = RTMP; process.env.TMP = RTMP;

const BUNDLE = path.resolve("_fixedbundle");

async function main() {
  console.log("Bundling to _fixedbundle ...");
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), outDir: BUNDLE });
  const slug = "aspirin", out = path.resolve("out", "186-aspirin.mp4");
  const comp = await selectComposition({ serveUrl, id: slug, inputProps: {} });
  let last = -1;
  await renderMedia({
    composition: comp, serveUrl, codec: "h264", outputLocation: out, concurrency: 1,
    timeoutInMilliseconds: 300000,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct !== last && pct % 25 === 0) { console.log(`  ${pct}%`); last = pct; }
    },
  });
  console.log("ASPIRIN DONE -> " + out);
}
main().catch((e) => { console.error("ASPIRIN FATAL:", e); process.exit(1); });
