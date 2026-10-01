// Mục "1 video + MC Vy": người dùng chỉ ra MỘT file video trên máy, AI viết lời
// thoại, MC Vy nền xanh phủ lên. Tách riêng khỏi luồng lan và khỏi luồng 6 clip.
//
// Clip nền được sao vào public/single_<slug>/bg.mp4 rồi lặp lại cho đủ độ dài
// video, nên clip ngắn 10-20 giây vẫn dùng được.

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const PUBLIC = path.resolve(__dirname, "../../public");
const FFPROBE = String.raw`C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffprobe.exe`;

const VIDEO_EXT = [".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"];

/** Sao clip của người dùng vào public/single_<slug>/bg.mp4, trả về số frame (30fps). */
export function importVideo(slug: string, videoPath: string): { frames: number; seconds: number } {
  const src = videoPath.trim().replace(/^"|"$/g, "");

  if (!src) throw new Error("Chưa nhập đường dẫn video.");
  if (!fs.existsSync(src)) throw new Error(`Không thấy file: ${src}`);
  if (!fs.statSync(src).isFile()) throw new Error("Đường dẫn đó là thư mục, cần một file video.");
  if (!VIDEO_EXT.includes(path.extname(src).toLowerCase())) {
    throw new Error(`Đuôi file lạ (${path.extname(src)}). Cần mp4/mov/mkv/webm.`);
  }

  const dir = path.join(PUBLIC, `single_${slug}`);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, "bg.mp4");
  fs.copyFileSync(src, dest);

  let seconds = 0;
  try {
    const out = execSync(
      `"${FFPROBE}" -v quiet -show_entries format=duration -of csv=p=0 "${dest}"`,
      { encoding: "utf8" }
    ).trim();
    seconds = parseFloat(out) || 0;
  } catch {
    seconds = 0;
  }

  // Đo không ra thì cứ coi như 10 giây; Loop chỉ cần một số dương hợp lý.
  if (!seconds) seconds = 10;
  return { frames: Math.max(30, Math.round(seconds * 30)), seconds: parseFloat(seconds.toFixed(2)) };
}

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/** Sao ảnh phủ vào public/single_<slug>/overlay.<ext>, trả về tên file cho config. */
export function importOverlay(slug: string, imagePath: string): { file: string } {
  const src = imagePath.trim().replace(/^"|"$/g, "");

  if (!src) throw new Error("Chưa nhập đường dẫn ảnh.");
  if (!fs.existsSync(src)) throw new Error(`Không thấy file: ${src}`);
  if (!fs.statSync(src).isFile()) throw new Error("Đường dẫn đó là thư mục, cần một file ảnh.");

  const ext = path.extname(src).toLowerCase();
  if (!IMAGE_EXT.includes(ext)) {
    throw new Error(`Đuôi file lạ (${ext}). Cần jpg/png/webp.`);
  }

  const dir = path.join(PUBLIC, `single_${slug}`);
  fs.mkdirSync(dir, { recursive: true });
  const file = `overlay${ext}`;
  fs.copyFileSync(src, path.join(dir, file));
  return { file };
}

/** Clip nền đã nhập cho slug này (nếu có). */
export function getSingleVideo(slug: string): { frames: number; seconds: number } | null {
  const p = path.join(PUBLIC, `single_${slug}`, "bg.mp4");
  if (!fs.existsSync(p)) return null;
  try {
    const out = execSync(
      `"${FFPROBE}" -v quiet -show_entries format=duration -of csv=p=0 "${p}"`,
      { encoding: "utf8" }
    ).trim();
    const seconds = parseFloat(out) || 10;
    return { frames: Math.max(30, Math.round(seconds * 30)), seconds: parseFloat(seconds.toFixed(2)) };
  } catch {
    return { frames: 300, seconds: 10 };
  }
}

// --- AI viết lời thoại cho MC Vy ---
//
// AI backend removed (was Gemini via a Cloudflare Worker) — plug in a
// replacement provider below and point ask() at it.

export interface McScene {
  /** Câu MC Vy đọc. */
  text: string;
  /** Chữ hiện trên khung, ngắn hơn câu đọc. */
  caption: string;
}

const CAPTION_MAX = 34;

function prompt(topic: string, count: number, note?: string): string {
  const extra = note?.trim() ? `\n- Yêu cầu riêng của chủ kênh: ${note.trim()}` : "";

  return `Viết lời dẫn cho video TikTok dọc, có MC nữ tên Vy đứng nói trên khung. Chủ đề: "${topic}".

Trả về JSON thuần, không markdown, không giải thích:
{"scenes":[{"text":"...","caption":"..."}]}

Quy tắc BẮT BUỘC:${extra}
- Đúng ${count} cảnh, theo thứ tự: cảnh 1 là HOOK, các cảnh giữa là nội dung, cảnh cuối là CTA.
- text: câu MC Vy nói ra miệng, 1-2 câu, tối đa 28 từ, viết như người nói chuyện chứ không như đọc văn bản.
- Cảnh 1 (hook) vào thẳng vấn đề hoặc điều bất ngờ. KHÔNG chào hỏi, KHÔNG "xin chào cả nhà".
- caption: chữ hiện trên khung, IN HOA, tối đa ${CAPTION_MAX} ký tự, là ý cốt của câu đó chứ không phải chép lại cả câu.
- Cảnh cuối mời người xem comment hoặc để lại tương tác. KHÔNG nhắc tên kênh.
- Giọng người Việt nói chuyện mộc mạc, không sáo rỗng, không dùng từ marketing rỗng.`;
}

function check(v: unknown, count: number): McScene[] {
  const s = v as { scenes?: Array<{ text?: string; caption?: string }> };
  if (!s || !Array.isArray(s.scenes)) throw new Error("AI không trả về danh sách cảnh");
  if (s.scenes.length !== count) {
    throw new Error(`cần ${count} cảnh, nhận được ${s.scenes.length}`);
  }
  return s.scenes.map((sc, i) => {
    const text = (sc?.text ?? "").trim();
    if (!text) throw new Error(`cảnh ${i + 1} thiếu lời thoại`);
    return {
      text,
      caption: (sc?.caption ?? "").toUpperCase().trim().slice(0, CAPTION_MAX + 8),
    };
  });
}

async function ask(topic: string, count: number, note?: string): Promise<McScene[]> {
  const res = await fetch(WORKER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt(topic, count, note) }],
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (res.status === 503) throw new Error("AI đang quá tải hoặc hết hạn mức, thử lại sau ít phút.");
  if (!res.ok) throw new Error(`AI trả về lỗi ${res.status}.`);

  const data = (await res.json()) as { content?: Array<{ text?: string }> };
  const text = data.content?.[0]?.text ?? "";
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("AI không trả về kịch bản đọc được.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(m[0]);
  } catch {
    throw new Error("Kịch bản AI trả về bị lỗi định dạng.");
  }
  return check(parsed, count);
}

/** Một lần thử lại: lỗi hay gặp là sai số cảnh, hỏi lại thường là xong. */
export async function writeMcScript(topic: string, count: number, note?: string): Promise<McScene[]> {
  try {
    return await ask(topic, count, note);
  } catch {
    try {
      return await ask(topic, count, note);
    } catch (second: any) {
      throw new Error(`AI viết kịch bản không thành công (${second.message}). Thử gõ chủ đề rõ hơn.`);
    }
  }
}
