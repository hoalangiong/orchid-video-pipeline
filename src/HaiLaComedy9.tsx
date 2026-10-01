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
  { speaker: "TU", start: 0.0, end: 6.89, text: "Ối trời Bo ơi! Ngày nào mày cũng xối nước ào ào hai ba lần vầy thì thúi rễ hết đám lan của tao con ơi!" },
  { speaker: "BO", start: 7.24, end: 13.51, text: "Ủa chú Tư! Cây khát nước thì tưới nhiều cho nó đã, tưới càng nhiều lá càng xanh chớ có sao đâu chú!" },
  { speaker: "TU", start: 13.86, end: 21.78, text: "Bậy nào! Lan nó ưa ẩm chớ hổng ưa sũng. Giá thể còn ướt mà mày cứ chế nước vô, rễ ngộp thở là thúi đen liền!" },
  { speaker: "BO", start: 22.13, end: 28.29, text: "Á… vậy chớ khi nào mới tưới hả chú? Con đâu có biết lúc nào cây khát lúc nào cây no đâu!" },
  { speaker: "TU", start: 28.64, end: 36.11, text: "Thò ngón tay vô giá thể, thấy khô se se mới tưới. Còn ẩm là nhịn. Sáng sớm tưới là ngon nhất con nghe chưa!" },
  { speaker: "BO", start: 36.46, end: 43.27, text: "Trời… hèn chi con toàn tưới chiều tối, sáng ra gốc lúc nào cũng nhẹp nhẹp, thảo nào rễ đen thui hà chú!" },
  { speaker: "TU", start: 43.62, end: 50.85, text: "Đúng rồi đó! Tưới chiều muộn nước đọng qua đêm, lạnh với bí là ổ bệnh. Tưới là tưới đẫm một lần rồi thôi nghen!" },
  { speaker: "BO", start: 51.2, end: 58.38, text: "Dạ dạ con hiểu rồi! Sờ thấy khô mới tưới, tưới sáng sớm, tưới đẫm một lần chớ hổng xối tù mù nữa đâu chú!" },
  { speaker: "TU", start: 58.73, end: 66.0, text: "Ngoan! Nhớ nè: tưới lan là canh độ ẩm chớ hổng canh cái đồng hồ. Khô mới tưới thì rễ mập, tưới bừa là toi con!" },
  { speaker: "BO", start: 66.35, end: 75.63, text: "Hi hi! Còn các bạn thì sao? Nhà mình hay tưới lan lúc mấy giờ, ngày mấy lần? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA9_TOTAL_FRAMES = 2269;

export const HaiLaComedy9: React.FC = () => {
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
          src={staticFile("audio_haila9/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila9/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
