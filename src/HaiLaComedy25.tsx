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
  { speaker: "TU", start: 0.0, end: 8.38, text: "Bo! Giò lan bạc triệu của mày lá đang nhăn nheo teo tóp lại kìa, cứ đà này ba bữa nữa là thành củi khô, cứu gấp còn kịp con!" },
  { speaker: "BO", start: 8.73, end: 16.64, text: "Hả chú Tư? Con thấy lá nó nhăn nhăn tưởng thiếu nước nên quất cho nó ngập luôn ngày hai lần, mà sao càng tưới nó càng tóp vậy chú?" },
  { speaker: "TU", start: 16.99, end: 26.3, text: "Đó! Sai chỗ đó con. Lá nhăn chưa chắc thiếu nước đâu, chín phần mười là do bộ rễ hư rồi, rễ thối thì tưới bao nhiêu cây cũng hổng hút được!" },
  { speaker: "BO", start: 26.65, end: 35.27, text: "Trời… vậy là gốc rễ có vấn đề chớ hổng phải khát nước hả chú? Vậy con phải làm sao, nhấc lên coi rễ hay để nguyên vậy hả chú Tư?" },
  { speaker: "TU", start: 35.62, end: 44.67, text: "Nhấc ra liền! Rễ nào đen nhũn hư thì cắt bỏ, chừa rễ trắng cứng. Cắt xong bôi keo liền da hoặc quét vôi cho khỏi nhiễm nấm con nghe!" },
  { speaker: "BO", start: 45.02, end: 54.19, text: "Á con hiểu rồi! Cắt sạch rễ đen, chừa rễ khỏe, bôi keo liền da chống nấm. Rồi sau đó con trồng lại luôn hay phải dưỡng gì nữa hả chú?" },
  { speaker: "TU", start: 54.54, end: 63.49, text: "Đừng vội trồng! Ngâm gốc vô dung dịch kích rễ như Bi một, Ba con năm, rồi treo chỗ mát ẩm, xịt sương thôi đừng tưới đẫm cho ra rễ mới!" },
  { speaker: "BO", start: 63.84, end: 72.93, text: "Hèn chi con trồng lại liền nên nó không hồi. Vậy là ngâm kích rễ, treo mát xịt sương, chờ ra rễ mới mới trồng, đúng hông chú Tư ơi!" },
  { speaker: "TU", start: 73.28, end: 82.52, text: "Chuẩn con! Nhớ nè: lá nhăn teo là kêu cứu bộ rễ, đừng thấy nhăn là tưới thêm. Cắt rễ hư, kích rễ mới, cây sống lại phà phà cho coi!" },
  { speaker: "BO", start: 82.87, end: 92.25, text: "Hi hi! Còn các bạn thì sao, giò lan nhà mình có bị lá nhăn teo tóp giống vầy hông? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 35.62, vol: 0.55 },    // cau 5: cat re (payoff)
  { src: "sfx/snip.wav", at: 37.0, vol: 0.6 },      // tiac keo cat
  { src: "sfx/ting.wav", at: 54.54, vol: 0.55 },    // cau 7: kich re (payoff)
  { src: "sfx/shutter.wav", at: 73.28, vol: 0.45 }, // cau 9: chot recap
  { src: "sfx/pot.wav", at: 74.6, vol: 0.5 },       // dat chau
];

export const HAILA25_TOTAL_FRAMES = 2768;

export const HaiLaComedy25: React.FC = () => {
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
          src={staticFile("audio_haila25/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila25/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
