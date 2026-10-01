// Build a ready-to-edit config from just a topic.
//
// The video needs footage for every scene, and the only footage that exists is
// grouped per episode in public/clips_<slug>/. So auto-generate does NOT invent
// a clip list from classify.csv - it borrows an existing episode's footage as
// the visual base (same as picking a template by hand) and pairs it with a
// fresh script written for the topic. That keeps the render path identical to
// template mode: sourceSlug carries the footage, the script carries the words.

import fs from "fs";
import path from "path";
import { getAllConfigs, type ConfigSummary } from "./configLoader";
import { getClips } from "./clipDb";
import type { FootageFolder } from "./footage";

// Vietnamese scripts per topic. Written by hand, not AI-generated, so the tone
// stays consistent with the channel: hook first (never a greeting), no channel
// name in the outro, CTA asks for a comment.
interface ScriptTemplate {
  titleText: string;
  // Only the AI path fills this: three hook variants for the user to choose
  // between (SOP slide 8). Hand-written templates below have one fixed hook.
  hooks?: string[];
  subText: string;
  tips: Array<{ label: string; title: string }>;
  outroText: string;
}

const TEMPLATES: Record<string, ScriptTemplate[]> = {
  chamsoc: [
    {
      titleText: "LAN CỨ CÒI\nMÃI KHÔNG LỚN",
      subText: "4 lỗi nhà vườn nào cũng mắc",
      tips: [
        { label: "Lỗi 1", title: "Tưới quá nhiều nước" },
        { label: "Lỗi 2", title: "Giá thể đã mục mà không thay" },
        { label: "Lỗi 3", title: "Bón phân sai thời điểm" },
        { label: "Lỗi 4", title: "Treo chỗ thiếu nắng" },
      ],
      outroText: "Nhà bạn đang mắc lỗi số mấy? Comment cho mình biết nha!",
    },
    {
      titleText: "RỄ LAN ĐEN THỐI\nCỨU ĐƯỢC KHÔNG?",
      subText: "Làm đúng 4 bước là cây hồi",
      tips: [
        { label: "Bước 1", title: "Tháo cây ra khỏi chậu, rửa sạch rễ" },
        { label: "Bước 2", title: "Cắt hết rễ đen, chỉ giữ rễ trắng mập" },
        { label: "Bước 3", title: "Bôi vôi hoặc keo liền vết cắt" },
        { label: "Bước 4", title: "Ghép lại giá thể mới, để khô 2 ngày" },
      ],
      outroText: "Cây nhà bạn cứu được mấy phần? Comment kể mình nghe!",
    },
  ],
  mathoa: [
    {
      titleText: "LAN KHÔNG RA HOA\nDÙ CÂY RẤT KHỎE",
      subText: "4 nguyên nhân ít ai để ý",
      tips: [
        { label: "Lý do 1", title: "Cây chưa đủ tuổi, thân còn non" },
        { label: "Lý do 2", title: "Thiếu chênh lệch nhiệt độ ngày đêm" },
        { label: "Lý do 3", title: "Bón đạm nhiều quá, cây chỉ lo ra lá" },
        { label: "Lý do 4", title: "Nắng yếu, treo sâu trong giàn" },
      ],
      outroText: "Bạn nghĩ cây mình vướng lý do nào? Comment nha!",
    },
    {
      titleText: "MẸO KÍCH LAN\nRA HOA ĐỒNG LOẠT",
      subText: "4 việc làm trước mùa hoa",
      tips: [
        { label: "Mẹo 1", title: "Siết nước 10 ngày cho cây chững lại" },
        { label: "Mẹo 2", title: "Chuyển sang phân lân kali cao" },
        { label: "Mẹo 3", title: "Tăng nắng, giảm che lưới" },
        { label: "Mẹo 4", title: "Giữ gốc thoáng, đừng để úng" },
      ],
      outroText: "Bạn đã thử mẹo nào chưa? Comment cho mình biết!",
    },
  ],
  vuongian: [
    {
      titleText: "GIÀN LAN SÂN THƯỢNG\nNẮNG CHÁY LÁ",
      subText: "4 cách hạ nhiệt cực rẻ",
      tips: [
        { label: "Cách 1", title: "Căng 2 lớp lưới lệch nhau" },
        { label: "Cách 2", title: "Kê chậu cao khỏi mặt sàn bê tông" },
        { label: "Cách 3", title: "Tưới nền sàn buổi trưa cho mát" },
        { label: "Cách 4", title: "Treo dày để cây che nắng cho nhau" },
      ],
      outroText: "Sân thượng nhà bạn nóng cỡ nào? Comment nha!",
    },
  ],
  thamkhao: [
    {
      titleText: "NGƯỜI MỚI CHƠI LAN\nNÊN BẮT ĐẦU TỪ ĐÂU",
      subText: "4 điều nên biết trước khi mua cây",
      tips: [
        { label: "Điều 1", title: "Chọn dòng dễ sống trước, đừng ham cây hiếm" },
        { label: "Điều 2", title: "Xem chỗ treo có đủ nắng sáng không" },
        { label: "Điều 3", title: "Học tưới trước khi học bón phân" },
        { label: "Điều 4", title: "Mua cây đã thuần, đừng mua hàng rừng mới về" },
      ],
      outroText: "Bạn mới chơi lan bao lâu rồi? Comment cho mình biết nha!",
    },
  ],
};

