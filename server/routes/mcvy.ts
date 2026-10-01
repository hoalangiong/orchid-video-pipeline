// Route cho mục MC Vy. Đường dẫn đều nằm dưới /api/mcvy/ để không lẫn với mục lan.

import { Router } from "express";
import fs from "fs";
import { startMcVyRender, getMcVyJob } from "../services/mcvyQueue";
import { importVideo, importOverlay, getSingleVideo, writeMcScript } from "../services/mcvySingle";
import type { McVyConfig } from "../../src/McVyVideo";

const router = Router();

// --- Mục "1 video + MC Vy" ---

// Nhận đường dẫn 1 file video trên máy, sao vào public/single_<slug>/bg.mp4
router.post("/mcvy/import", (req, res) => {
  const { slug, videoPath } = req.body as { slug?: string; videoPath?: string };
  if (!slug?.trim()) return res.status(400).json({ error: "Thiếu tên video (slug)" });
  if (!videoPath?.trim()) return res.status(400).json({ error: "Thiếu đường dẫn file video" });

  try {
    const info = importVideo(slug.trim(), videoPath);
    res.json({ ok: true, ...info });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/mcvy/import/:slug", (req, res) => {
  const info = getSingleVideo(req.params.slug);
  if (!info) return res.status(404).json({ error: "Chưa nhập clip nền cho video này" });
  res.json({ ok: true, ...info });
});

// Nhận đường dẫn 1 ảnh, sao vào public/single_<slug>/overlay.<ext> để phủ lên clip nền
router.post("/mcvy/overlay", (req, res) => {
  const { slug, imagePath } = req.body as { slug?: string; imagePath?: string };
  if (!slug?.trim()) return res.status(400).json({ error: "Thiếu tên video (slug)" });
  if (!imagePath?.trim()) return res.status(400).json({ error: "Thiếu đường dẫn file ảnh" });

  try {
    const info = importOverlay(slug.trim(), imagePath);
    res.json({ ok: true, ...info });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// AI viết lời thoại cho MC Vy đọc
router.post("/mcvy/script", async (req, res) => {
  const { topic, count, note } = req.body as { topic?: string; count?: number; note?: string };
  if (!topic?.trim()) return res.status(400).json({ error: "Gõ chủ đề trước đã" });

  const n = Math.min(6, Math.max(3, Number(count) || 4));
  try {
    const scenes = await writeMcScript(topic.trim(), n, note);
    res.json({ scenes });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/mcvy/render", async (req, res) => {
  const { slug, config, sourceSlug } = req.body as {
    slug: string;
    config: McVyConfig;
    sourceSlug?: string;
  };

  if (!slug || !config) {
    return res.status(400).json({ error: "Thiếu slug hoặc cấu hình" });
  }

  try {
    const jobId = await startMcVyRender(slug, config, sourceSlug);
    res.json({ jobId, status: "bundling" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/mcvy/render/:id", (req, res) => {
  const job = getMcVyJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Không tìm thấy phiên dựng" });
  res.json(job);
});

router.get("/mcvy/output/:id", (req, res) => {
  const job = getMcVyJob(req.params.id);
  if (!job?.outputPath || !fs.existsSync(job.outputPath)) {
    return res.status(404).json({ error: "Chưa có file xuất" });
  }

  const stat = fs.statSync(job.outputPath);
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(job.outputPath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": stat.size, "Content-Type": "video/mp4" });
    fs.createReadStream(job.outputPath).pipe(res);
  }
});

export default router;
