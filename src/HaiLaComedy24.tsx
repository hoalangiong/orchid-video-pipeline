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
  { speaker: "TU", start: 0.0, end: 7.97, text: "Bo ơi! Còn hai tháng nữa Tết mà giàn lan mày cứ xanh lè hổng thấy nụ, hổng canh từ giờ là Tết trơ lá đứng ngó cho coi con!" },
  { speaker: "BO", start: 8.32, end: 17.28, text: "Ủa chú Tư! Con cứ tưới với bón đều đều là tới Tết nó tự nở chớ, mắc gì phải canh với ép cho cực vậy hả chú, để tự nhiên đi!" },
  { speaker: "TU", start: 17.63, end: 26.39, text: "Bậy nào! Lan hổng tự canh ngày Tết cho mình đâu con. Muốn nở đúng Tết thì phải xử lý từ giờ, canh phân canh nước canh nhiệt mới kịp!" },
  { speaker: "BO", start: 26.74, end: 36.17, text: "Á… vậy chớ làm sao ép cho nó nở đúng Tết hả chú? Con thấy khó dữ, lỡ ép sớm nở trước, ép trễ thì Tết chưa bung nụ hả trời!" },
  { speaker: "TU", start: 36.52, end: 45.4, text: "Nghe nè! Cỡ này ngưng đạm lại, chuyển qua phân lân kali cao, loại ba mươi mấy phần lân đó, để cây già giả hạc, dồn sức làm nụ con!" },
  { speaker: "BO", start: 45.75, end: 54.03, text: "Hèn chi… con quất đạm tới giờ, cây cứ ra lá hoài hổng chịu ra nụ, thì ra phải cắt đạm tăng lân kali cho nó chuyển giai đoạn hả chú!" },
  { speaker: "TU", start: 54.38, end: 63.33, text: "Đúng đó! Rồi giảm nước cho hơi khô, chênh lạnh đêm ngày để kích nụ. Thấy nhú mắt hoa thì tính ngược, canh tưới ấm lại cho nở đúng Tết con!" },
  { speaker: "BO", start: 63.68, end: 71.52, text: "Trời đất… vậy là ngưng đạm tăng lân kali, siết nước cho chênh lạnh kích nụ, thấy mắt hoa thì canh ngược ngày cho nở đúng Tết hả chú!" },
  { speaker: "TU", start: 71.87, end: 81.04, text: "Ngoan! Nhớ nè: muốn lan nở đúng Tết là phải canh từ hai ba tháng trước, lân kali với siết nước là chìa khóa. Để trễ là hết kịp con nghe chưa!" },
  { speaker: "BO", start: 81.39, end: 90.66, text: "Hi hi! Còn các bạn thì sao? Tết này nhà mình định cho dòng lan nào bung nụ khoe sắc? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA24_TOTAL_FRAMES = 2720;

export const HaiLaComedy24: React.FC = () => {
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
          src={staticFile("audio_haila24/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila24/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
