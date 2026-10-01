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
  { speaker: "TU", start: 0.0, end: 10.03, text: "Bo! Vỏ thơm đừng có bỏ nghe con, chú ngâm làm enzyme phun lan là bọ trĩ nhện đỏ chạy mất dạng! Công thức này chú học của mấy ông tiến sĩ Thái Lan đó con!" },
  { speaker: "BO", start: 10.38, end: 20.67, text: "Ủa chú Tư? Vỏ thơm chua chua ngọt ngọt vậy mà phun lan xua được côn trùng hả chú, con tưởng ngọt vậy nó kéo tới ăn thêm chớ, chú nói con nghe hổng hiểu gì luôn!" },
  { speaker: "TU", start: 21.02, end: 31.82, text: "Ngộ ở chỗ đó con! Thơm có men bromelain, ngâm lên men ra axit hữu cơ mùi nồng. Côn trùng nó nhạy mùi, gặp cái mùi chua gắt đó là nó tránh, hổng dám đậu lá con!" },
  { speaker: "BO", start: 32.17, end: 41.58, text: "Á vậy là mình làm cho nó ghét mùi mà bỏ đi chớ hổng phải giết nó hả chú. Vậy công thức sao chú, bao nhiêu vỏ thơm bao nhiêu đường bao nhiêu nước hả chú Tư?" },
  { speaker: "TU", start: 41.93, end: 52.01, text: "Nhớ tỷ lệ ba một mười nghe con: ba phần vỏ thơm băm, một phần rỉ đường hoặc đường nâu, mười phần nước. Thùng kín hé nắp xả hơi, ngâm ba tháng cho nó chín con!" },
  { speaker: "BO", start: 52.36, end: 62.89, text: "Ba tháng lâu quá chú ơi, mà thôi chờ được. Ngâm xong con biết nó thành hả chú, nhìn cái gì để biết là dùng được, chớ hư mà đem phun là toi cả giàn lan đó chú!" },
  { speaker: "TU", start: 63.24, end: 74.06, text: "Coi mùi con! Thành thì thơm mùi chua dịu như rượu trái cây, nước nâu trong. Còn thúi như cống, nổi mốc đen là hư, đổ bỏ làm lại. Mũi mình là cái máy đo đó con!" },
  { speaker: "BO", start: 74.41, end: 84.34, text: "Dạ con hiểu, thơm chua dịu là được, thúi cống là bỏ. Rồi pha phun sao hả chú, phun mấy ngày một lần, mà phun lên hoa đang nở được hông chú Tư ơi!" },
  { speaker: "TU", start: 84.69, end: 95.15, text: "Pha một phần với năm trăm phần nước, phun chiều mát bảy tới mười ngày một lần, phun mặt dưới lá. Đừng phun lên hoa đang nở nghe con, với phun ngừa chớ bệnh nặng vẫn phải thuốc!" },
  { speaker: "BO", start: 95.5, end: 105.11, text: "Hi hi! Cả nhà thấy công thức enzyme vỏ thơm này hay hông, thả tim rồi lưu lại làm thử nha, ba tháng sau có nước xua côn trùng khỏi tốn tiền thuốc luôn đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 42.4, vol: 0.55 },     // cau 5: ty le 3-1-10 (payoff 1)
  { src: "sfx/ting.wav", at: 63.7, vol: 0.5 },      // cau 7: cach nhan biet thanh (payoff 2)
  { src: "sfx/shutter.wav", at: 84.69, vol: 0.45 }, // cau 9: chot cach phun
];

export const HAILA34_TOTAL_FRAMES = 3160;

export const HaiLaComedy34: React.FC = () => {
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
          src={staticFile("audio_haila34/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila34/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
