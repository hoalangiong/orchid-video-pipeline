import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const FPS = 30;

type Line = { speaker: "TU" | "BO"; start: number; end: number; text: string };

const LINES: Line[] = [
  { speaker: "TU", start: 0.0, end: 6.67, text: "Bo ơi! Cây lan mày trồng cả năm mà rễ lèo tèo mấy sợi, tại mày hổng biết kích rễ chớ đâu con ơi!" },
  { speaker: "BO", start: 7.02, end: 15.28, text: "Ủa chú Tư! Rễ ít thì kệ nó, miễn cây sống là được, mắc gì phải kích cho cực hả chú, để tự nhiên hổng tốt hơn hả!" },
  { speaker: "TU", start: 15.63, end: 23.98, text: "Bậy nào! Rễ là cái gốc của cây, rễ mạnh thì hút nước hút phân khỏe, cây mới bung đọt ra hoa. Rễ yếu là cây còi con!" },
  { speaker: "BO", start: 24.33, end: 31.51, text: "Á… vậy chớ kích rễ làm sao hả chú? Con tưởng cứ tưới nước với bón phân đạm cho nhiều là rễ tự ra chớ bộ!" },
  { speaker: "TU", start: 31.86, end: 40.43, text: "Trời đất! Muốn ra rễ thì dùng thuốc kích rễ pha loãng, phun với tưới gốc. Giữ giá thể ẩm thoáng, để chỗ mát cho rễ đâm ra!" },
  { speaker: "BO", start: 40.78, end: 48.59, text: "Hèn chi… con toàn quất đạm nặng, cây phở lá mà gốc trơ trụi hổng có rễ, thảo nào lung lay muốn rớt khỏi chậu hà chú!" },
  { speaker: "TU", start: 48.94, end: 56.93, text: "Đúng rồi đó! Đạm nhiều mà rễ yếu là cây ảo. Kích rễ xong thấy đầu rễ xanh trắng nhú ra là ngon, rồi mới tăng phân con!" },
  { speaker: "BO", start: 57.28, end: 65.77, text: "Dạ dạ con hiểu rồi! Pha kích rễ loãng phun gốc, giữ ẩm thoáng để chỗ mát, chờ rễ nhú rồi mới bón mạnh chớ hổng ép đạm nữa đâu chú!" },
  { speaker: "TU", start: 66.12, end: 74.5, text: "Ngoan! Nhớ nè: nuôi lan là nuôi bộ rễ trước. Rễ mập trắng đầy chậu thì hoa lá tự khắc theo sau, ép ngọn là hư con!" },
  { speaker: "BO", start: 74.85, end: 84.36, text: "Hi hi! Còn các bạn thì sao? Nhà mình hay kích rễ cho lan bằng cách gì, thuốc nào? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA15_TOTAL_FRAMES = 2531;

export const HaiLaComedy15: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = (() => {
    let found = 0;
    for (let i = 0; i < LINES.length; i++) {
      if (t >= LINES[i].start) found = i;
    }
    return found;
  })();
  const cur = LINES[idx];

  const localT = t - cur.start;
  const pop = interpolate(localT, [0, 0.25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- KARAOKE: chia câu thành cụm ~2 hàng, giọng đọc tới từ nào sáng từ đó ---
  const CHUNK_CHARS = 40; // ~2 hàng ở fontSize 54
  const words = cur.text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => Math.max(w.length, 2));
  const totalW = weights.reduce((a, b) => a + b, 0) || 1;
  const dur = Math.max(cur.end - cur.start, 0.1);
  let accW = 0;
  const wordStart = weights.map((w) => {
    const s = cur.start + (accW / totalW) * dur;
    accW += w;
    return s;
  });
  const chunkOf: number[] = [];
  let ci = 0;
  let clen = 0;
  words.forEach((w, i) => {
    const add = (clen === 0 ? 0 : 1) + w.length;
    if (clen > 0 && clen + add > CHUNK_CHARS) {
      ci += 1;
      clen = 0;
    }
    chunkOf[i] = ci;
    clen += (clen === 0 ? 0 : 1) + w.length;
  });
  let curWord = 0;
  for (let i = 0; i < words.length; i++) {
    if (t >= wordStart[i]) curWord = i;
  }
  const activeChunk = chunkOf[curWord];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("audio_haila15/bg_multi.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.04)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)" }} />

      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.3,
            textShadow: "0 2px 6px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)",
            padding: "24px 32px",
            transform: `scale(${pop})`,
          }}
        >
          {words.map((w, i) =>
            chunkOf[i] === activeChunk ? (
              <span
                key={i}
                style={{
                  color: i <= curWord ? "#ffe14d" : "rgba(255,255,255,0.55)",
                  transition: "color 0.1s",
                }}
              >
                {w + " "}
              </span>
            ) : null
          )}
        </div>
      </div>

      <Audio src={staticFile("audio_haila15/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
