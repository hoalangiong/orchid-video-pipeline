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
  { speaker: "TU", start: 0.0, end: 8.21, text: "Bo ơi! Trời ơi ba cái sai lầm mày đang làm là giết lan nhanh nhất đó con, giàn lan mà cứ vầy thì tháng sau trơ chậu hết cho coi!" },
  { speaker: "BO", start: 8.56, end: 17.94, text: "Ủa chú Tư! Con chăm kỹ thấy mồ, ngày tưới ba lần, bón phân đều, phơi nắng cho đã, sai chỗ nào đâu mà chú la dữ vậy!" },
  { speaker: "TU", start: 18.29, end: 26.13, text: "Đó! Sai lầm số một là tưới nhiều quá con. Lan ưa ẩm chớ hổng ưa sũng, tưới ngày ba lần là thúi rễ đen thui liền!" },
  { speaker: "BO", start: 26.48, end: 33.95, text: "Á… vậy còn sai lầm số hai là gì hả chú? Con bón phân nhiều cho cây mập, chẳng lẽ bón nhiều cũng sai luôn hả trời!" },
  { speaker: "TU", start: 34.3, end: 43.11, text: "Đúng đó! Sai lầm số hai là bón phân quá tay. Phân nhiều cháy rễ, phải pha loãng nửa liều thôi, bón loãng mà thường xuyên mới đúng con!" },
  { speaker: "BO", start: 43.46, end: 51.06, text: "Hèn chi… rễ lan con lúc nào cũng đen thui, đầu rễ khô queo, thảo nào cây èo uột hoài hổng chịu lớn hà chú ơi!" },
  { speaker: "TU", start: 51.41, end: 59.93, text: "Còn sai lầm số ba nè: phơi nắng trưa gắt! Lan cần nắng sáng dịu thôi, nắng trưa chang chang là cháy lá vàng thân, phải che lưới con!" },
  { speaker: "BO", start: 60.28, end: 68.88, text: "Trời đất… ba cái con làm đều sai hết trơn! Tưới ít lại, bón loãng ra, che lưới nắng trưa, vậy là cứu được giàn hả chú!" },
  { speaker: "TU", start: 69.23, end: 77.68, text: "Ngoan! Nhớ nè: tưới vừa, bón loãng, che nắng trưa. Ba cái đó tránh được thì lan sống khỏe, bông ra đầy giàn con nghe chưa!" },
  { speaker: "BO", start: 78.03, end: 86.86, text: "Hi hi! Còn các bạn thì sao? Nhà mình hay mắc sai lầm nào trong ba cái này? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA20_TOTAL_FRAMES = 2606;

export const HaiLaComedy20: React.FC = () => {
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
          src={staticFile("audio_haila20/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila20/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
