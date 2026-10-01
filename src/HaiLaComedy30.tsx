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
  { speaker: "TU", start: 0.0, end: 10.06, text: "Bo! Cần hoa lan mày đang căng nụ mà tự nhiên nụ thui đen rụng lả tả phải hông? Rệp sáp với nhện đỏ nó bu hút đó con, để lỳ là mất trắng cả cần hoa luôn!" },
  { speaker: "BO", start: 10.41, end: 20.54, text: "Ủa chú Tư? Con thấy nách nụ có mấy cục trắng trắng như bông gòn, lá thì lấm tấm chấm đỏ li ti, con tưởng bụi bám chớ, hóa ra là rệp với nhện đỏ hả chú?" },
  { speaker: "TU", start: 20.89, end: 30.8, text: "Đúng nó đó con! Cục trắng như phấn là rệp sáp, chấm đỏ li ti mặt lá là nhện đỏ, tụi nó chích hút nhựa làm nụ teo thui, không trị là hư hết cả cần bông!" },
  { speaker: "BO", start: 31.15, end: 39.7, text: "Trời mấy cái nụ teo thui đen thui đó con để ráng chờ nó nở lại được hông chú, hay là phải lặt bỏ, mà bỏ thì tiếc đứt ruột luôn á chú Tư ơi!" },
  { speaker: "TU", start: 40.05, end: 50.63, text: "Bỏ đi con, đừng tiếc! Lấy kéo sạch cắt bỏ hết mấy cần nụ thui teo đó, để lại chỉ tổ nuôi rệp thôi. Cắt gọn xong mình trị con rệp con nhện mới sạch được nghe!" },
  { speaker: "BO", start: 50.98, end: 59.5, text: "Rồi cắt xong đám nụ hư đó con diệt tụi rệp nhện còn lại bằng gì hả chú, lau tay từng con chắc tới tết, chú chỉ con thuốc nào xịt cho lẹ với đi!" },
  { speaker: "TU", start: 59.85, end: 69.93, text: "Xịt thuốc con! Rệp sáp thì pha dầu khoáng với thuốc rệp xịt ngập nách lá, nhện đỏ thì dùng thuốc trừ nhện riêng, xịt lại sau năm bảy bữa cho sạch lứa trứng con!" },
  { speaker: "BO", start: 70.28, end: 80.75, text: "Á con hiểu rồi! Cắt bỏ nụ thui trước, rồi xịt dầu khoáng trị rệp, thuốc riêng trị nhện, xịt nhắc lại cho sạch trứng. Vậy phòng sao cho lứa sau khỏi bị hả chú!" },
  { speaker: "TU", start: 81.1, end: 91.23, text: "Nhớ nè: giàn thoáng mát, đừng để bụi bám khô hạn là tụi nó khoái. Năng soi mặt dưới lá, thấy đốm là xử liền, đừng đợi nó bu thành ổ mới trị thì trễ con!" },
  { speaker: "BO", start: 91.58, end: 101.95, text: "Hi hi! Giàn lan nhà mình có bị nụ thui với chấm đỏ vầy chưa, lưu video lại phòng khi cần mà lôi ra làm theo nha, rồi tag đứa bạn mê lan vô coi với cho vui!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/snip.wav", at: 40.35, vol: 0.65 },    // cau 5: cat het can nu thui
  { src: "sfx/ting.wav", at: 60.25, vol: 0.5 },     // cau 7: xit thuoc (payoff)
  { src: "sfx/shutter.wav", at: 81.1, vol: 0.45 },  // cau 9: chot recap
];

export const HAILA30_TOTAL_FRAMES = 3080;

export const HaiLaComedy30: React.FC = () => {
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
          src={staticFile("audio_haila30/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila30/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
