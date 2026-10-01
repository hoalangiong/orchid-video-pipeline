// In-memory render job queue using @remotion/bundler + @remotion/renderer
// Pattern from _render_sach.mjs

import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { totalFrames, type VideoConfig } from "../../src/NhaDamSeries";
import type { RenderFlags } from "./configLoader";
import { readScenes } from "./vbee";

export interface RenderJob {
  id: string;
  slug: string;
  status: "bundling" | "rendering" | "done" | "error";
  progress: number;
  outputPath?: string;
  sizeMb?: number;
  error?: string;
}

const jobs = new Map<string, RenderJob>();
let cachedServeUrl: string | null = null;

// Cũng dùng cho mục MC Vy (mcvyQueue.ts) để hai bên chung một bundle, khỏi build 2 lần.
export async function getServeUrl(): Promise<string> {
  if (cachedServeUrl) return cachedServeUrl;

  const bundleDir = path.resolve(__dirname, "../../.web-app-bundle");
  cachedServeUrl = await bundle({
    entryPoint: path.resolve(__dirname, "../../src/index.ts"),
    outDir: bundleDir,
    onProgress: (p: number) => {
      if (p % 25 === 0) console.log(`  [bundle] ${p}%`);
    },
  });
  return cachedServeUrl;
}

// A config edited in the browser gets a fresh slug, so clips_<newSlug>/ and
// images_<newSlug>/ don't exist yet. Copy the source template's footage across,
// leaving the original episode untouched. A junction would be cheaper but
// Remotion mirrors public/ into its bundle and recreating one needs admin
// rights on Windows (EPERM). Audio is NOT copied - that comes fresh from TTS.
function copyAssets(newSlug: string, sourceSlug: string) {
  if (!sourceSlug || sourceSlug === newSlug) return;
  const pub = path.resolve(__dirname, "../../public");

  for (const kind of ["clips", "images"]) {
    const src = path.join(pub, `${kind}_${sourceSlug}`);
    const dest = path.join(pub, `${kind}_${newSlug}`);
    if (!fs.existsSync(src) || fs.existsSync(dest)) continue;
    fs.cpSync(src, dest, { recursive: true });
    console.log(`  [assets] copied ${kind}_${sourceSlug} -> ${kind}_${newSlug}`);
  }
}

export async function startRender(
  slug: string,
  config: VideoConfig,
  sourceSlug?: string
): Promise<string> {
  const jobId = `rnd_${Date.now().toString(36)}`;
  const outputDir = path.resolve(__dirname, "../../out");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}.mp4`);

  const job: RenderJob = { id: jobId, slug, status: "bundling", progress: 0 };
  jobs.set(jobId, job);

  // Run async
  (async () => {
    try {
      // Footage for the new slug, taken from the template it was copied from
      copyAssets(slug, sourceSlug ?? "");

      // Scene lengths measured from the voiceover TTS just produced,
      // so captions and audio stay in sync with the new narration.
      const measured = readScenes(slug);
      // `flags` is the blob the browser carried through untouched (hideProduct,
      // useImages, jarOverlay...). Unpack it here; the composition reads those
      // fields at the top level.
      const { flags, ...editable } = config as VideoConfig & { flags?: RenderFlags };
      const finalConfig: VideoConfig = {
        ...editable,
        ...(flags ?? {}),
        scenes: { ...config.scenes, ...(measured ?? {}) },
      };

      // Bundle (cached after first run)
      const serveUrl = await getServeUrl();
      job.status = "rendering";
      job.progress = 10;

      // Select composition with dynamic inputProps
      const comp = await selectComposition({
        serveUrl,
        id: "OrchidDynamic",
        inputProps: finalConfig,
      });

      job.progress = 20;

      // Render
      await renderMedia({
        composition: {
          ...comp,
          // The registered composition has a placeholder length; the real
          // length is the sum of this config's scenes.
          durationInFrames: totalFrames(finalConfig),
        },
        serveUrl,
        codec: "h264",
        inputProps: finalConfig,
        outputLocation: outputPath,
        concurrency: 1,
        onProgress: ({ progress }) => {
          job.progress = Math.round(20 + progress * 75); // 20-95%
        },
      });

      // Get file size
      const stats = fs.statSync(outputPath);
      job.sizeMb = parseFloat((stats.size / 1024 / 1024).toFixed(1));
      job.outputPath = outputPath;
      job.status = "done";
      job.progress = 100;

      console.log(`✅ Render complete: ${outputPath} (${job.sizeMb}MB)`);
    } catch (e: any) {
      job.status = "error";
      job.error = e.message;
      console.error(`❌ Render failed:`, e.message);
    }
  })();

  return jobId;
}

export function getRenderJob(id: string): RenderJob | undefined {
  return jobs.get(id);
}
