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
  { speaker: "TU", start: 0.0, end: 7.27, text: "Bo ơi! Lá lan mày vàng rụng cả loạt mà cứ đứng ngó, hổng tìm cho ra bệnh gì thì mất trắng cả giò con ơi!" },
  { speaker: "BO", start: 7.62, end: 15.3, text: "Ủa chú Tư! Lá vàng thì rụng cho lá mới mọc chớ có sao đâu, con để tự nhiên, mắc gì phải lo cho mệt hả chú!" },
  { speaker: "TU", start: 15.65, end: 23.52, text: "Bậy nào! Vàng lá có năm bảy kiểu con. Lá già dưới gốc vàng rụng là bình thường, chớ vàng cả ngọn cả loạt là có bệnh!" },
  { speaker: "BO", start: 23.87, end: 31.32, text: "Á… vậy chớ làm sao biết vàng nào lành vàng nào bệnh hả chú? Con thấy vàng là vàng, y chang nhau hết trơn hà!" },
  { speaker: "TU", start: 31.67, end: 40.09, text: "Trời đất! Vàng đều từ mép lá thường là thiếu nắng thừa nước. Vàng có đốm nâu lan nhanh là nấm. Vàng nhũn gốc là thúi rễ con!" },
  { speaker: "BO", start: 40.44, end: 48.41, text: "Hèn chi… lá con vàng nhũn từ gốc lên, bới ra rễ đen thui, thảo nào cây lung lay muốn ngã, thì ra thúi rễ hà chú!" },
  { speaker: "TU", start: 48.76, end: 57.14, text: "Đúng rồi đó! Thúi rễ thì lôi ra cắt hết rễ đen, bôi keo liền sẹo, trồng lại giá thể thoáng. Ngưng tưới cho gốc khô con!" },
  { speaker: "BO", start: 57.49, end: 65.69, text: "Dạ dạ con hiểu rồi! Coi kiểu vàng mà bắt bệnh, thúi rễ thì cắt trồng lại, thiếu nắng thì đem ra sáng chớ hổng ngó lơ nữa đâu chú!" },
  { speaker: "TU", start: 66.04, end: 73.93, text: "Ngoan! Nhớ nè: vàng lá là cây nó kêu cứu. Đọc đúng bệnh mà chữa thì cứu kịp, cứ để kệ là nó đi luôn cả giò con!" },
  { speaker: "BO", start: 74.28, end: 83.74, text: "Hi hi! Còn các bạn thì sao? Lan nhà mình có hay bị vàng lá không, vàng kiểu gì? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA16_TOTAL_FRAMES = 2513;

export const HaiLaComedy16: React.FC = () => {
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
          src={staticFile("audio_haila16/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila16/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
