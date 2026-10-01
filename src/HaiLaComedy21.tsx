import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const FPS = 30;

type Line = { speaker: "TU" | "BO"; start: number; end: number; text: string };

const LINES: Line[] = [
  { speaker: "TU", start: 0.0, end: 7.85, text: "Bo ơi! Nước vo gạo mày đổ ào ào vô gốc lan đó hả con? Trời ơi tốt bụng mà làm bậy là thúi rễ cả giò cho coi!" },
  { speaker: "BO", start: 8.2, end: 17.47, text: "Ủa chú Tư! Người ta đồn nước vo gạo bổ lắm, nhiều vitamin, con tưới cho lan mập, sai chỗ nào đâu mà chú la con dữ vậy!" },
  { speaker: "TU", start: 17.82, end: 25.98, text: "Đó! Nước vo gạo tươi đổ thẳng vô là sai. Nó chưa lên men, tưới vô lên mốc chua gốc, ruồi bu kiến đậu, thúi rễ như chơi con!" },
  { speaker: "BO", start: 26.33, end: 34.66, text: "Á… vậy chớ muốn xài nước vo gạo cho đúng thì phải làm sao hả chú? Chẳng lẽ bỏ uổng, nghe nói bổ mà giờ hổng dám xài!" },
  { speaker: "TU", start: 35.01, end: 43.15, text: "Phải ủ con! Nước vo gạo đổ vô chai, thêm chút đường với men, đậy hờ ủ bảy tới mười ngày cho lên men hết chua rồi mới xài!" },
  { speaker: "BO", start: 43.5, end: 51.86, text: "Hèn chi… con đổ tươi vô, mấy bữa gốc bốc mùi chua lè, rễ đen thui, thảo nào cây héo dần thúi luôn cả giò hà chú ơi!" },
  { speaker: "TU", start: 52.21, end: 60.47, text: "Đúng đó! Ủ xong pha thiệt loãng, một phần nước gạo mười phần nước lã, phun lên lá tưới nhẹ gốc thôi, tuần một lần là đủ con!" },
  { speaker: "BO", start: 60.82, end: 68.47, text: "Trời đất… vậy là phải ủ cho lên men, pha loãng thiệt loãng, tuần tưới một lần, chớ hổng phải đổ ào ào như con làm hả chú!" },
  { speaker: "TU", start: 68.82, end: 76.98, text: "Ngoan! Nhớ nè: nước gạo chưa ủ là thuốc độc, ủ rồi pha loãng mới là phân. Làm đúng thì lan xanh mướt, tiếc của mà hại cây con!" },
  { speaker: "BO", start: 77.33, end: 87.52, text: "Hi hi! Còn các bạn thì sao? Nhà mình có ai tưới nước vo gạo cho lan chưa, ủ hay tưới tươi? Kể chú Tư với con nghe nha, comment liền nào!" },
];

export const HAILA21_TOTAL_FRAMES = 2626;

export const HaiLaComedy21: React.FC = () => {
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
          src={staticFile("audio_haila21/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila21/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
