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
  { speaker: "TU", start: 0.0, end: 7.49, text: "Ối giời Bo! Mày lấy dao rạch gốc lan để… ép nó đẻ con hả? Rạch bậy là nhiễm trùng chết cả cây đó con!" },
  { speaker: "BO", start: 7.84, end: 14.26, text: "Ủa chú Tư! Con nghe nói muốn ra keiki, ra mầm con thì cứ khứa gốc cho nó bung ra chứ gì!" },
  { speaker: "TU", start: 14.61, end: 22.08, text: "Bậy nào! Kích mầm là bôi keo kích ngay mắt ngủ, giữ ẩm, đủ nắng. Chứ ai đi rạch nát thân cây bao giờ!" },
  { speaker: "BO", start: 22.43, end: 28.44, text: "Á… mắt ngủ là cái gì hả chú? Con tưởng chỗ nào trên thân cũng mọc mầm ra được chứ bộ!" },
  { speaker: "TU", start: 28.79, end: 35.0, text: "Mắt ngủ là mấy cái mấu tròn nằm dọc thân giả hành đó con! Bôi keo đúng mắt thì nó mới bung mầm!" },
  { speaker: "BO", start: 35.35, end: 41.31, text: "Hèn chi… con bôi tùm lum khắp thân mà chả thấy mọc gì, cây còn héo queo đi mới tức chớ!" },
  { speaker: "TU", start: 41.66, end: 48.67, text: "Đó! Với lại canh lúc cây nghỉ, cuối mùa hoa mà kích. Đủ ẩm đủ ấm thì mắt ngủ mới chịu dậy con ơi!" },
  { speaker: "BO", start: 49.02, end: 55.89, text: "Dạ dạ con hiểu rồi! Tìm mắt ngủ, bôi keo đúng chỗ, giữ ẩm, chứ hổng rạch nát cây nữa đâu chú!" },
  { speaker: "TU", start: 56.24, end: 63.05, text: "Ngoan! Nhớ nè: kích mầm như gọi cây thức dậy, gọi nhẹ thì nó dậy, gọi thô là nó… ngủ luôn đó con!" },
  { speaker: "BO", start: 63.4, end: 70.8, text: "Hi hi! Còn các bạn thì sao? Kích mầm lan kiểu gì kể chú Tư với con nghe với nha! Comment liền nào!" },
];

export const HAILA4_TOTAL_FRAMES = 2117;

export const HaiLaComedy4: React.FC = () => {
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
          src={staticFile("audio_haila4/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila4/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
