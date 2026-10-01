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
  { speaker: "TU", start: 0.0, end: 9.26, text: "Bo! Chai rượu này chú hổng có uống nghe con, chú ngâm tỏi ớt gừng để phun lan. Sâu với bọ trĩ gặp cái mùi này là bỏ giàn chạy sạch luôn con!" },
  { speaker: "BO", start: 9.61, end: 19.38, text: "Trời chú Tư ơi con tưởng chú ngâm rượu thuốc uống cho khỏe khớp chớ! Rượu nóng như vậy đem phun lên lá lan là cháy lá hết còn gì, chú nói con hổng dám tin!" },
  { speaker: "TU", start: 19.73, end: 30.15, text: "Rượu chỉ để rút chất cay ra thôi con, mình pha loãng mới phun. Tỏi có chất tỏi cay, ớt có chất cay nóng, gừng có tinh dầu, sâu bọ nhạy mùi là nó tránh xa!" },
  { speaker: "BO", start: 30.5, end: 40.14, text: "Á vậy là ba thứ cay hợp lại thành một cái mùi mà sâu ghét hả chú. Vậy chú chỉ con công thức đi, bao nhiêu tỏi bao nhiêu ớt bao nhiêu gừng bao nhiêu rượu hả chú Tư?" },
  { speaker: "TU", start: 40.49, end: 50.74, text: "Nhớ nè con: một ký tỏi, một ký ớt, một ký gừng, xay cho nhuyễn hết, ngâm với ba lít rượu trắng. Bịt kín để chỗ mát, ngâm mười lăm ngày rồi lọc lấy nước cốt!" },
  { speaker: "BO", start: 51.09, end: 59.63, text: "Dạ ba ký ba lít con ghi rồi chú. Mà sao phải ngâm rượu chú ơi, ngâm nước lã hổng được hả, rượu mắc tiền hơn nước nhiều mà chú Tư!" },
  { speaker: "TU", start: 59.98, end: 69.99, text: "Rượu rút chất cay mạnh hơn với giữ được cả năm hổng thúi con! Ngâm nước chừng tuần là hôi rình phải đổ. Pha thì hai muỗng canh nước cốt cho một bình tám lít nghe con!" },
  { speaker: "BO", start: 70.34, end: 79.51, text: "Dạ hai muỗng canh cho bình tám lít. Mà phun lúc nào hả chú, con sợ phun sai giờ nó cháy lá, với phun mấy ngày một lần mới đủ hả chú Tư ơi!" },
  { speaker: "TU", start: 79.86, end: 90.15, text: "Phun chiều mát nghe con, đừng phun lúc nắng gắt. Bảy tới mười ngày một lần, mà thử một cây coi ba ngày trước đã. Phun ngừa thôi, sâu nhiều quá vẫn phải thuốc con!" },
  { speaker: "BO", start: 90.5, end: 99.83, text: "Hi hi! Cả nhà có ai từng ngâm tỏi ớt gừng phun lan chưa, comment kể cho chú Tư nghe coi hiệu quả sao nha, chú Tư mừng lắm đó cả nhà!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 40.9, vol: 0.55 },     // cau 5: cong thuc 1-1-1 + 3 lit ruou (payoff 1)
  { src: "sfx/ting.wav", at: 60.4, vol: 0.5 },      // cau 7: ty le pha 2 muong / 8 lit (payoff 2)
  { src: "sfx/shutter.wav", at: 79.86, vol: 0.45 }, // cau 9: chot cach phun
];

export const HAILA35_TOTAL_FRAMES = 3010;

export const HaiLaComedy35: React.FC = () => {
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
          src={staticFile("audio_haila35/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila35/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
