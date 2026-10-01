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
  { speaker: "TU", start: 0.0, end: 9.17, text: "Bo! Chú lấy viên thuốc cảm trong tủ thuốc ra pha nước tưới lan nghe con. Cây yếu tưới vô là nó tự đề kháng, hết thối nhũn hết đốm lá luôn con!" },
  { speaker: "BO", start: 9.52, end: 18.87, text: "Hả chú Tư? Thuốc cảm của người mà chú cho cây uống hả, cây lan nó bị cảm sốt hồi nào mà chú cho uống thuốc, chú làm con hết hiểu gì luôn á chú!" },
  { speaker: "TU", start: 19.22, end: 29.13, text: "Hi hi cây hổng cảm con, mà viên aspirin nó có chất giống hoóc môn cây tự tiết ra lúc bị bệnh. Tưới vô là cây tưởng có giặc, nó bật hệ đề kháng lên trước con!" },
  { speaker: "BO", start: 29.48, end: 40.09, text: "Á vậy là mình gạt cây, cho nó tưởng đang bị tấn công để nó tự đề phòng hả chú. Vậy pha bao nhiêu viên hả chú, con sợ pha đặc quá là cháy rễ chết cây luôn đó chú!" },
  { speaker: "TU", start: 40.44, end: 50.28, text: "Nhẹ tay thôi con: một viên aspirin tám mươi mốt li gam cho bốn lít nước, nghiền nhuyễn quậy tan. Nửa tháng tới một tháng phun một lần, đừng có phun hoài nghe con!" },
  { speaker: "BO", start: 50.63, end: 59.74, text: "Dạ một viên nhỏ cho bốn lít, nửa tháng một lần. Mà con nghe mấy anh còn pha thêm vitamin B một nữa, cái đó có tác dụng gì khác hả chú Tư ơi!" },
  { speaker: "TU", start: 60.09, end: 71.21, text: "B một là để cây đỡ sốc con! Cây mới tách chậu mới ghép gỗ, rễ bị đau, tưới B một vô là nó bớt sốc mau ra rễ. Aspirin lo đề kháng, B một lo hồi sức nghe con!" },
  { speaker: "BO", start: 71.56, end: 81.12, text: "Á con hiểu rồi, aspirin cho kháng bệnh còn B một cho hồi sức ra rễ. Vậy hai cái pha chung một bình được hông chú, hay phải tưới riêng từng thứ hả chú Tư?" },
  { speaker: "TU", start: 81.47, end: 92.05, text: "Pha chung được con, mà nhớ ba điều: đừng pha chung với thuốc kiềm, tưới chiều mát, với đây là hỗ trợ chớ hổng phải thuốc. Cây thối nhũn nặng vẫn phải xài thuốc đặc trị nghe con!" },
  { speaker: "BO", start: 92.4, end: 102.9, text: "Hi hi! Cả nhà thấy mẹo aspirin với B một này lạ hông, thả tim rồi lưu lại thử một cây coi sao nha, đừng làm cả giàn liền nghe cả nhà, chú Tư nhắc đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 40.9, vol: 0.55 },     // cau 5: lieu 1 vien 81mg / 4 lit (payoff 1)
  { src: "sfx/ting.wav", at: 60.5, vol: 0.5 },      // cau 7: B1 chong soc ra re (payoff 2)
  { src: "sfx/shutter.wav", at: 81.47, vol: 0.45 }, // cau 9: chot 3 dieu can nho
];

export const HAILA37_TOTAL_FRAMES = 3140;

export const HaiLaComedy37: React.FC = () => {
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
          src={staticFile("audio_haila37/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila37/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
