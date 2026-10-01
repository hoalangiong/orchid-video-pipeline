import { Router } from "express";
import { generateTTS, getTTSJob, type TTSLine } from "../services/vbee";

const router = Router();

router.post("/tts", async (req, res) => {
  const { slug, lines } = req.body as { slug: string; lines: TTSLine[] };

  if (!slug || !lines?.length) {
    return res.status(400).json({ error: "Missing slug or lines" });
  }

  try {
    const jobId = await generateTTS(slug, lines);
    res.json({ jobId, status: "processing" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/tts/:id", (req, res) => {
  const job = getTTSJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

export default router;
