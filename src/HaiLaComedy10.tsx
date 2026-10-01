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
  { speaker: "TU", start: 0.0, end: 7.18, text: "Bo ơi Bo! Lá lan mày lốm đốm đen vàng tùm lum vầy mà cứ để kệ, nấm nó ăn lan cả giàn bây giờ con ơi!" },
  { speaker: "BO", start: 7.53, end: 15.15, text: "Ủa chú Tư, đốm nhỏ xíu hà, có gì đâu! Để vài bữa nó tự hết, mắc gì phải xịt thuốc cho tốn tiền hả chú!" },
  { speaker: "TU", start: 15.5, end: 23.21, text: "Bậy nào! Nấm với khuẩn nó lây nhanh lắm con. Thấy đốm là phải cắt bỏ lá bệnh liền, rồi xịt phòng cả giàn mới yên!" },
  { speaker: "BO", start: 23.56, end: 30.48, text: "Á… vậy chớ phòng làm sao hả chú? Con tưởng cây nào bệnh mới xịt cây đó, cây khỏe thì thôi khỏi đụng tới!" },
  { speaker: "TU", start: 30.83, end: 38.63, text: "Trời đất! Phòng bệnh hơn chữa bệnh con. Nửa tháng xịt phòng nấm khuẩn một lần, để giàn thông thoáng, đừng để ẩm bí!" },
  { speaker: "BO", start: 38.98, end: 45.72, text: "Hèn chi… giàn con treo khít rịt, tưới xong nước đọng cả ngày, thảo nào cây nào cũng đốm lá thúi ngọn hà chú!" },
  { speaker: "TU", start: 46.07, end: 53.8, text: "Đúng rồi đó! Treo thưa ra cho gió lùa, cắt lá bệnh thì khử trùng kéo, gom lá rụng đốt đi chớ đừng để dưới gốc con!" },
  { speaker: "BO", start: 54.15, end: 61.62, text: "Dạ dạ con hiểu rồi! Thấy đốm cắt liền, xịt phòng nửa tháng một lần, treo thưa cho thoáng chớ hổng để bệnh lây nữa đâu chú!" },
  { speaker: "TU", start: 61.97, end: 69.72, text: "Ngoan! Nhớ nè: chăm lan là phòng từ xa, giàn thoáng cây khỏe thì nấm khuẩn hết cửa. Để bệnh rồi mới cứu là trễ con!" },
  { speaker: "BO", start: 70.07, end: 79.89, text: "Hi hi! Còn các bạn thì sao? Nhà mình hay bị nấm đốm lá không, xịt phòng bằng thuốc gì? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA10_TOTAL_FRAMES = 2397;

export const HaiLaComedy10: React.FC = () => {
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

  // --- KARAOKE: chia câu thành cụm ~2 hàng, giọng đọc tới từ nào sáng từ đó ---
  const CHUNK_CHARS = 40; // ~2 hàng ở fontSize 54
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
          src={staticFile("audio_haila10/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila10/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
