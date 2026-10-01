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
  { speaker: "TU", start: 0.0, end: 7.1, text: "Bo ơi! Mày trồng giả hạc vô đất thịt bít bùng vầy thì úng rễ chết cây, lan nó có phải cây rau đâu con ơi!" },
  { speaker: "BO", start: 7.45, end: 15.42, text: "Ủa chú Tư! Đất càng nhiều dinh dưỡng cây càng mập chớ, con nhét đất vườn vô cho nó bổ, mắc gì phải mua giá thể hả chú!" },
  { speaker: "TU", start: 15.77, end: 24.51, text: "Bậy nào! Rễ lan cần thoáng, phải bám vô vỏ thông, than, dớn, viên đất nung. Đất thịt giữ nước là nó thúi rễ đen thui liền!" },
  { speaker: "BO", start: 24.86, end: 32.22, text: "Á… vậy chớ giá thể trồng lan gồm mấy thứ hả chú? Con nghe than với vỏ thông mà hổng biết trộn làm sao cho đúng!" },
  { speaker: "TU", start: 32.57, end: 40.33, text: "Trời đất! Vỏ thông với than cục làm nền cho thoáng, thêm ít dớn giữ ẩm, dưới đáy chậu lót than to cho thoát nước con!" },
  { speaker: "BO", start: 40.68, end: 47.78, text: "Hèn chi… chậu con nhồi đất với xơ dừa mịn rịt, tưới xong sũng cả tuần, thảo nào rễ đen thui hoa chẳng thấy hà chú!" },
  { speaker: "TU", start: 48.13, end: 56.12, text: "Đúng rồi đó! Xơ dừa mịn giữ nước nhiều quá cũng thúi. Giá thể phải rửa sạch, ngâm cho hết chát rồi mới trồng nghen con!" },
  { speaker: "BO", start: 56.47, end: 64.1, text: "Dạ dạ con hiểu rồi! Trồng bằng vỏ thông than dớn cho thoáng, lót đáy than to, chớ hổng nhét đất thịt bít bùng nữa đâu chú!" },
  { speaker: "TU", start: 64.45, end: 72.39, text: "Ngoan! Nhớ nè: giá thể tốt là giá thể thoáng mà giữ ẩm vừa. Rễ thở được thì cây khỏe, bít quá là toi cả giò con!" },
  { speaker: "BO", start: 72.74, end: 82.96, text: "Hi hi! Còn các bạn thì sao? Nhà mình hay trồng lan bằng giá thể gì, vỏ thông hay than dớn? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA13_TOTAL_FRAMES = 2489;

export const HaiLaComedy13: React.FC = () => {
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
          src={staticFile("audio_haila13/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila13/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
