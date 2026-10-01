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

// Timeline: mỗi câu bắt đầu tại t giây (đã tính từ độ dài mp3 + 0.35s lặng giữa lượt)
type Line = { speaker: "TU" | "BO"; start: number; end: number; text: string };

const LINES: Line[] = [
  { speaker: "TU", start: 0.0, end: 3.77, text: "Ối giời ơi Bo! Lan mà mày tưới ngày ba lần thì có mà đi đời nhà ma con ơi!" },
  { speaker: "BO", start: 4.12, end: 10.28, text: "Ơ hay chú Tư! Cây nào chả cần nước? Con thấy khô khô là con tưới cho nó đã đời luôn!" },
  { speaker: "TU", start: 10.63, end: 14.23, text: "Đã đời cái đầu mày! Lan là dân chơi, chứ có phải rau muống đâu mà tưới ào ào!" },
  { speaker: "BO", start: 14.58, end: 19.47, text: "Ủa vậy chứ chú tưới sao? Một tháng một lần cho nó… khát chơi hả chú?" },
  { speaker: "TU", start: 19.82, end: 25.31, text: "Bậy nào! Thò tay sờ giá thể, khô mới tưới. Rễ lan nó cần thở, úng nước là thối nhũn nhé con!" },
  { speaker: "BO", start: 25.66, end: 32.38, text: "Á à… hèn chi mấy chậu của con lá vàng khè, rễ đen thui! Con tưới y như tưới lúa ngoài đồng!" },
  { speaker: "TU", start: 32.73, end: 37.02, text: "Đó! Giờ mới sáng mắt ra. Tưới lan là tưới cái đầu, chứ không phải tưới cái tay đâu con!" },
  { speaker: "BO", start: 37.37, end: 43.25, text: "Dạ dạ con thấm rồi chú ơi! Từ nay con sờ khô mới tưới, khỏi giết lan oan uổng!" },
  { speaker: "TU", start: 43.6, end: 47.42, text: "Ngoan! Chăm lan như chăm người yêu ấy, thiếu thì nhớ, mà thừa một tí là… ngộp thở luôn!" },
  { speaker: "BO", start: 47.77, end: 54.14, text: "Hi hi! Còn các bạn thì sao? Tưới nhiều hay tưới ít? Comment cho chú Tư với con biết nhé!" },
];

export const HAILA_TOTAL_FRAMES = Math.ceil(53.90 * FPS);

const CHARS = {
  TU: { name: "CHÚ TƯ", emoji: "👴", color: "#ffcf5c", side: "left" as const },
  BO: { name: "THẰNG BO", emoji: "🧑", color: "#7ad1ff", side: "right" as const },
};

export const HaiLaComedy: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Giữ câu đang nói; trong khoảng lặng giữa 2 câu vẫn giữ câu VỪA nói (không nhảy về câu cuối)
  const idx = (() => {
    let found = 0;
    for (let i = 0; i < LINES.length; i++) {
      if (t >= LINES[i].start) found = i;
    }
    return found;
  })();
  const cur = LINES[idx];
  const ch = CHARS[cur.speaker];

  // pop khi đổi câu (chỉ trong 0.25s đầu mỗi câu)
  const localT = t - cur.start;
  const pop = interpolate(localT, [0, 0.25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ken Burns nhẹ cho nền
  const bgScale = interpolate(t, [0, 55.24], [1.05, 1.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("audio_haila/bg_light.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${bgScale})` }}
        />
      </AbsoluteFill>
      {/* lớp phủ tối nhẹ cho chữ nổi */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Tên nhân vật đang nói */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: ch.side === "left" ? "flex-start" : "flex-end",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 900,
            color: "#1a1204",
            background: ch.color,
            padding: "16px 40px",
            borderRadius: 22,
            boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
            transform: `scale(${pop})`,
            border: "4px solid rgba(255,255,255,0.85)",
          }}
        >
          {ch.emoji} {ch.name}
        </div>
      </div>

      {/* Caption thoại */}
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
            fontSize: 66,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.32,
            textShadow: "0 3px 18px rgba(0,0,0,0.95)",
            background: "rgba(0,0,0,0.55)",
            padding: "28px 34px",
            borderRadius: 26,
            transform: `scale(${pop})`,
          }}
        >
          {cur.text}
        </div>
      </div>

      <Audio src={staticFile("audio_haila/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
