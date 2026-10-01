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
  { speaker: "TU", start: 0.0, end: 9.79, text: "Bo! Nắm thuốc lá vụn này chú hổng có hút nghe con, chú ngâm nước để trị rệp sáp! Ngâm một đêm là ra nước vàng, rệp gặp nó là rụng hết luôn con!" },
  { speaker: "BO", start: 10.14, end: 19.6, text: "Trời chú Tư ơi con thấy chú núp sau giàn lan với gói thuốc lá, con tưởng chú trốn dì Tư ra đây hút một hơi chớ! Thuốc lá mà trị rệp được hả chú Tư?" },
  { speaker: "TU", start: 19.95, end: 30.58, text: "Được con! Trong lá thuốc có chất ni cô tin, chất đó là độc thần kinh với sâu rệp. Ngâm nước nó tan ra, phun vô là rệp tê liệt rụng xuống, hổng cần thuốc chợ con!" },
  { speaker: "BO", start: 30.93, end: 40.62, text: "Á vậy cái chất làm người ta say thuốc là cái chất giết rệp luôn hả chú. Vậy ngâm sao chú, bao nhiêu thuốc lá bao nhiêu nước, ngâm bao lâu mới xài được hả chú Tư?" },
  { speaker: "TU", start: 40.97, end: 51.39, text: "Nghe nè con: năm chục gam thuốc lá vụn cho một lít nước, ngâm một đêm cho nước ra vàng sậm. Lọc bỏ xác, rồi pha thêm một phần nước cốt với mười phần nước sạch mới phun!" },
  { speaker: "BO", start: 51.74, end: 61.48, text: "Dạ năm chục gam một lít, ngâm một đêm rồi pha một mười. Mà chú ơi cái này độc với rệp thì có độc với mình hông chú, con phun mà con hít vô có sao hông chú Tư?" },
  { speaker: "TU", start: 61.83, end: 72.44, text: "Có con, cái này độc thiệt chớ hổng phải chơi! Phun là phải đeo khẩu trang với bao tay, phun xong rửa tay liền. Đừng để con nhỏ tới gần, đừng phun gần hồ cá nghe con!" },
  { speaker: "BO", start: 72.79, end: 82.69, text: "Dạ con nhớ, đeo khẩu trang bao tay, tránh con nhỏ với hồ cá. Mà phun mấy ngày một lần hả chú, với phun rồi bao lâu mới được đụng vô cây hả chú Tư ơi!" },
  { speaker: "TU", start: 83.04, end: 93.77, text: "Bảy ngày một lần thôi con, phun chiều mát, hai ba lần là rệp sạch. Phun xong hai ngày đừng đụng vô lá. Mà nhớ nghe con, chỉ phun khi có rệp thiệt, đừng phun ngừa bừa bãi!" },
  { speaker: "BO", start: 94.12, end: 104.54, text: "Hi hi! Cả nhà nhớ mẹo này lợi hại mà cũng độc nghe, thả tim rồi lưu lại, mà làm là phải đeo khẩu trang bao tay đầy đủ nha cả nhà, chú Tư nhắc kỹ đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 41.4, vol: 0.55 },     // cau 5: lieu 50g/lit + pha 1:10 (payoff 1)
  { src: "sfx/ting.wav", at: 62.3, vol: 0.5 },      // cau 7: canh bao doc, khau trang bao tay (payoff 2)
  { src: "sfx/shutter.wav", at: 83.04, vol: 0.45 }, // cau 9: chot chi phun khi co rep thiet
];

export const HAILA39_TOTAL_FRAMES = 3140;

export const HaiLaComedy39: React.FC = () => {
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
          src={staticFile("audio_haila39/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila39/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
