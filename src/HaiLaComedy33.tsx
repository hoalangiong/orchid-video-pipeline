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
  { speaker: "TU", start: 0.0, end: 10.18, text: "Bo! Cái thùng hôi rình chú để góc vườn đó là vàng lỏng nghe con, đạm cá tự ngâm! Tưới cái này lan bung chồi mập ú, khỏi tốn tiền mua phân đắt đỏ luôn con!" },
  { speaker: "BO", start: 10.53, end: 20.66, text: "Trời chú Tư ơi con tưởng thùng rác chú quên đổ chớ, hôi thấu trời luôn á, ruồi bu đen thùi. Cái nước thúi đó tưới lan thiệt hả chú, cây hổng chết luôn sao?" },
  { speaker: "TU", start: 21.01, end: 30.88, text: "Ngâm đúng thì hổng thúi con! Ruột cá đầu cá bỏ vô ngâm với thơm băm, thơm có men phân giải thịt cá thành đạm cho cây ăn, thêm rỉ đường với EM nuôi vi sinh nữa!" },
  { speaker: "BO", start: 31.23, end: 41.0, text: "Á có men thơm với vi sinh nữa hả chú, nghe khoa học quá. Vậy chú chỉ con công thức đi, bỏ bao nhiêu cá bao nhiêu thơm bao nhiêu rỉ đường mới đúng hả chú Tư?" },
  { speaker: "TU", start: 41.35, end: 51.79, text: "Nghe nè: ba ký cá với một ký thơm băm nhuyễn, một lít rỉ đường, thêm nắp EM, đổ nước xâm xấp. Thùng kín có van xả hơi, ngâm ba mươi tới bốn mươi lăm ngày con!" },
  { speaker: "BO", start: 52.14, end: 62.32, text: "Dạ con ghi rồi, ba cá một thơm một lít rỉ đường. Mà con nghe mấy anh còn ngâm đạm tôm nữa, vỏ tôm đầu tôm đó, cái đó khác đạm cá chỗ nào hả chú Tư?" },
  { speaker: "TU", start: 62.67, end: 73.76, text: "Đạm tôm hay lắm con! Vỏ tôm có chất kít tin với canxi, tưới vô là rễ đâm mạnh thân cứng, cây tự kháng bệnh giỏi hơn. Cá cho đạm nuôi lá, tôm cho cứng cây nghe con!" },
  { speaker: "BO", start: 74.11, end: 84.69, text: "Á con hiểu rồi! Đạm cá nuôi lá bung chồi, đạm tôm cho rễ mạnh cứng cây. Mà ngâm xong rồi pha bao nhiêu nước mới tưới được hả chú, đặc quá là chết cây hông?" },
  { speaker: "TU", start: 85.04, end: 94.9, text: "Nhớ kỹ nghe con: lọc kỹ rồi pha một phần với năm trăm tới một ngàn phần nước, tưới gốc chiều mát, đừng phun lên hoa. Chưa hoai hết mùi thúi là đừng có dùng con!" },
  { speaker: "BO", start: 95.25, end: 105.83, text: "Hi hi! Cả nhà có ai từng ngâm đạm cá đạm tôm tưới lan chưa, thấy công thức hay thì lưu lại với chia sẻ cho hội chơi lan cùng làm nha, đỡ tốn tiền phân lắm đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 41.8, vol: 0.55 },     // cau 5: cong thuc dam ca (payoff 1)
  { src: "sfx/ting.wav", at: 63.1, vol: 0.5 },      // cau 7: dam tom kit tin (payoff 2)
  { src: "sfx/shutter.wav", at: 85.04, vol: 0.45 }, // cau 9: chot ty le pha
];

export const HAILA33_TOTAL_FRAMES = 3180;

export const HaiLaComedy33: React.FC = () => {
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
          src={staticFile("audio_haila33/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila33/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
