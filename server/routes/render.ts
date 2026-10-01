import { Router } from "express";
import fs from "fs";
import { startRender, getRenderJob } from "../services/renderQueue";
import type { VideoConfig } from "../../src/NhaDamSeries";

const router = Router();

router.post("/render", async (req, res) => {
  const { slug, config, sourceSlug } = req.body as {
    slug: string;
    config: VideoConfig;
    sourceSlug?: string;
  };

  if (!slug || !config) {
    return res.status(400).json({ error: "Thiếu slug hoặc config" });
  }

  try {
    const jobId = await startRender(slug, config, sourceSlug);
    res.json({ jobId, status: "bundling" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/render/:id", (req, res) => {
  const job = getRenderJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.get("/output/:id", (req, res) => {
  const job = getRenderJob(req.params.id);
  if (!job || !job.outputPath) {
    return res.status(404).json({ error: "Output not found" });
  }

  if (!fs.existsSync(job.outputPath)) {
    return res.status(404).json({ error: "File missing" });
  }

  // Stream with Range header support for video seeking
  const stat = fs.statSync(job.outputPath);
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(job.outputPath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": stat.size,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(job.outputPath).pipe(res);
  }
});

export default router;
