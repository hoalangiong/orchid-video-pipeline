// Tiep tuc render tu tap 141 -> 201 (46 video con lai) sau khi batch bi teardown.
// Tang timeout <Img> len 120s de tranh loi timeout frame nhu 141-muagiong.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const JOBS = [
  ["muagiong","141-muagiong.mp4"],["treogian","142-treogian.mp4"],["sangchau","143-sangchau.mp4"],
  ["teogiahanh","144-teogiahanh.mp4"],["rungnu","145-rungnu.mp4"],["thuanrung","146-thuanrung.mp4"],
  ["dichchuoi","147-dichchuoi.mp4"],["nangchay","148-nangchay.mp4"],["dongloat","149-dongloat.mp4"],
  ["nammua","150-nammua.mp4"],["chongiathe","151-chongiathe.mp4"],["tuoinuoc","152-tuoinuoc.mp4"],
  ["saurep","153-saurep.mp4"],["khongnohoa","154-khongnohoa.mp4"],["phanbietvoi","155-phanbietvoi.mp4"],
  ["hoalautan","156-hoalautan.mp4"],["nhinre","157-nhinre.mp4"],["lantrongnha","158-lantrongnha.mp4"],
  ["lannhuom","159-lannhuom.mp4"],["stnang","160-stnang.mp4"],["stgio","161-stgio.mp4"],
  ["sttuoi","162-sttuoi.mp4"],["stgiathe","163-stgiathe.mp4"],["stche","164-stche.mp4"],
  ["chainhua","165-chainhua.mp4"],["kiencham","166-kiencham.mp4"],["nuocmay","167-nuocmay.mp4"],
  ["ocsen","168-ocsen.mp4"],["hoisinh","169-hoisinh.mp4"],["chonmua","170-chonmua.mp4"],
  ["vogao","171-vogao.mp4"],["votrung","172-votrung.mp4"],["nohoatet","173-nohoatet.mp4"],
  ["laubia","174-laubia.mp4"],["muadong","175-muadong.mp4"],["denled","176-denled.mp4"],
  ["tachchiet","177-tachchiet.mp4"],["phunsuong","178-phunsuong.mp4"],["tuoisai","179-tuoisai.mp4"],
  ["maiton","180-maiton.mp4"],["aspirin","186-aspirin.mp4"],["chukyhoa","197-chukyhoa.mp4"],
  ["nhadamre","198-nhadamre.mp4"],["hechoilan","199-hechoilan.mp4"],
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
  console.log("Bundle done. Rendering", JOBS.length, "videos (resume 141->199).\n");

  let done = 0, fail = 0;
  for (const [slug, outName] of JOBS) {
    const out = path.resolve("out", outName);
    try {
      const comp = await selectComposition({ serveUrl, id: slug, inputProps: {} });
      let last = -1;
      await renderMedia({
        composition: comp, serveUrl, codec: "h264", outputLocation: out, concurrency: 1,
        timeoutInMilliseconds: 120000,
        onProgress: ({ progress }) => {
          const pct = Math.round(progress * 100);
          if (pct !== last && pct % 25 === 0) { console.log(`  [${slug}] ${pct}%`); last = pct; }
        },
      });
      done++;
      console.log(`OK (${done}/${JOBS.length}) ${outName}\n`);
    } catch (e) {
      fail++;
      console.log(`FAIL ${outName}: ${e.message}\n`);
    }
  }
  console.log(`=== RESUME DONE: ${done} ok, ${fail} fail ===`);
}

main().catch((e) => { console.error("RESUME FATAL:", e); process.exit(1); });
