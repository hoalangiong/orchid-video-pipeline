import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const FPS = 30;

type Line = { speaker: "TU" | "BO"; start: number; end: number; text: string };

const LINES: Line[] = [
  { speaker: "TU", start: 0.0, end: 9.5, text: "Bo! Lon bia này chú hổng có uống nghe con, chú pha với sữa tươi để lau lá lan. Lau xong lá nó bóng lưỡng như tráng dầu, khách tới coi là mê liền con!" },
  { speaker: "BO", start: 9.85, end: 20.51, text: "Ủa chú Tư? Con thấy chú lom khom sau giàn lan với lon bia, con tưởng chú trốn vô đây uống một mình chớ! Bia đem lau lá lan thiệt hả chú, nghe lạ đời quá!" },
  { speaker: "TU", start: 20.86, end: 31.57, text: "Thiệt con! Bia có men bia với vitamin nhóm B, còn đường trong bia làm mặt lá sáng lên. Sữa tươi có chất đạm với chất béo, lau vô nó phủ mỏng giữ lá hổng bị khô con!" },
  { speaker: "BO", start: 31.92, end: 41.89, text: "Á vậy là bia làm sáng còn sữa làm mượt hả chú. Vậy pha sao chú, đổ nguyên lon bia lên khăn lau luôn hả, hay phải pha thêm nước gì nữa hả chú Tư?" },
  { speaker: "TU", start: 42.24, end: 52.56, text: "Đừng đổ nguyên lon nghe con, dính quá kiến bu! Nửa lon bia, một phần sữa tươi hổng đường, thêm hai phần nước sạch. Quậy đều rồi nhúng khăn mềm lau nhẹ từng lá con!" },
  { speaker: "BO", start: 52.91, end: 61.95, text: "Dạ nửa lon bia một sữa hai nước, con ghi rồi. Mà lau mặt trên với mặt dưới lá luôn hả chú, với lau xong có cần rửa lại nước hông chú Tư ơi!" },
  { speaker: "TU", start: 62.3, end: 73.51, text: "Lau mặt trên thôi con, mặt dưới có lỗ thở đừng bít nó. Lau nhẹ theo chiều lá, sáng sớm mà lau. Bốn tới sáu tiếng sau xịt nước rửa lại, đừng để nó dính qua đêm nghe con!" },
  { speaker: "BO", start: 73.86, end: 82.79, text: "Á phải rửa lại nữa hả chú, may con hỏi chớ hổng thôi con để luôn. Mà tuần lau mấy lần hả chú, lau nhiều lá bóng nhiều hông chú Tư!" },
  { speaker: "TU", start: 83.14, end: 93.32, text: "Đừng có tham con! Hai tới ba tuần lau một lần là đủ. Lau nhiều dính đường kiến bu nấm mọc, mà cây đang bệnh đang thối lá thì đừng lau, chữa bệnh xong đã nghe con!" },
  { speaker: "BO", start: 93.67, end: 103.88, text: "Hi hi! Cả nhà có ai từng lấy bia lau lá lan chưa, hay lần đầu nghe như con vậy, comment cho chú Tư biết coi nha, chú Tư chờ đó cả nhà ơi!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 42.7, vol: 0.55 },     // cau 5: cong thuc nua lon bia - 1 sua - 2 nuoc (payoff 1)
  { src: "sfx/ting.wav", at: 62.7, vol: 0.5 },      // cau 7: chi lau mat tren + rua lai (payoff 2)
  { src: "sfx/shutter.wav", at: 83.14, vol: 0.45 }, // cau 9: chot tan suat + canh bao
];

export const HAILA36_TOTAL_FRAMES = 3130;

export const HaiLaComedy36: React.FC = () => {
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
          src={staticFile("audio_haila36/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila36/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
