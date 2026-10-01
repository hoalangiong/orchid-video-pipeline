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
  { speaker: "TU", start: 0.0, end: 7.97, text: "Ối Bo ơi! Mày treo lan quay mặt vô tường tối hù vầy thì cây nó lấy nắng đâu mà sống hả con? Èo uột hết rồi kìa!" },
  { speaker: "BO", start: 8.32, end: 14.77, text: "Ủa chú Tư! Con sợ nắng gắt cháy lá nên treo chỗ râm cho mát, vậy mà chú còn la con nữa!" },
  { speaker: "TU", start: 15.12, end: 22.78, text: "Bậy nào! Lan cần nắng sáng dịu, treo hướng đông đón nắng sớm là đẹp nhất. Chớ giấu tối thui vầy hoa đâu mà nở con!" },
  { speaker: "BO", start: 23.13, end: 29.29, text: "Á… hướng đông là hướng nào hả chú? Con treo đại chỗ nào có móc là móc lên thôi chớ bộ!" },
  { speaker: "TU", start: 29.64, end: 37.59, text: "Trời đất! Hướng đông là hướng mặt trời mọc đó con! Nắng sớm mát, tới trưa che lưới lại, chiều bớt gắt là lan khỏe re!" },
  { speaker: "BO", start: 37.94, end: 44.57, text: "Hèn chi… giàn con toàn hướng tây, chiều nắng chang chang cháy lá vàng khè, con cứ tưởng tại thiếu nước chớ!" },
  { speaker: "TU", start: 44.92, end: 52.79, text: "Đó! Với lại căng thêm lớp lưới xanh cắt bớt nắng, treo cao thoáng gió. Đủ sáng mà không gắt thì cây mập mạp con ơi!" },
  { speaker: "BO", start: 53.14, end: 60.82, text: "Dạ dạ con hiểu rồi! Treo hướng đông đón nắng sớm, che lưới lúc trưa, thoáng gió, chứ hổng giấu chỗ tối nữa đâu chú!" },
  { speaker: "TU", start: 61.17, end: 68.59, text: "Ngoan! Nhớ nè: lan như người, tắm nắng sớm thì khỏe, phơi nắng trưa thì cháy da, treo đúng hướng là thắng nửa rồi con!" },
  { speaker: "BO", start: 68.94, end: 76.85, text: "Hi hi! Còn các bạn thì sao? Giàn lan nhà mình treo hướng nào? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA7_TOTAL_FRAMES = 2320;

export const HaiLaComedy7: React.FC = () => {
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
          src={staticFile("audio_haila7/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila7/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
