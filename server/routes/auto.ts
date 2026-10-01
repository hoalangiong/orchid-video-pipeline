import { Router } from "express";
import { autoGenerate, assemble, listAutoTopics } from "../services/autoScript";
import { writeScript, LINES } from "../services/aiScript";
import { listUserFootage, getUserFootage } from "../services/footage";

const router = Router();

router.get("/auto/topics", (_req, res) => {
  res.json({ topics: listAutoTopics() });
});

// Clip folders the user copied into public/ by hand, newest first.
router.get("/footage", (_req, res) => {
  res.json({ footage: listUserFootage() });
});

// The content lines live in aiScript so the prompt and the UI can never disagree.
router.get("/auto/lines", (_req, res) => {
  res.json({ lines: LINES });
});

// cat = one of the four fixed buttons (hand-written script, instant, never fails).
// topic = anything the user typed (AI writes it, ~10s, can fail).
router.post("/auto", async (req, res) => {
  const { cat, topic, line, footage: footageSlug } = req.body as {
    cat?: string;
    topic?: string;
    line?: string;
    footage?: string;
  };

  // A folder the user copied in himself. The composition only has slots for 4
  // tips, so a folder with more is used up to 4 and the rest ignored.
  let footage;
  if (footageSlug) {
    footage = getUserFootage(footageSlug);
    if (!footage) {
      return res.status(400).json({ error: `Không thấy thư mục hình "${footageSlug}" nữa. Tải lại trang.` });
    }
  }
  const tipCount = footage ? Math.min(footage.tipCount, 4) : 4;

  if (topic && topic.trim()) {
    try {
      const script = await writeScript(topic.trim(), tipCount, line);
      const how = line
        ? `tuyến "${LINES[line]?.name ?? line}", lời đọc do AI viết cho chủ đề "${topic.trim()}"`
        : `lời đọc do AI viết cho chủ đề "${topic.trim()}"`;
      res.json(assemble(script, undefined, how, footage));
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }

  if (!cat) return res.status(400).json({ error: "Thiếu chủ đề" });
  try {
    res.json(autoGenerate(cat));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
