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
  { speaker: "TU", start: 0.0, end: 8.33, text: "Bo ơi! Vỏ chuối mày lấy nguyên miếng đắp lên gốc lan đó hả con? Trời ơi tưởng bổ mà làm vậy là rước kiến rước nấm về đó con!" },
  { speaker: "BO", start: 8.68, end: 18.11, text: "Ủa chú Tư! Người ta nói vỏ chuối nhiều kali, tốt cho hoa, con đắp lên cho lan hút, sai chỗ nào đâu mà chú la con dữ vậy nè!" },
  { speaker: "TU", start: 18.46, end: 27.22, text: "Đó! Vỏ chuối tươi đắp lên là sai. Nó thối rữa, dụ kiến gián ruồi bu, sinh nấm mốc quanh gốc, rễ lan hư hết trơn con ơi!" },
  { speaker: "BO", start: 27.57, end: 35.46, text: "Á… vậy chớ vỏ chuối nhiều kali thiệt mà, bỏ thì uổng. Làm sao xài cho đúng để lan hút được kali cho bông to hả chú!" },
  { speaker: "TU", start: 35.81, end: 44.18, text: "Phải ủ con! Vỏ chuối cắt nhỏ, ngâm nước hoặc ủ với men vi sinh chừng hai ba tuần, lọc lấy nước, pha loãng ra rồi mới tưới!" },
  { speaker: "BO", start: 44.53, end: 52.37, text: "Hèn chi… con đắp nguyên miếng, mấy bữa gốc lúc nhúc kiến, mốc trắng bám đầy, thảo nào rễ đen thui hư gốc hà chú ơi trời!" },
  { speaker: "TU", start: 52.72, end: 61.5, text: "Đúng đó! Nước vỏ chuối ủ giàu kali với lân, giúp cứng cây sai bông. Pha loãng tưới gốc hai tuần một lần lúc cây chuẩn bị ra hoa con!" },
  { speaker: "BO", start: 61.85, end: 69.77, text: "Trời đất… vậy là phải ủ cho hoai, lọc lấy nước, pha loãng tưới lúc sắp ra bông, chớ hổng phải đắp nguyên miếng như con làm hả chú!" },
  { speaker: "TU", start: 70.12, end: 78.78, text: "Ngoan! Nhớ nè: vỏ chuối tươi là ổ bệnh, ủ hoai lọc nước mới thành phân kali. Làm đúng thì lan cứng cây, bông to bền màu con nghe chưa!" },
  { speaker: "BO", start: 79.13, end: 89.09, text: "Hi hi! Còn các bạn thì sao? Nhà mình có ai ủ vỏ chuối tưới lan chưa, ra bông đẹp không? Kể chú Tư với con nghe nha, comment liền nào!" },
];

export const HAILA23_TOTAL_FRAMES = 2673;

export const HaiLaComedy23: React.FC = () => {
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

  // --- KARAOKE: chia cau thanh cum ~2 hang, giong doc toi tu nao sang tu do ---
  const CHUNK_CHARS = 40; // ~2 hang o fontSize 54
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
          src={staticFile("audio_haila23/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila23/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
