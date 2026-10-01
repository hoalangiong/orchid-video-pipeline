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
  { speaker: "TU", start: 0.0, end: 10.13, text: "Bo! Đừng đổ nước vo gạo đi con, tưới cho lan là nó lên tốt bất ngờ đó! Bí kíp bà nội chú để lại, nghe xạo mà làm thiệt, giàn lan xanh mướt hà con!" },
  { speaker: "BO", start: 10.48, end: 20.48, text: "Ủa chú Tư? Nước vo gạo đục ngầu vậy mà tưới lan hả chú, con tưởng chú làm biếng đổ nước rửa chén vô gốc lan chớ, cây hổng bị thúi rễ luôn hả chú Tư?" },
  { speaker: "TU", start: 20.83, end: 30.98, text: "Xạo gì con! Nước vo gạo có tinh bột với vitamin nhóm B, tưới gốc là vi sinh trong chậu nó ăn rồi nhả dinh dưỡng lại cho lan. Rẻ tiền mà cây bung chồi con!" },
  { speaker: "BO", start: 31.33, end: 40.11, text: "Trời đất ơi vậy là bao lâu nay con đổ bỏ hết trơn rồi chú, mà chú ơi pha sao mới đúng, chớ con đổ nguyên thau đặc sệt vô là cây có sao hông chú Tư?" },
  { speaker: "TU", start: 40.46, end: 51.57, text: "Đó! Chỗ đó mới quan trọng con. Nước vo gạo lần hai thôi, pha loãng thêm nước lã cỡ nửa nửa, tưới gốc, tuần một lần là đủ. Đặc quá là mốc trắng dụ kiến nghe con!" },
  { speaker: "BO", start: 51.92, end: 62.19, text: "Dạ con nhớ rồi, loãng với tuần một lần. Mà nghe nói vỏ chuối cũng chơi được nữa hả chú, mấy anh trên mạng hay đắp vỏ chuối lên chậu đó, cái đó thiệt hông chú?" },
  { speaker: "TU", start: 62.54, end: 72.67, text: "Vỏ chuối thì tuyệt cho ra bông nghe con, nhưng đừng đắp lên mặt chậu! Băm nhỏ ngâm nước ba bốn ngày rồi lọc lấy nước pha loãng tưới. Nhiều kali là lan sai bông con!" },
  { speaker: "BO", start: 73.02, end: 82.47, text: "Á con hiểu rồi! Nước vo gạo lần hai cho cây tốt lá, còn nước ngâm vỏ chuối lọc kỹ cho sai bông. Mà hai cái này thay luôn phân bón được hông hả chú Tư?" },
  { speaker: "TU", start: 82.82, end: 93.0, text: "Không nghe con! Đồ nhà chỉ bồi bổ thêm thôi, phân chính vẫn phải bón đủ. Coi nó như chén canh dặm bữa, chớ hổng phải bữa cơm. Nhớ vậy là giàn êm con!" },
  { speaker: "BO", start: 93.35, end: 103.77, text: "Hi hi! Nhà mình có ai tưới nước vo gạo cho lan chưa, thử rồi comment kể chú Tư nghe coi cây có lên nổi hông nha, chú chờ nghe kết quả của cả nhà đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 40.9, vol: 0.55 },     // cau 5: cong thuc pha loang (payoff 1)
  { src: "sfx/ting.wav", at: 62.98, vol: 0.5 },     // cau 7: bi kip vo chuoi (payoff 2)
  { src: "sfx/shutter.wav", at: 82.82, vol: 0.45 }, // cau 9: chot canh bao
];

export const HAILA32_TOTAL_FRAMES = 3120;

export const HaiLaComedy32: React.FC = () => {
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
          src={staticFile("audio_haila32/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila32/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