// Colours per topic so auto-generated videos don't all look alike.
const PALETTES: Record<string, Record<string, string>> = {
  chamsoc: { accent: "#4caf50", accent2: "#8bc34a" },
  mathoa: { accent: "#e91e63", accent2: "#ff9800" },
  vuongian: { accent: "#00bcd4", accent2: "#4caf50" },
  thamkhao: { accent: "#9c27b0", accent2: "#673ab7" },
};

export interface AutoResult {
  config: ConfigSummary;
  sourceSlug: string;
  clipCount: number;
  note: string;
  hooks?: string[];
}

const PUBLIC_DIR = path.resolve(__dirname, "../../public");

// Footage must be on disk, or renderQueue has nothing to copy and the render
// dies halfway. 398 clips_ folders exist for 156 configs, but not every config
// is covered, so check rather than assume.
function hasFootage(slug: string): boolean {
  return (
    fs.existsSync(path.join(PUBLIC_DIR, `clips_${slug}`)) ||
    fs.existsSync(path.join(PUBLIC_DIR, `images_${slug}`))
  );
}

// Episodes whose footage we can borrow: enough scenes for the script, and the
// footage folder present.
function pickSource(configs: ConfigSummary[], cat: string, tipCount: number): ConfigSummary | undefined {
  const usable = configs.filter((c) => c.tips.length >= tipCount && hasFootage(c.slug));
  const sameCat = usable.filter((c) => c.slug.includes(cat));
  const pool = sameCat.length ? sameCat : usable;
  if (!pool.length) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Pair a script with an existing episode's footage. Both the template path and
// the AI path go through here, so the render is identical either way.
// cat is undefined for a free-typed topic: keep the source episode's colours and
// don't claim a clip count for a category that doesn't exist.
// footage overrides only WHERE the clips come from: a folder the user dropped
// into public/ by hand has no colours or scene lengths of its own, so those still
// come from a registered episode.
export function assemble(
  script: ScriptTemplate,
  cat: string | undefined,
  how: string,
  footage?: FootageFolder
): AutoResult {
  const source = pickSource(getAllConfigs(), cat ?? "", script.tips.length);
  if (!source) {
    throw new Error(`Không tìm được tập nào có đủ ${script.tips.length} cảnh để lấy hình.`);
  }

  const palette = cat ? PALETTES[cat] ?? {} : {};
  const slug = `auto-${cat ?? "ai"}-${Date.now().toString(36)}`;

  // Scene lengths are placeholders - TTS measures the real voiceover and
  // renderQueue overwrites them from _scenes.json before rendering.
  const config: ConfigSummary = {
    slug,
    titleText: script.titleText,
    subText: script.subText,
    tips: script.tips.map((t) => ({ label: t.label, title: t.title, desc: "" })),
    outroText: script.outroText,
    colors: { ...source.colors, ...palette },
    scenes: { ...source.scenes },
    // Auto videos are pure knowledge - no product to sell. We borrow the source
    // episode's footage, so we must NOT borrow its product card: many sources
    // are nha đam episodes, and leaving `product` empty is not enough because
    // NhaDamSeries falls back to DEFAULT_PRODUCT. hideProduct is the real switch.
    // useImages is kept because it describes the footage we borrowed (jpg vs mp4).
    flags: { hideProduct: true, useImages: footage ? footage.useImages : source.flags.useImages },
    totalFrames: source.totalFrames,
  };

  // How much raw footage the category has - shown in the UI so the user knows
  // whether this topic is well stocked or thin.
  const clipCount = cat ? getClips({ cat, chu_trong_hinh: false }).length : 0;

  return {
    config,
    sourceSlug: footage ? footage.slug : source.slug,
    clipCount,
    note: footage
      ? `Lấy hình từ thư mục "${footage.useImages ? "images" : "clips"}_${footage.slug}" (${footage.tipCount} cảnh tip), ${how}.`
      : `Lấy hình từ tập "${source.slug}", ${how}.`,
    hooks: script.hooks,
  };
}

export function autoGenerate(cat: string): AutoResult {
  const templates = TEMPLATES[cat];
  if (!templates) {
    const known = Object.keys(TEMPLATES).join(", ");
    throw new Error(`Chưa có kịch bản mẫu cho chủ đề "${cat}". Hiện có: ${known}`);
  }
  const tpl = templates[Math.floor(Math.random() * templates.length)];
  return assemble(tpl, cat, `lời đọc viết mới cho chủ đề ${cat}`);
}

export function listAutoTopics(): string[] {
  return Object.keys(TEMPLATES);
}
