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
  { speaker: "TU", start: 0.0, end: 6.14, text: "Thôi rồi Bo ơi! Cây lan đang phà phà bông mà mày lôi ra thay chậu là… tiễn nó về trời đó con!" },
  { speaker: "BO", start: 6.49, end: 13.05, text: "Ủa chú Tư! Con thấy chậu chật thì thay cho nó rộng rãi chứ? Đang bông thì mắc gì hông thay được!" },
  { speaker: "TU", start: 13.4, end: 20.29, text: "Đang bông là cấm đụng! Thay chậu là lúc cây tàn hoa, nhú rễ mới. Chứ mày thay ngang là rụng bông sạch!" },
  { speaker: "BO", start: 20.64, end: 26.91, text: "Á… vậy chứ gỡ cây ra sao hả chú? Con toàn nắm gốc giựt một phát cho nó ra luôn cho lẹ!" },
  { speaker: "TU", start: 27.26, end: 34.24, text: "Giựt cái đầu mày! Ngâm nước cho mềm, gỡ nhẹ nhàng. Đứt hết rễ thì lấy gì cây bám mà sống con!" },
  { speaker: "BO", start: 34.59, end: 41.17, text: "Hèn chi… cây nào con thay xong cũng đứng hình cả tháng, lá teo tóp! Con làm thô bạo quá chú ha!" },
  { speaker: "TU", start: 41.52, end: 48.92, text: "Đó! Rễ hư thì cắt bỏ, bôi keo liền sẹo. Giá thể vỏ thông, than củi ngâm sạch, đừng nhét đại nhé con!" },
  { speaker: "BO", start: 49.27, end: 56.61, text: "Dạ dạ con thấm rồi! Từ nay con chờ tàn hoa mới thay, gỡ nhẹ, cắt rễ hư, chứ hổng giựt nữa đâu!" },
  { speaker: "TU", start: 56.96, end: 64.13, text: "Ngoan! Nhớ nè: thay chậu như dời nhà cho cây, làm êm ru thì nó khỏe, làm ẩu là nó… dỗi luôn đó con!" },
  { speaker: "BO", start: 64.48, end: 71.69, text: "Hi hi! Còn các bạn thì sao? Thay chậu kiểu gì kể chú Tư với con nghe với nha! Comment liền nào!" },
];

export const HAILA3_TOTAL_FRAMES = 2144;

export const HaiLaComedy3: React.FC = () => {
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

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("audio_haila3/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila3/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
