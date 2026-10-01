import express from "express";
import path from "path";

const app = express();
const PORT = parseInt(process.env.PORT || "3200", 10);

app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, "../web")));

// API routes
import configsRouter from "./routes/configs";
import topicsRouter from "./routes/topics";
import ttsRouter from "./routes/tts";
import renderRouter from "./routes/render";
import autoRouter from "./routes/auto";
import mcvyRouter from "./routes/mcvy";

app.use("/api", configsRouter);
app.use("/api", topicsRouter);
app.use("/api", ttsRouter);
app.use("/api", renderRouter);
app.use("/api", autoRouter);
app.use("/api", mcvyRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`🌸 Orchid Video Server running at http://localhost:${PORT}`);
  console.log(`   Frontend: http://localhost:${PORT}/`);
  console.log(`   API:      http://localhost:${PORT}/api/health`);
});
