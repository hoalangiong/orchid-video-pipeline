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
  { speaker: "TU", start: 0.0, end: 8.23, text: "Bo ơi! Giò lan mày nó rụng gần hết lá, thân teo nhăn nheo rồi kìa con, để vậy vài bữa nữa là đi luôn cả giò cho coi!" },
  { speaker: "BO", start: 8.58, end: 17.31, text: "Ủa chú Tư! Con tưởng nó sắp chết rồi, tính quăng thùng rác cho rồi, cây trụi lủi vầy còn cứu được nữa hả chú, hết thuốc chữa rồi!" },
  { speaker: "TU", start: 17.66, end: 26.32, text: "Bậy nào! Còn thân là còn cứu con. Trước hết lôi ra khỏi chậu, cắt sạch rễ đen thúi, chừa lại mấy cọng rễ trắng còn sống thôi!" },
  { speaker: "BO", start: 26.67, end: 34.66, text: "Á… cắt trụi rễ vậy nó sống nổi hông chú? Con thấy ghê tay quá, sợ cắt xong cây chết luôn thì tiếc đứt ruột hả chú ơi!" },
  { speaker: "TU", start: 35.01, end: 43.49, text: "Yên tâm! Cắt xong bôi keo liền sẹo hoặc quét vôi cho khỏi nhiễm. Rồi ngâm cả cây vô nước pha thuốc kích rễ chừng mười lăm phút con!" },
  { speaker: "BO", start: 43.84, end: 51.18, text: "Hèn chi… lần trước con cứ để nguyên rễ thúi trồng lại, cây càng ngày càng héo, thì ra phải cắt bỏ phần chết đi hả chú!" },
  { speaker: "TU", start: 51.53, end: 60.41, text: "Đúng đó! Xong treo ngược cây chỗ mát ẩm, mỗi ngày phun sương nhẹ, đừng trồng vô chậu vội. Chờ nhú rễ mới rồi ghép lại giá thể con!" },
  { speaker: "BO", start: 60.76, end: 70.89, text: "Trời đất… treo ngược luôn hả chú? Vậy là cắt rễ thúi, bôi keo, ngâm kích rễ, treo chỗ mát phun sương, chờ rễ ra rồi mới trồng hả!" },
  { speaker: "TU", start: 71.24, end: 79.83, text: "Ngoan! Nhớ nè: cây còn thân còn cứu được, đừng vội quăng. Kiên nhẫn dưỡng chỗ mát vài tuần là nó bật rễ non, sống lại con nghe chưa!" },
  { speaker: "BO", start: 80.18, end: 89.59, text: "Hi hi! Còn các bạn thì sao? Nhà mình có giò lan nào sắp chết mà cứu sống lại được chưa? Kể chú Tư với con nghe nha, comment liền nào!" },
];

export const HAILA22_TOTAL_FRAMES = 2688;

export const HaiLaComedy22: React.FC = () => {
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
          src={staticFile("audio_haila22/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila22/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
