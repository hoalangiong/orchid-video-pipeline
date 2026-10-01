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
  { speaker: "TU", start: 0.0, end: 7.2, text: "Ối Bo ơi! Cây lan thối nhũn chảy nước hôi rình mà mày còn để nguyên trên giàn hả? Lây qua cả vườn giờ đó con!" },
  { speaker: "BO", start: 7.55, end: 14.29, text: "Ủa chú Tư! Con tưởng thối chút xíu, xịt đại thuốc nấm vô là hết chớ gì, mắc gì phải cắt hả chú?" },
  { speaker: "TU", start: 14.64, end: 22.15, text: "Bậy nào! Thối nhũn là vi khuẩn, không phải nấm! Xịt thuốc nấm trớt quớt, phải cắt bỏ chỗ thối cho lẹ con!" },
  { speaker: "BO", start: 22.5, end: 27.75, text: "Á… cắt sao cho đúng hả chú? Con lấy tay bẻ đại khúc thối quăng đi được hông?" },
  { speaker: "TU", start: 28.1, end: 35.4, text: "Trời đất! Phải dùng dao khử trùng, cắt lẹm qua cả phần lành một chút, rồi bôi vôi hay keo liền sát vết cắt con!" },
  { speaker: "BO", start: 35.75, end: 42.36, text: "Hèn chi… con bẻ tay lần trước, bữa sau nó thối tùm lum thêm mấy cây kế bên, tức muốn xỉu chú ơi!" },
  { speaker: "TU", start: 42.71, end: 50.8, text: "Đó! Với lại tách cây bệnh ra riêng, để chỗ thoáng khô, ngưng tưới đẫm vài bữa. Ẩm ướt là vi khuẩn nó khoái lắm con!" },
  { speaker: "BO", start: 51.15, end: 58.38, text: "Dạ dạ con hiểu rồi! Cắt bằng dao sạch, bôi vôi vết cắt, tách riêng cho khô thoáng, chứ hổng xịt bừa nữa đâu chú!" },
  { speaker: "TU", start: 58.73, end: 65.55, text: "Ngoan! Nhớ nè: thối nhũn như đám cháy, dập lẹ thì cứu được, chần chừ là nó thiêu rụi cả vườn đó con!" },
  { speaker: "BO", start: 65.9, end: 74.31, text: "Hi hi! Còn các bạn thì sao? Lan bị thối nhũn có ai cứu kịp hông? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA6_TOTAL_FRAMES = 2245;

export const HaiLaComedy6: React.FC = () => {
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
          src={staticFile("audio_haila6/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila6/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
