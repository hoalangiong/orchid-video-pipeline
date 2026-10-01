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
  { speaker: "TU", start: 0.0, end: 7.1, text: "Bo ơi! Mày đem giò lan phơi nắng trưa chang chang vầy thì cháy lá hết trơn, lan nó có phải rau muống đâu con!" },
  { speaker: "BO", start: 7.45, end: 14.43, text: "Ủa chú Tư! Cây cần nắng mới ra hoa mà, con phơi nắng gắt cho nó nhiều nắng luôn, càng nắng càng bông chớ chú!" },
  { speaker: "TU", start: 14.78, end: 23.01, text: "Bậy nào! Lan ưa nắng sáng dịu với nắng chiều thôi con. Nắng trưa gắt phải che lưới lan, chớ phơi trần là cháy lá vàng thân!" },
  { speaker: "BO", start: 23.36, end: 29.92, text: "Á… vậy chớ treo chỗ nào mới đúng hả chú? Con tưởng chỗ nào nắng nhiều nhất là tốt nhất chớ bộ!" },
  { speaker: "TU", start: 30.27, end: 38.0, text: "Trời đất! Treo chỗ sáng có lưới che bớt, khoảng bảy tám phần nắng thôi. Lá xanh hơi ngả vàng chanh là vừa nắng đó con!" },
  { speaker: "BO", start: 38.35, end: 45.76, text: "Hèn chi… lá lan con chỗ thì cháy nám, chỗ thì xanh đen lét, thảo nào cây yếu nhớt hoa chẳng thấy đâu hà chú!" },
  { speaker: "TU", start: 46.11, end: 54.27, text: "Đúng rồi đó! Lá xanh đen thui là thiếu nắng, lá cháy nám là dư nắng. Canh cái lưới che cho vừa là cây khỏe hoa sai con!" },
  { speaker: "BO", start: 54.62, end: 62.41, text: "Dạ dạ con hiểu rồi! Nắng sáng nắng chiều thì tốt, nắng trưa che lưới, canh lá xanh chanh chớ hổng phơi trần nữa đâu chú!" },
  { speaker: "TU", start: 62.76, end: 70.75, text: "Ngoan! Nhớ nè: nắng đủ thì lan mới nở, nhưng đủ chớ đừng thừa. Che lưới đúng độ thì lá đẹp hoa bền con nghe chưa!" },
  { speaker: "BO", start: 71.1, end: 80.82, text: "Hi hi! Còn các bạn thì sao? Giàn lan nhà mình treo chỗ nắng nhiều hay ít, có che lưới không? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA11_TOTAL_FRAMES = 2425;

export const HaiLaComedy11: React.FC = () => {
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
          src={staticFile("audio_haila11/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila11/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
