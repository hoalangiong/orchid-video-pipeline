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
  { speaker: "TU", start: 0.0, end: 10.03, text: "Khoan! Bỏ kéo xuống con! Lá lan vàng mà mày cắt bậy là giết luôn cả cây đó, chín người thấy lá vàng là xúm vô cắt, sai lầm chết cây từ đó mà ra con!" },
  { speaker: "BO", start: 10.38, end: 20.38, text: "Ủa chú Tư? Con thấy lá vàng xấu quắc, tưởng nó hư nên tính cắt cho gọn giàn, chớ để vậy nó lây vàng qua lá khác thì sao, mà cắt là sai hả chú?" },
  { speaker: "TU", start: 20.73, end: 30.64, text: "Từ từ con! Lá vàng phải coi vàng kiểu gì. Lá già dưới gốc vàng đều rồi tự rụng là chuyện thường, cây rút chất nuôi thân, mày cắt chi cho mất sức nó!" },
  { speaker: "BO", start: 30.99, end: 40.99, text: "À vậy lá già vàng tự nhiên thì cứ để nó hả chú? Vậy chớ khi nào con mới thật sự cần cắt, kiểu lá vàng làm sao thì mới là bệnh cần xử hả chú Tư?" },
  { speaker: "TU", start: 41.34, end: 51.52, text: "Nghe nè! Vàng loang lổ, có đốm đen nâu, vàng từ ngọn xuống hay vàng cả loạt lá non, đó mới là bệnh hay thiếu chất. Lúc đó mới cắt, mà phải cắt đúng cách!" },
  { speaker: "BO", start: 51.87, end: 62.63, text: "Á con hiểu rồi! Vàng đều lá già thì để yên, còn vàng đốm vàng lá non mới lo. Vậy cắt đúng cách là sao, con lấy kéo cắt ngang là được hay phải làm gì thêm hả chú?" },
  { speaker: "TU", start: 62.98, end: 73.16, text: "Kéo phải khử trùng, hơ lửa hoặc lau cồn, cắt chừa lại chút đừng sát nách lá, rồi bôi vôi hay keo liền da vô vết cắt. Cắt kéo dơ là rước nấm vô cây liền con!" },
  { speaker: "BO", start: 73.51, end: 83.2, text: "Hèn chi hồi đó con vơ đại cây kéo cắt hết lá vàng, bảo sao cây càng ngày càng suy. Vậy là để lá già yên, chỉ cắt lá bệnh bằng kéo sạch đúng hông chú Tư!" },
  { speaker: "TU", start: 83.55, end: 93.15, text: "Chuẩn con! Nhớ nè: lá vàng đừng vội cắt, coi kỹ già hay bệnh đã. Già thì để nó tự rụng, bệnh mới cắt bằng kéo khử trùng, cây khỏe re hổng suy con!" },
  { speaker: "BO", start: 93.5, end: 104.39, text: "Hi hi! Còn lan nhà mình đang vàng lá kiểu nào, vàng đều hay vàng đốm, comment tả cho chú Tư với con nghe thử coi nên cắt hay nên để, con rep từng người luôn nha!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/snip.wav", at: 62.98, vol: 0.6 },     // cau 7: cat dung cach (payoff)
  { src: "sfx/ting.wav", at: 64.5, vol: 0.5 },      // boi voi/keo
  { src: "sfx/shutter.wav", at: 83.55, vol: 0.45 }, // cau 9: chot recap
];

export const HAILA28_TOTAL_FRAMES = 3145;

export const HaiLaComedy28: React.FC = () => {
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
          src={staticFile("audio_haila28/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila28/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
