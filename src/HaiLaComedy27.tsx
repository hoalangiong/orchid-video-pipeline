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
  { speaker: "TU", start: 0.0, end: 10.1, text: "Bo! Cái bệnh này ác lắm con, tối qua giàn lan còn xanh um, sáng ra thối nhũn lây sạch cả giàn, mấy chục giò bay trong một đêm, hổng cứu kịp là trắng tay!" },
  { speaker: "BO", start: 10.45, end: 20.22, text: "Trời chú Tư ơi! Con thấy có giò lá tự nhiên úng một đốm trong veo, mềm nhũn rồi bốc mùi hôi thúi luôn, mà nó lan nhanh dễ sợ, là bệnh gì vậy chú?" },
  { speaker: "TU", start: 20.57, end: 30.0, text: "Đó! Thối nhũn vi khuẩn đó con, gặp nóng ẩm mưa nhiều là nó phát cực nhanh. Một giò dính mà để chung giàn là nó lây qua giò kế bên liền trong đêm!" },
  { speaker: "BO", start: 30.35, end: 39.31, text: "Ghê vậy hả chú? Vậy giờ con thấy giò nào có đốm nhũn hôi vậy là con phải làm gì trước, để yên đó hay bê nó ra khỏi giàn liền hả chú Tư ơi?" },
  { speaker: "TU", start: 39.66, end: 49.21, text: "Bê ra cách ly liền! Rồi lấy dao kéo sạch cắt bỏ hết phần nhũn, cắt lẹm qua chỗ lành chút. Cắt xong khử trùng dao ngay kẻo con dính bệnh qua giò khác!" },
  { speaker: "BO", start: 49.56, end: 59.62, text: "Á con hiểu rồi! Tách giò bệnh ra, cắt sạch chỗ thối, khử trùng dao kéo. Rồi vết cắt đó con để khô hay phải bôi thuốc gì lên cho nó khỏi tái phát hả chú?" },
  { speaker: "TU", start: 59.97, end: 69.5, text: "Phải bôi thuốc! Quét thuốc gốc đồng, hoặc Ép Xăng, Ka su min vô vết cắt, để chỗ thoáng khô ráo. Cả giàn còn lại phun ngừa một lượt cho chắc ăn con!" },
  { speaker: "BO", start: 69.85, end: 79.7, text: "Hèn chi hồi đó con để nguyên chỗ ẩm rồi tối tưới đẫm, bảo sao nó thối lan quài. Vậy là bôi thuốc, để khô thoáng, phun ngừa cả giàn đúng hông chú Tư!" },
  { speaker: "TU", start: 80.05, end: 89.82, text: "Chuẩn con! Nhớ nè: thối nhũn lây trong một đêm, thấy đốm nhũn hôi là tách ra cắt liền. Mùa mưa đừng tưới chiều tối, giàn thoáng gió thì hết lo con!" },
  { speaker: "BO", start: 90.17, end: 99.84, text: "Hi hi! Video này mà cứu được giàn lan nhà mình thì cho chú Tư với con xin một tim với bấm theo dõi đón mẹo cứu lan tập sau nha, còn cả đống bệnh lạ lắm đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/snip.wav", at: 39.66, vol: 0.6 },     // cau 5: cat bo phan nhun (payoff)
  { src: "sfx/ting.wav", at: 59.97, vol: 0.55 },    // cau 7: boi thuoc (payoff)
  { src: "sfx/shutter.wav", at: 80.05, vol: 0.45 }, // cau 9: chot recap
];

export const HAILA27_TOTAL_FRAMES = 3010;

export const HaiLaComedy27: React.FC = () => {
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
          src={staticFile("audio_haila27/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila27/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
