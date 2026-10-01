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
  { speaker: "TU", start: 0.0, end: 9.86, text: "Bo! Bịch sữa tươi này chú hổng cho ai uống nghe con, chú pha nước phun lên lá lan! Lá nào lên nấm phấn trắng, phun sữa mấy bữa là nó lặn hết luôn con!" },
  { speaker: "BO", start: 10.21, end: 19.57, text: "Trời chú Tư ơi! Con tưởng chú thương cây quá rồi cho cây bú sữa nữa chớ! Sữa mà trị được nấm hả chú, con nghe sao vô lý quá á chú Tư!" },
  { speaker: "TU", start: 19.92, end: 29.52, text: "Có lý chớ con! Trong sữa có mấy con men với chất đạm, phun lên lá gặp nắng nó tạo lớp bảo vệ, nấm phấn trắng gặp cái đó là hổng mọc lan ra được nữa con!" },
  { speaker: "BO", start: 29.87, end: 38.75, text: "Á vậy là sữa làm cái áo cho lá chớ hổng phải cho cây uống hả chú. Vậy pha bao nhiêu sữa bao nhiêu nước hả chú, với sữa gì mới được hả chú Tư?" },
  { speaker: "TU", start: 39.1, end: 48.89, text: "Sữa tươi hổng đường nghe con, đừng lấy sữa đặc! Pha một phần sữa với chín phần nước sạch, quậy đều rồi phun sương mỏng lên hai mặt lá, đừng phun ướt sũng nghe con!" },
  { speaker: "BO", start: 49.24, end: 58.15, text: "Dạ một sữa chín nước, sữa hổng đường, phun sương mỏng thôi. Mà phun buổi nào hả chú, con nghe nói sữa để lâu là hôi chua lắm đó chú Tư!" },
  { speaker: "TU", start: 58.5, end: 68.99, text: "Phải phun buổi sáng có nắng nhẹ con! Nắng làm sữa khô nhanh, khô rồi mới có tác dụng. Phun chiều tối là sữa đọng lại qua đêm, nó chua thúi rồi rước thêm nấm khác con!" },
  { speaker: "BO", start: 69.34, end: 77.49, text: "Á vậy là bắt buộc phải có nắng chớ hổng phun bừa được. Vậy phun mấy lần hả chú, với có cây nào hổng nên phun cái này hông chú Tư ơi!" },
  { speaker: "TU", start: 77.84, end: 88.88, text: "Bảy ngày một lần, ba lần là thấy đỡ con. Cây đang ra hoa thì đừng phun lên cánh hoa. Mà nhớ nghe con, đây là hỗ trợ lúc nấm mới nhẹ, nấm nặng vẫn phải xài thuốc đặc trị!" },
  { speaker: "BO", start: 89.23, end: 99.02, text: "Hi hi! Cả nhà thấy mẹo sữa tươi này lạ hông, comment cho chú Tư biết giàn nhà mình có bị nấm phấn trắng chưa nha, để chú Tư coi mà chỉ thêm cho cả nhà!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 39.5, vol: 0.55 },     // cau 5: pha 1 sua 9 nuoc, sua hong duong (payoff 1)
  { src: "sfx/ting.wav", at: 58.9, vol: 0.5 },      // cau 7: bat buoc phun sang co nang (payoff 2)
  { src: "sfx/shutter.wav", at: 77.84, vol: 0.45 }, // cau 9: chot ho tro luc nam moi nhe
];

export const HAILA40_TOTAL_FRAMES = 2990;

export const HaiLaComedy40: React.FC = () => {
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
          src={staticFile("audio_haila40/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila40/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
