// Hàng đợi render cho mục MC Vy. Tách khỏi renderQueue.ts (luồng video lan) theo
// chỉ đạo "cái mục này tạo riêng" - sửa bên này không làm hỏng bên kia.

import path from "path";
import fs from "fs";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { mcVyTotalFrames, MCVY_KEYS, type McVyConfig } from "../../src/McVyVideo";
import { getServeUrl } from "./renderQueue";
import { readScenes } from "./vbee";

export interface McVyJob {
  id: string;
  slug: string;
  status: "bundling" | "rendering" | "done" | "error";
  progress: number;
  outputPath?: string;
  sizeMb?: number;
  error?: string;
}

const jobs = new Map<string, McVyJob>();

const PUBLIC = path.resolve(__dirname, "../../public");
const BUNDLE_PUBLIC = path.resolve(__dirname, "../../.web-app-bundle/public");

/** Bundle được nhớ trong bộ nhớ nên public/ chỉ được sao vào bundle ở lần render ĐẦU
 *  của mỗi phiên server. Thư mục nào tạo sau đó thì Remotion báo 404. Đồng bộ tay
 *  đúng mấy thư mục mục này cần, trước khi render. */
function mirrorAssets(slug: string) {
  if (!fs.existsSync(BUNDLE_PUBLIC)) return; // chưa bundle lần nào, bundle sẽ tự sao
  for (const dir of ["mc_vy", `clips_${slug}`, `audio_${slug}`, `single_${slug}`]) {
    const src = path.join(PUBLIC, dir);
    if (!fs.existsSync(src)) continue;
    fs.cpSync(src, path.join(BUNDLE_PUBLIC, dir), { recursive: true, force: true });
  }
}

/** Clip nền lấy từ bộ clip của template gốc, giữ nguyên tập gốc không đụng tới. */
function copyClips(newSlug: string, sourceSlug?: string) {
  if (!sourceSlug || sourceSlug === newSlug) return;
  const src = path.join(PUBLIC, `clips_${sourceSlug}`);
  const dest = path.join(PUBLIC, `clips_${newSlug}`);
  if (!fs.existsSync(src) || fs.existsSync(dest)) return;
  fs.cpSync(src, dest, { recursive: true });
}

export async function startMcVyRender(
  slug: string,
  config: McVyConfig,
  sourceSlug?: string
): Promise<string> {
  const jobId = `mcvy_${Date.now().toString(36)}`;
  const outputDir = path.resolve(__dirname, "../../out");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}.mp4`);

  const job: McVyJob = { id: jobId, slug, status: "bundling", progress: 0 };
  jobs.set(jobId, job);

  (async () => {
    try {
      copyClips(slug, sourceSlug);

      // Độ dài cảnh đo từ giọng đọc vừa tạo, để chữ và tiếng khớp nhau.
      const measured = readScenes(slug);
      const finalConfig: McVyConfig = {
        ...config,
        slug,
        scenes: { ...config.scenes, ...(measured ?? {}) },
      };

      const missing = MCVY_KEYS.filter((k) => !(finalConfig.scenes[k] ?? 0));
      if (missing.length === MCVY_KEYS.length) {
        throw new Error("Chưa có độ dài cảnh nào - hãy tạo giọng đọc trước khi dựng.");
      }

      const serveUrl = await getServeUrl();
      mirrorAssets(slug);

      job.status = "rendering";
      job.progress = 10;

      const comp = await selectComposition({
        serveUrl,
        id: "McVyDynamic",
        inputProps: finalConfig,
      });

      job.progress = 20;

      await renderMedia({
        composition: { ...comp, durationInFrames: mcVyTotalFrames(finalConfig) },
        serveUrl,
        codec: "h264",
        inputProps: finalConfig,
        outputLocation: outputPath,
        concurrency: 1,
        onProgress: ({ progress }) => {
          job.progress = Math.round(20 + progress * 75);
        },
      });

      const stats = fs.statSync(outputPath);
      job.sizeMb = parseFloat((stats.size / 1024 / 1024).toFixed(1));
      job.outputPath = outputPath;
      job.status = "done";
      job.progress = 100;
      console.log(`✅ MC Vy render xong: ${outputPath} (${job.sizeMb}MB)`);
    } catch (e: any) {
      job.status = "error";
      job.error = e.message;
      console.error(`❌ MC Vy render lỗi:`, e.message);
    }
  })();

  return jobId;
}

export function getMcVyJob(id: string): McVyJob | undefined {
  return jobs.get(id);
}
