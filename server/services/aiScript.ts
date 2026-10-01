// Write a script for any topic the user types.
//
// AI backend removed (was Gemini via a Cloudflare Worker) — plug in a
// replacement provider below and point ask() at it.
//
// Note kept from testing: left alone the model writes ~55-char tip titles,
// which overflow the caption frame now that desc is gone. The prompt caps
// them at 35.

export interface Script {
  titleText: string;
  // Three hook variants. The TikTok Shop SOP (slide 8) says write three and shoot
  // all three, because which hook holds the first 3 seconds is not predictable.
  // hooks[0] becomes titleText; the user can switch before rendering.
  hooks: string[];
  subText: string;
  tips: Array<{ label: string; title: string }>;
  outroText: string;
}

// Content lines from the SOP (slide 6). Rotating them stops the algorithm from
// reading one formula, and each line wants a different script shape - so the
// line is part of the prompt, not a label bolted on afterwards.
export const LINES: Record<string, { name: string; brief: string }> = {
  problem: {
    name: "Vấn đề & Giải pháp",
    brief: "Mở bằng triệu chứng cây đang gặp, mỗi mục là một bước xử lý. label kiểu \"Bước 1\".",
  },
  hack: {
    name: "Mẹo hay",
    brief: "Mỗi mục là một mẹo làm được ngay, rẻ, dễ. label kiểu \"Mẹo 1\".",
  },
  mistake: {
    name: "Sai lầm thường gặp",
    brief: "Mỗi mục là một lỗi nhà vườn hay mắc, nói thẳng hậu quả. label kiểu \"Lỗi 1\".",
  },
  compare: {
    name: "Thử nghiệm & So sánh",
    brief: "Mỗi mục là một quan sát đối chiếu hai cách làm hoặc trước/sau. label kiểu \"Cây A\", \"Sau 7 ngày\".",
  },
  demo: {
    name: "Thao tác tận tay",
    brief: "Mỗi mục là một động tác đang làm trên cây, mô tả hành động cụ thể. label kiểu \"Tay 1\".",
  },
  pov: {
    name: "Góc nhìn người chơi",
    brief: "Kể như người chơi lan tự thuật trải nghiệm mình, dùng \"mình\". label kiểu \"Tuần 1\".",
  },
};

const TIP_MAX = 35;
const SUB_MAX = 40;
const HOOK_LINE_MAX = 18;

function prompt(topic: string, tipCount: number, line?: string): string {
  const l = line ? LINES[line] : undefined;
  const lineRule = l ? `\n- Tuyến nội dung: ${l.name}. ${l.brief}` : "";

  return `Viết kịch bản video TikTok dọc cho kênh hoa lan Việt Nam, chủ đề: "${topic}".

Trả về JSON thuần, không markdown, không giải thích:
{"hooks":["...","...","..."],"subText":"...","tips":[{"label":"...","title":"..."}],"outroText":"..."}

Quy tắc BẮT BUỘC:${lineRule}
- hooks: đúng 3 phương án hook khác nhau, mỗi hook 2 dòng IN HOA phân cách bằng \\n, mỗi dòng tối đa ${HOOK_LINE_MAX} ký tự. KHÔNG chào hỏi.
  · hooks[0] đánh thẳng NỖI ĐAU cụ thể (triệu chứng cây đang gặp).
  · hooks[1] gọi đúng ĐỐI TƯỢNG cụ thể (ai đang trồng kiểu gì, ở đâu).
  · hooks[2] hứa KẾT QUẢ cụ thể (có mốc thời gian hoặc con số).
  Ba hook phải khác nhau về góc tiếp cận, không phải ba cách nói lại một câu.
- subText: 1 dòng, tối đa ${SUB_MAX} ký tự.
- tips: đúng ${tipCount} mục. label ngắn ("Lỗi 1", "Bước 1", "Mẹo 1"...). title tối đa ${TIP_MAX} ký tự, một ý duy nhất, KHÔNG dùng dấu hai chấm để nhồi hai ý.
- outroText: mời người xem comment, tối đa 60 ký tự. KHÔNG nhắc tên kênh.
- Giọng nhà vườn Việt nói chuyện với người chơi lan, mộc mạc, không sáo rỗng.
- Lan Việt Nam (Dendrobium, Cattleya, Vanda...), không nói tới Hồ Điệp công nghiệp.`;
}

function check(v: unknown, tipCount: number): Script {
  const s = v as Script;
  const bad = (m: string) => new Error(m);

  // Accept a single titleText too: Gemini occasionally answers the old shape,
  // and one usable hook beats failing the whole request.
  if (!s) throw bad("AI không trả về gì");
  const raw = Array.isArray(s.hooks) ? s.hooks : typeof s.titleText === "string" ? [s.titleText] : [];
  const hooks = raw.filter((h) => typeof h === "string" && h.trim()).map((h) => h.toUpperCase().trim());
  if (!hooks.length) throw bad("thiếu tiêu đề");
  if (typeof s.outroText !== "string" || !s.outroText.trim()) throw bad("thiếu câu kết");
  if (!Array.isArray(s.tips) || s.tips.length !== tipCount) {
    throw bad(`cần ${tipCount} mục, nhận được ${Array.isArray(s.tips) ? s.tips.length : 0}`);
  }
  for (const t of s.tips) {
    if (!t || typeof t.title !== "string" || !t.title.trim()) throw bad("một mục thiếu nội dung");
    if (t.title.length > TIP_MAX + 10) throw bad(`chữ trong mục quá dài ("${t.title.slice(0, 25)}...")`);
  }

  return {
    // First hook is the one that renders unless the user switches.
    titleText: hooks[0],
    hooks,
    subText: (typeof s.subText === "string" ? s.subText : "").slice(0, SUB_MAX).trim(),
    tips: s.tips.map((t, i) => ({
      label: (t.label || `Ý ${i + 1}`).trim(),
      title: t.title.trim(),
    })),
    outroText: s.outroText.trim(),
  };
}

async function ask(topic: string, tipCount: number, line?: string): Promise<Script> {
  // No AI backend configured. prompt(topic, tipCount, line) still builds the
  // instruction text — wire it into a provider's chat endpoint here, then feed
  // the raw text response through check() to validate and shape the result.
  throw new Error("Chưa cấu hình AI viết kịch bản.");
}

// One retry: the failure mode is a malformed or wrong-length answer, and asking
// again usually fixes it. Two attempts keeps the wait under ~20s.
export async function writeScript(topic: string, tipCount: number, line?: string): Promise<Script> {
  try {
    return await ask(topic, tipCount, line);
  } catch (first: any) {
    try {
      return await ask(topic, tipCount, line);
    } catch (second: any) {
      throw new Error(`AI viết kịch bản không thành công (${second.message}). Thử gõ chủ đề rõ hơn.`);
    }
  }
}
