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
  { speaker: "TU", start: 0.0, end: 7.42, text: "Bo ơi! Mày mới rinh giò lan về là quăng lên giàn phơi nắng tưới ào ào liền, cây chưa quen là sốc chết đứng con ơi!" },
  { speaker: "BO", start: 7.77, end: 15.39, text: "Ủa chú Tư! Lan mới mua đẹp vậy, con treo lên cho nó quen chỗ mới, tưới bón đầy đủ cho mau lớn, sai đâu chú!" },
  { speaker: "TU", start: 15.74, end: 23.38, text: "Bậy nào! Cây mới về còn yếu, phải để chỗ mát treo riêng vài bữa cho nó hồi, đừng bón phân đừng phơi nắng gắt liền!" },
  { speaker: "BO", start: 23.73, end: 31.12, text: "Á… vậy chớ để riêng chi hả chú? Con thấy giàn đang trống, treo chung cho vui, tưới luôn thể một lượt cho tiện mà!" },
  { speaker: "TU", start: 31.47, end: 39.29, text: "Trời đất! Treo riêng để coi nó có sâu bệnh hông, lây qua cả giàn thì khổ. Cách ly cả tuần thấy khỏe mới nhập bầy con!" },
  { speaker: "BO", start: 39.64, end: 46.98, text: "Hèn chi… bữa con mua giò lan về treo chung, mấy bữa sau cả giàn nổi rệp, thảo nào lây tùm lum hết hà chú ơi!" },
  { speaker: "TU", start: 47.33, end: 55.44, text: "Đúng rồi đó! Về là để mát, phun phòng nấm khuẩn một lần, tưới nhẹ thôi. Cây bung rễ mới bắt nắng tăng dần lên nghen con!" },
  { speaker: "BO", start: 55.79, end: 63.47, text: "Dạ dạ con hiểu rồi! Về để mát, cách ly phun phòng, tưới nhẹ rồi tăng nắng từ từ chớ hổng phơi bón liền nữa đâu chú!" },
  { speaker: "TU", start: 63.82, end: 71.98, text: "Ngoan! Nhớ nè: thuần lan là cho nó làm quen từ từ như người lạ tới nhà. Vội vàng ép nắng ép phân là mất cây con!" },
  { speaker: "BO", start: 72.33, end: 82.6, text: "Hi hi! Còn các bạn thì sao? Mua lan mới về nhà mình có cách ly thuần cây không, hay treo chung liền? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA14_TOTAL_FRAMES = 2478;

export const HaiLaComedy14: React.FC = () => {
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
          src={staticFile("audio_haila14/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila14/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
