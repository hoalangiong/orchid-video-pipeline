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
  { speaker: "TU", start: 0.0, end: 8.06, text: "Bo ơi! Lá lan mày đốm đen loang lổ, vàng cháy tùm lum vậy mà cứ để kệ, bệnh nó ăn lan cả giàn giờ mới la làng con ơi!" },
  { speaker: "BO", start: 8.41, end: 16.17, text: "Ủa chú Tư! Lá đốm chút xíu có sao đâu, con tưởng lan già lá xấu chút bình thường, để vài bữa nó tự hết chớ gì chú!" },
  { speaker: "TU", start: 16.52, end: 25.21, text: "Bậy nào! Đốm lá là nấm với vi khuẩn tấn công đó con, không trị là lây rần rần, thối nhũn cả đọt, rụng lá trơ cành luôn nghe chưa!" },
  { speaker: "BO", start: 25.56, end: 34.49, text: "Á… vậy sao lá con bị bệnh hả chú? Con tưới đều, phơi nắng đàng hoàng mà, tối nào con cũng tưới đẫm lá cho nó mát ngủ ngon nữa đó chú!" },
  { speaker: "TU", start: 34.84, end: 44.06, text: "Trời đất! Tưới lá ban đêm nước đọng qua đêm là ổ nấm khuẩn đó con! Giàn bí gió, cây chen chúc, dao kéo dơ cắt lung tung là bệnh phát liền!" },
  { speaker: "BO", start: 44.41, end: 53.29, text: "Hèn chi… tối nào con cũng xịt ướt nhẹp lá, sáng ra đọng nước long lanh con tưởng đẹp, ai dè nuôi bệnh, thảo nào lá đốm hoài hà chú ơi!" },
  { speaker: "TU", start: 53.64, end: 64.9, text: "Đúng rồi đó! Nấm thì xịt thuốc gốc đồng như Cốc tám lăm, Ridomil; thối nhũn vi khuẩn thì xài Kasumin, Starner. Cắt phần bệnh, khử trùng dao, bôi vôi liền sẹo nghe con!" },
  { speaker: "BO", start: 65.25, end: 75.59, text: "Dạ dạ con hiểu rồi! Cắt bỏ lá bệnh, khử trùng kéo, nấm xài thuốc đồng, vi khuẩn xài Kasumin Starner, tưới sáng thôi chớ hổng tưới lá ban đêm nữa đâu chú!" },
  { speaker: "TU", start: 75.94, end: 85.45, text: "Ngoan! Nhớ nè: thấy bệnh cách ly cây liền, phun phòng định kỳ, giàn thoáng gió khô ráo thì lan ít bệnh. Chớ để lá đốm mà làm lơ là toi cả vườn con!" },
  { speaker: "BO", start: 85.8, end: 96.19, text: "Hi hi! Còn các bạn thì sao? Lan nhà mình hay bị đốm lá thối nhũn không, trị bằng thuốc gì hiệu quả? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA19_TOTAL_FRAMES = 2886;

export const HaiLaComedy19: React.FC = () => {
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
          src={staticFile("audio_haila19/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila19/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
