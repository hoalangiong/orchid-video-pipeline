// Render lai tap tu kho clip DA XOA LOGO -> ghi ra out_sach/ (KHONG de len out/).
//
// Vi sao ghi ra thu muc moi: map slug -> ten file out/ khong co san o dau ca,
// phai suy ra tu SO FRAME (out/ dat ten kieu cu "07-trong-gia-hac...", khong
// theo slug). Neu map sai 1 tap ma de len out/ thi mat ban tot. Ghi rieng roi
// doi chieu, thay tay sau.
//
// Danh sach job doc tu _wm_check/jobs.json (242 tap map chac chan).
// 29 tap con lai KHONG render: ten file out/ trung so frame voi 2 composition
// nen khong biet chac cai nao -> de nguyen, lam tay.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const JOBS = JSON.parse(fs.readFileSync(path.resolve("_wm_check/jobs.json"), "utf8"));

const RTMP = path.resolve("_rendertmp");
fs.mkdirSync(RTMP, { recursive: true });
process.env.TMPDIR = RTMP;
process.env.TEMP = RTMP;
process.env.TMP = RTMP;

const RA = path.resolve("out_sach");
fs.mkdirSync(RA, { recursive: true });
const BUNDLE = path.resolve("_fixedbundle");

async function main() {
  console.log("Bundle ...");
  const serveUrl = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    outDir: BUNDLE,
    onProgress: (p) => {
      if (p % 25 === 0) console.log("  bundle " + p + "%");
    },
  });
  console.log("Bundle xong. Render " + JOBS.length + " video.\n");

  let ok = 0;
  let bo = 0;
  let loi = 0;
  for (const [slug, ten] of JOBS) {
    const ra = path.join(RA, ten);
    // chay lai duoc: file nao xong roi thi bo qua
    if (fs.existsSync(ra) && fs.statSync(ra).size > 1000000) {
      bo++;
      continue;
    }
    try {
      const comp = await selectComposition({ serveUrl, id: slug, inputProps: {} });
      let last = -1;
      await renderMedia({
        composition: comp,
        serveUrl,
        codec: "h264",
        outputLocation: ra,
        concurrency: 1,
        onProgress: ({ progress }) => {
          const p = Math.round(progress * 100);
          if (p !== last && p % 50 === 0) {
            console.log("  [" + slug + "] " + p + "%");
            last = p;
          }
        },
      });
      ok++;
      console.log("OK (" + ok + "/" + JOBS.length + ") " + ten);
    } catch (e) {
      loi++;
      console.log("LOI " + ten + ": " + e.message);
    }
  }
  console.log("=== XONG: " + ok + " ok, " + bo + " bo qua, " + loi + " loi ===");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
