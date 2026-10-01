import { Router } from "express";
import { getTopics, getClips } from "../services/clipDb";

const router = Router();

router.get("/topics", (_req, res) => {
  const topics = getTopics();
  res.json({ count: topics.length, topics });
});

router.get("/clips", (req, res) => {
  const filter = {
    cat: req.query.cat as string | undefined,
    scene: req.query.scene as string | undefined,
    loai_lan: req.query.loai_lan as string | undefined,
    cay_khoemanh: req.query.cay_khoemanh === "true" ? true : req.query.cay_khoemanh === "false" ? false : undefined,
    chu_trong_hinh: req.query.chu_trong_hinh === "true" ? true : req.query.chu_trong_hinh === "false" ? false : undefined,
    nguoi_nuocngoai: req.query.nguoi_nuocngoai === "true" ? true : req.query.nguoi_nuocngoai === "false" ? false : undefined,
  };
  const clips = getClips(filter);
  res.json({ count: clips.length, clips });
});

export default router;
