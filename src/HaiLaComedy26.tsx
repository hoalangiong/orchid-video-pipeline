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
  { speaker: "TU", start: 0.0, end: 8.45, text: "Bo! Chín người trồng lan thì hết tám người dính lỗi này, nuôi cả năm tốn tiền tốn công mà lan trơ lá hổng nổi một bông, đau chưa con!" },
  { speaker: "BO", start: 8.8, end: 18.44, text: "Ủa chú Tư? Con tưới đều bón đều, lá xanh mướt mượt luôn mà, sao nó cứ đâm lá hoài hổng chịu ra bông là sao vậy chú, con chịu thua rồi!" },
  { speaker: "TU", start: 18.79, end: 27.57, text: "Đó! Lá xanh mướt mà hổng bông là mày bón dư đạm rồi con. Đạm nhiều cây lo đâm lá mập thân, chớ nó đâu thèm làm nụ ra hoa cho mày!" },
  { speaker: "BO", start: 27.92, end: 36.59, text: "Trời… vậy là con thương nó quá, quất đạm quài thành ra hại nó hả chú? Vậy chớ muốn nó ra bông con phải đổi qua phân gì bây giờ hả chú Tư?" },
  { speaker: "TU", start: 36.94, end: 46.18, text: "Nghe nè! Cắt đạm lại, chơi lân kali cao vô, loại lân sáu bảy chục phần đó, đánh vài cữ cho cây già đanh lại, nó mới chịu làm mầm hoa con!" },
  { speaker: "BO", start: 46.53, end: 55.96, text: "Á con hiểu rồi! Ngưng đạm, tăng lân kali cao cho cây già đanh thì mới ra nụ. Mà chỉ đổi phân vậy là đủ hay còn thiếu gì nữa hả chú Tư?" },
  { speaker: "TU", start: 56.31, end: 65.48, text: "Còn nữa! Phải cho ăn nắng đủ, sáng nắng chiều rợp, rồi siết nước cho hơi khô, chênh lạnh chút. Cây bị sốc nhẹ vậy mới bung nụ đồng loạt con!" },
  { speaker: "BO", start: 65.83, end: 75.55, text: "Hèn chi con để nó chỗ rợp mát quài, tưới đẫm quài, bảo sao nó ỷ y hổng ra bông. Vậy là nắng đủ, siết nước, chênh lạnh mới kích nụ hả chú!" },
  { speaker: "TU", start: 75.9, end: 85.33, text: "Chuẩn con! Nhớ nè: lan hổng ra bông chín phần là dư đạm với thiếu nắng. Cắt đạm, tăng lân kali, cho ăn nắng siết nước, bông bung đầy giàn con!" },
  { speaker: "BO", start: 85.68, end: 96.89, text: "Hi hi! Bạn nào đang có giò lan nuôi mãi trơ lá thì lưu ngay video này lại mà làm theo nha, rồi tag giùm con cái đứa suốt ngày khoe lan mà chẳng thấy bông nào, cho nó tỉnh ngộ với!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 36.94, vol: 0.55 },    // cau 5: giai phap lan kali (payoff)
  { src: "sfx/pot.wav", at: 38.3, vol: 0.5 },       // danh phan/dat chau
  { src: "sfx/ting.wav", at: 56.31, vol: 0.55 },    // cau 7: nang/siet nuoc (payoff)
  { src: "sfx/shutter.wav", at: 75.9, vol: 0.45 },  // cau 9: chot recap
];

export const HAILA26_TOTAL_FRAMES = 2915;

export const HaiLaComedy26: React.FC = () => {
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
          src={staticFile("audio_haila26/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila26/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
