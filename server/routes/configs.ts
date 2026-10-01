import { Router } from "express";
import { getAllConfigs, getConfigBySlug } from "../services/configLoader";

const router = Router();

router.get("/configs", (_req, res) => {
  const configs = getAllConfigs();
  res.json({ count: configs.length, configs });
});

router.get("/config/:slug", (req, res) => {
  const cfg = getConfigBySlug(req.params.slug);
  if (!cfg) return res.status(404).json({ error: "Config not found" });
  res.json(cfg);
});

export default router;
