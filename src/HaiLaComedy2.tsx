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
  { speaker: "TU", start: 0.0, end: 6.84, text: "Trời đất ơi Bo! Mày đổ nguyên bịch phân vào một chậu lan thì có mà thành… lan nướng con ơi!" },
  { speaker: "BO", start: 7.19, end: 13.36, text: "Ủa chú Tư! Phân nhiều thì cây mới mau lớn chứ? Con bón cho nó bung đọt ào ào luôn nè!" },
  { speaker: "TU", start: 13.71, end: 21.31, text: "Ào ào cái đầu mày! Bón đậm quá là cháy rễ, cây đứng hình, lá vàng rụng sạch nhé con!" },
  { speaker: "BO", start: 21.66, end: 27.69, text: "Á… vậy chứ bón sao cho đúng hả chú? Chẳng lẽ để nó ăn… gió sống qua ngày hả?" },
  { speaker: "TU", start: 28.04, end: 36.56, text: "Bậy nào! Bón loãng thôi, một phần phân mười phần nước. Phun sương nhè nhẹ, tuần một lần là đủ!" },
  { speaker: "BO", start: 36.91, end: 43.26, text: "Hèn chi… mấy chậu con lá cháy mép, rễ đen thui! Con bón đậm y như ướp thịt nướng chú ơi!" },
  { speaker: "TU", start: 43.61, end: 51.18, text: "Đó! Với lại cây đang lớn, đang ra đọt mới bón. Chứ nó ngủ nghỉ mà mày nhồi phân là toi!" },
  { speaker: "BO", start: 51.53, end: 57.39, text: "Dạ dạ con thấm rồi! Từ nay con bón loãng, đúng lúc, khỏi biến lan thành món nướng nữa!" },
  { speaker: "TU", start: 57.74, end: 65.26, text: "Ngoan! Nhớ nè: bón ít mà đều, còn hơn bón nhiều một phát… tiễn cây đi luôn đó con!" },
  { speaker: "BO", start: 65.61, end: 72.84, text: "Hi hi! Còn các bạn thì sao? Bón phân kiểu gì kể chú Tư với con nghe với nha! Comment liền nào!" },
];

export const HAILA2_TOTAL_FRAMES = Math.ceil(72.60 * FPS);

const CHARS = {
  TU: { name: "CHÚ TƯ", color: "#ffcf5c", side: "left" as const },
  BO: { name: "THẰNG BO", color: "#7ad1ff", side: "right" as const },
};

export const HaiLaComedy2: React.FC = () => {
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
          src={staticFile("audio_haila2/bg_light.mp4")}
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
          {ch.name}
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

      <Audio src={staticFile("audio_haila2/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
