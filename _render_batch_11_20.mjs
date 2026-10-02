// Bundle MOT LAN roi render nhieu composition, tranh copy public/ (17GB) nhieu lan.
// Bundle + temp dat tren D: vi C: chi con ~16GB trong khi public/ da 17GB+.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const RTMP = "D:\\_remotion_rendertmp";
fs.mkdirSync(RTMP, { recursive: true });
process.env.TMPDIR = RTMP;
process.env.TEMP = RTMP;
process.env.TMP = RTMP;

const BUNDLE = "D:\\_remotion_fixedbundle";
const OUT = path.resolve("out");

const JOBS = [
  ["OrchidLanHiem11", "11-lan-hiem.mp4"],
  ["OrchidLanQuyToc13", "13-lan-quy-toc.mp4"],
  ["OrchidLanTienTrieu14", "14-lan-tien-trieu.mp4"],
  ["OrchidDotBien15", "15-dot-bien.mp4"],
  ["OrchidHoiSinh16", "16-hoi-sinh.mp4"],
  ["OrchidKhongNoHoa17", "17-khong-no-hoa.mp4"],
  ["OrchidDauHieuCuu18", "18-dau-hieu-cuu.mp4"],
  ["OrchidNamTrang19", "19-nam-trang.mp4"],
  ["OrchidNhinRe20", "20-nhin-re.mp4"],
];

async function main() {
  console.log("Bundling (copy public/ ONE time)...");
  const serveUrl = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    outDir: BUNDLE,
    onProgress: (p) => {
      if (p % 20 === 0) console.log("  bundle " + p + "%");
    },
  });
  console.log("Bundle xong: " + serveUrl + "\n");

  let ok = 0;
  let loi = 0;
  for (const [id, filename] of JOBS) {
    const ra = path.join(OUT, filename);
    if (fs.existsSync(ra) && fs.statSync(ra).size > 1000000) {
      console.log("BO QUA (da co) " + filename);
      ok++;
      continue;
    }
    try {
      const comp = await selectComposition({ serveUrl, id, inputProps: {} });
      let last = -1;
      await renderMedia({
        composition: comp,
        serveUrl,
        codec: "h264",
        outputLocation: ra,
        concurrency: 1,
        onProgress: ({ progress }) => {
          const p = Math.round(progress * 100);
          if (p !== last && p % 25 === 0) {
            console.log("  [" + id + "] " + p + "%");
            last = p;
          }
        },
      });
      ok++;
      console.log("OK (" + ok + "/" + JOBS.length + ") " + filename);
    } catch (e) {
      loi++;
      console.log("LOI " + filename + ": " + e.message);
    }
  }
  console.log("=== XONG: " + ok + " ok, " + loi + " loi ===");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
