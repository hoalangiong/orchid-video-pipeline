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
  { speaker: "TU", start: 0.0, end: 7.63, text: "Ối Bo ơi! Mùa nào mày cũng quất một loại phân y chang vầy thì cây nó loạn hết đó con! Bón trật mùa là công cốc!" },
  { speaker: "BO", start: 7.98, end: 14.62, text: "Ủa chú Tư! Phân là phân, cứ bón đều tay quanh năm cho nó mập, mắc gì phải chia mùa cho mệt hả chú?" },
  { speaker: "TU", start: 14.97, end: 22.29, text: "Bậy nào! Mùa cây lớn thì bón đạm cao cho ra lá ra thân, tới mùa chuẩn bị hoa thì tăng lân với kali con ơi!" },
  { speaker: "BO", start: 22.64, end: 29.64, text: "Á… đạm với lân kali khác nhau sao hả chú? Con thấy bịch nào cũng phân, xúc đại một loại thôi chớ bộ!" },
  { speaker: "TU", start: 29.99, end: 38.15, text: "Trời đất! Đạm cho xanh tốt lá, lân kali cho cứng cây bền hoa. Bón đạm nhằm mùa hoa là nó phở lá, hoa đâu mà coi!" },
  { speaker: "BO", start: 38.5, end: 45.0, text: "Hèn chi… con toàn bón đạm, cây con xanh um mà chả thấy nụ nào, tức muốn khóc luôn á chú ơi!" },
  { speaker: "TU", start: 45.35, end: 53.42, text: "Đó! Với lại mùa cây nghỉ, lạnh hay khô quá thì ngưng bón, để cây dưỡng sức. Ép ăn lúc nghỉ là hư rễ con nghe chưa!" },
  { speaker: "BO", start: 53.77, end: 61.99, text: "Dạ dạ con hiểu rồi! Mùa lớn bón đạm, mùa hoa tăng lân kali, mùa nghỉ thì ngưng, chứ hổng bón đều tù mù nữa đâu chú!" },
  { speaker: "TU", start: 62.34, end: 69.88, text: "Ngoan! Nhớ nè: bón phân như cho ăn theo tuổi, đúng mùa đúng lúc thì cây khỏe hoa sai, bón bừa là tiền mất tật mang con!" },
  { speaker: "BO", start: 70.23, end: 78.8, text: "Hi hi! Còn các bạn thì sao? Mùa này nhà mình đang bón phân gì cho lan? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA8_TOTAL_FRAMES = 2378;

export const HaiLaComedy8: React.FC = () => {
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
          src={staticFile("audio_haila8/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila8/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
