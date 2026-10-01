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
  { speaker: "TU", start: 0.0, end: 7.25, text: "Bo ơi! Mày nhét giàn lan vô góc kín bưng hổng có tí gió nào, ẩm thì cao ngất, thúi cây hết cho coi con ơi!" },
  { speaker: "BO", start: 7.6, end: 14.6, text: "Ủa chú Tư! Con che kín cho nó ấm, khỏi gió tạt mưa lùa, cây đỡ lung lay chớ có gì sai đâu chú!" },
  { speaker: "TU", start: 14.95, end: 22.82, text: "Bậy nào! Lan cần gió thổi cho khô ráo lá, gốc mới không úng. Bí gió mà ẩm cao là nấm khuẩn nó sinh sôi liền con!" },
  { speaker: "BO", start: 23.17, end: 30.54, text: "Á… vậy chớ gió với ẩm liên quan gì nhau hả chú? Con tưởng cứ tưới cho ẩm nhiều là cây mát là ngon rồi chớ!" },
  { speaker: "TU", start: 30.89, end: 38.83, text: "Trời đất! Ẩm cao mà có gió thì lá mau khô, cây khỏe. Ẩm cao mà bí gió thì nước đọng, đọt thúi rễ đen ngay con!" },
  { speaker: "BO", start: 39.18, end: 46.52, text: "Hèn chi… góc con để cây lúc nào cũng hầm hập, lá ướt hoài hổng khô, thảo nào thúi đọt cả loạt hà chú ơi!" },
  { speaker: "TU", start: 46.87, end: 55.1, text: "Đúng rồi đó! Treo chỗ có gió nhẹ, thưa cây ra, tưới xong phải để lá ráo trước tối. Cái quạt nhỏ cũng cứu được giàn con!" },
  { speaker: "BO", start: 55.45, end: 62.98, text: "Dạ dạ con hiểu rồi! Cho gió lùa nhẹ, treo thưa, để lá ráo trước tối chớ hổng nhốt cây trong góc bí nữa đâu chú!" },
  { speaker: "TU", start: 63.33, end: 71.32, text: "Ngoan! Nhớ nè: lan sống nhờ gió nhờ ẩm cân nhau. Thoáng gió thì ẩm cao mấy cũng khỏe, bí gió là bệnh rình con nghe!" },
  { speaker: "BO", start: 71.67, end: 81.26, text: "Hi hi! Còn các bạn thì sao? Giàn lan nhà mình có thoáng gió không, hay để góc kín? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA12_TOTAL_FRAMES = 2438;

export const HaiLaComedy12: React.FC = () => {
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
          src={staticFile("audio_haila12/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila12/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
