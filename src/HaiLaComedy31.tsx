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
  { speaker: "TU", start: 0.0, end: 10.3, text: "Bo! Sáng ra thấy bông lan thủng lỗ chỗ, mất cả cánh như ai cắn dở phải hông? Ốc sên nó bò lên ăn ban đêm đó con, một đêm nó xơi sạch cả cần hoa đẹp luôn!" },
  { speaker: "BO", start: 10.65, end: 19.89, text: "Ủa chú Tư? Con thấy trên chậu có mấy vệt nhớt bóng bóng, bông thì bị gặm nham nhở mà ban ngày kiếm hoài hổng thấy con gì, hóa ra nó ăn đêm hả chú?" },
  { speaker: "TU", start: 20.24, end: 30.52, text: "Đúng nó đó con! Ốc sên với sên trần ban ngày núp dưới chậu, trong giá thể, tối mới bò ra gặm hoa gặm nụ. Thấy vệt nhớt là biết nó, để lỳ là nát hết bông!" },
  { speaker: "BO", start: 30.87, end: 39.9, text: "Trời mấy bông bị gặm nham nhở mất cánh đó con để ráng chưng được hông chú, hay là phải cắt bỏ, mà cắt thì tiếc cả cần hoa gầy công lắm mới có á chú Tư!" },
  { speaker: "TU", start: 40.25, end: 50.74, text: "Cắt bỏ con, đừng tiếc! Lấy kéo sạch cắt hết mấy cần hoa bị gặm nát đi cho gọn, chớ để lại nhìn thảm mà còn dụ ốc tới. Cắt xong mình bắt với đặt bẫy nghe con!" },
  { speaker: "BO", start: 51.09, end: 60.23, text: "Rồi cắt xong đám hoa nát đó, con trị lũ ốc sên còn lại bằng cách nào hả chú, chẳng lẽ tối nào cũng soi đèn đi bắt tay từng con, chú chỉ con cách khỏe hơn đi!" },
  { speaker: "TU", start: 60.58, end: 71.02, text: "Nghe nè! Tối soi đèn bắt vài bữa cho bớt, rồi rải thuốc trừ ốc quanh gốc, hoặc đặt bẫy bia, úp vỏ cam ban đêm nó bu vô mình hốt. Vài bữa là sạch giàn con!" },
  { speaker: "BO", start: 71.37, end: 81.41, text: "Á con hiểu rồi! Cắt bỏ hoa bị gặm trước, rồi bắt tay với rải thuốc trừ ốc, đặt bẫy bia cho gọn. Vậy phòng sao cho tụi ốc khỏi quay lại phá nữa hả chú Tư!" },
  { speaker: "TU", start: 81.76, end: 92.2, text: "Nhớ nè: giàn kê cao ráo, dọn sạch lá mục giá thể vụn dưới gốc, đừng để ẩm thấp um tùm là ổ ốc trú. Sạch sẽ thoáng ráo thì ốc hết chỗ nấp, hoa yên con!" },
  { speaker: "BO", start: 92.55, end: 102.24, text: "Hi hi! Giàn lan nhà mình có bị ốc sên gặm bông ban đêm vầy chưa, thấy hay thì thả tim rồi lưu lại phòng khi cần lôi ra trị nha, cho hoa nở nguyên cánh đẹp đẹp!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/snip.wav", at: 40.55, vol: 0.65 },    // cau 5: cat het can hoa bi gam
  { src: "sfx/ting.wav", at: 60.98, vol: 0.5 },     // cau 7: dat bay/rai thuoc (payoff)
  { src: "sfx/shutter.wav", at: 81.76, vol: 0.45 }, // cau 9: chot recap
];

export const HAILA31_TOTAL_FRAMES = 3090;

export const HaiLaComedy31: React.FC = () => {
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
          src={staticFile("audio_haila31/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila31/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
