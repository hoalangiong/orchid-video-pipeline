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
  { speaker: "TU", start: 0.0, end: 10.2, text: "Bo! Bông lan mày đang đẹp mà tự nhiên rỗ lấm tấm, cánh bạc trắng méo xẹo phải hông? Bọ trĩ nó chích đó con, để lỳ vài bữa là nát sạch cả cần hoa luôn!" },
  { speaker: "BO", start: 10.55, end: 20.74, text: "Ủa chú Tư? Con thấy trên cánh có mấy vệt bạc bạc như trầy, lật xuống có con li ti chạy lẹ, con tưởng nắng làm phai màu chớ, hóa ra là bọ trĩ hả chú?" },
  { speaker: "TU", start: 21.09, end: 31.36, text: "Đúng nó đó con! Bọ trĩ nhỏ xíu núp trong cánh với nụ, chích hút cho hoa rỗ sẹo, méo mó. Bông nào rỗ nát rồi thì hết cứu, để đó nó còn lây qua bông khác!" },
  { speaker: "BO", start: 31.71, end: 39.91, text: "Trời vậy mấy bông rỗ nát đó con phải làm sao chú, tiếc quá tính để ráng coi được bữa nào hay bữa đó, hay là cắt bỏ luôn cho rồi hả chú Tư ơi?" },
  { speaker: "TU", start: 40.26, end: 50.65, text: "Cắt bỏ liền con! Lấy kéo sạch cắt hết mấy cần hoa rỗ nát đi, đừng tiếc, để lại là ổ cho bọ trĩ trú. Cắt gọn xong mình mới trị dứt điểm được nghe con!" },
  { speaker: "BO", start: 51.0, end: 60.12, text: "Rồi cắt xong đám hoa hư đó, con xử con bọ trĩ còn lại bằng gì hả chú, xịt nước rửa chén hay phải mua thuốc riêng cho nó, chú chỉ con loại nào hay đi!" },
  { speaker: "TU", start: 60.47, end: 70.72, text: "Phải xịt thuốc con! Dùng loại như Ra đian, hoặc Con phi đo, xịt kỹ mặt dưới cánh với nách lá, ba bữa xịt lại một lần, xịt đủ ba cữ mới sạch trứng nó con!" },
  { speaker: "BO", start: 71.07, end: 80.79, text: "Á con hiểu rồi! Cắt bỏ hoa rỗ nát trước, rồi xịt thuốc ba cữ cách vài bữa cho sạch trứng. Vậy phòng cho lứa hoa sau khỏi bị nữa thì con làm gì hả chú Tư!" },
  { speaker: "TU", start: 81.14, end: 91.36, text: "Nhớ nè: giàn thoáng, đừng để khô nóng bí gió là bọ trĩ khoái. Lúc lan nhú nụ là canh xịt phòng một cữ, treo bẫy dính vàng nữa, hoa nở đẹp không lo rỗ con!" },
  { speaker: "BO", start: 91.71, end: 101.85, text: "Hi hi! Bông lan nhà mình có bị rỗ cánh bạc trắng giống vầy chưa, thấy hữu ích thì chia sẻ cho hội chơi lan cùng biết đường trị với nha, kẻo mất mùa hoa uổng lắm đó!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/snip.wav", at: 40.55, vol: 0.65 },    // cau 5: cat het can hoa ro nat
  { src: "sfx/ting.wav", at: 60.9, vol: 0.5 },      // cau 7: xit thuoc (payoff)
  { src: "sfx/shutter.wav", at: 81.14, vol: 0.45 }, // cau 9: chot recap
];

export const HAILA29_TOTAL_FRAMES = 3075;

export const HaiLaComedy29: React.FC = () => {
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
          src={staticFile("audio_haila29/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila29/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
