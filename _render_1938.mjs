// Render lai 20 tap 19-38 sau khi bo lop phu den toan khung + them hop nen om caption.
// Bundle 1 lan -> _fixedbundle, TEMP rieng, render tuan tu (concurrency 1), ghi de file cu.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

// [compositionId, outFileName]
const JOBS = [
  ["OrchidContest", "19-cuoc-thi-lan-dep-nhat-lang.mp4"],
  ["OrchidMite", "20-nhan-biet-tri-nhen-do.mp4"],
  ["OrchidFly", "21-nhan-biet-tri-ruoi-chich-bong.mp4"],
  ["OrchidMealybug", "22-nhan-biet-tri-rep-sap.mp4"],
  ["OrchidRot", "23-nhan-biet-tri-thoi-nhun.mp4"],
  ["OrchidAnthrac", "24-nhan-biet-tri-than-thu.mp4"],
  ["OrchidThrips", "25-nhan-biet-tri-bo-tri.mp4"],
  ["OrchidRootRot", "26-nhan-biet-tri-thoi-re.mp4"],
  ["OrchidSunburn", "27-nhan-biet-tri-chay-nang.mp4"],
  ["OrchidSnail", "28-nhan-biet-tri-oc-sen.mp4"],
  ["OrchidAphid", "29-nhan-biet-tri-rep-muoi.mp4"],
  ["OrchidSooty", "30-nhan-biet-tri-nam-bo-hong.mp4"],
  ["OrchidVirus", "31-nhan-biet-phong-virus-kham.mp4"],
  ["OrchidCaterpillar", "32-nhan-biet-tri-sau-an-la.mp4"],
  ["OrchidLeafSpot", "33-nhan-biet-tri-dom-la.mp4"],
  ["OrchidBlackRot", "34-nhan-biet-tri-thoi-den-gia-hanh.mp4"],
  ["OrchidScale", "35-nhan-biet-tri-rep-vay.mp4"],
  ["OrchidRainySeason", "36-cham-soc-lan-mua-mua.mp4"],
  ["OrchidNewPlant", "37-xu-ly-lan-moi-mua.mp4"],
  ["OrchidWatering", "38-tuoi-nuoc-lan.mp4"],
];

const RTMP = path.resolve("_rendertmp");
fs.mkdirSync(RTMP, { recursive: true });
process.env.TMPDIR = RTMP; process.env.TEMP = RTMP; process.env.TMP = RTMP;

const BUNDLE = path.resolve("_fixedbundle");

async function main() {
  console.log("Bundling to _fixedbundle ...");
  const serveUrl = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    outDir: BUNDLE,
    onProgress: (p) => { if (p % 25 === 0) console.log("  bundle", p + "%"); },
  });
  console.log("Bundle done. Rendering", JOBS.length, "videos.\n");

  let done = 0, fail = 0;
  for (const [id, outName] of JOBS) {
    const out = path.resolve("out", outName);
    try {
      const comp = await selectComposition({ serveUrl, id, inputProps: {} });
      let last = -1;
      await renderMedia({
        composition: comp, serveUrl, codec: "h264", outputLocation: out, concurrency: 1,
        onProgress: ({ progress }) => {
          const pct = Math.round(progress * 100);
          if (pct !== last && pct % 25 === 0) { console.log(`  [${id}] ${pct}%`); last = pct; }
        },
      });
      done++;
      console.log(`OK (${done}/${JOBS.length}) ${outName}\n`);
    } catch (e) {
      fail++;
      console.log(`FAIL ${outName}: ${e.message}\n`);
    }
  }
  console.log(`=== BATCH DONE: ${done} ok, ${fail} fail ===`);
}

main().catch((e) => { console.error("BATCH FATAL:", e); process.exit(1); });
