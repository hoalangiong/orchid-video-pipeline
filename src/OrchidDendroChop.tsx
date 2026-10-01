import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Series,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 4px 24px rgba(0,0,0,0.95)";

const SCENES = {
  title: 216,
  s1: 210,
  s2: 210,
  twist: 258,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

const MotionBG: React.FC<{ src: string; dark?: number }> = ({ src, dark = 0.55 }) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={src}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(4,6,12,0.35) 0%, rgba(4,6,12,0.1) 45%, rgba(4,6,12,${dark}) 100%)`,
      }}
    />
  </AbsoluteFill>
);

const SceneFade: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 14, duration - 14, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const CineCaption: React.FC<{ text: string; color?: string }> = ({
  text,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [8, 26], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 240px" }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 54,
          fontWeight: 800,
          color,
          textAlign: "center",
          lineHeight: 1.35,
          textShadow,
          opacity: op,
          transform: `translateY(${y}px)`,
          maxWidth: 900,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hookOp = interpolate(frame, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 130 } });
  const subOp = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_dendrochop/title.mp4")} dark={0.62} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 24 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 66,
            fontWeight: 900,
            color: "#ff8ac2",
            textAlign: "center",
            lineHeight: 1.15,
            textShadow,
            opacity: hookOp,
            transform: `scale(${0.9 + pop * 0.1})`,
          }}
        >
          Có một giò lan...{"\n"}khiến tôi mất ăn mất ngủ
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            opacity: subOp,
          }}
        >
          Ngày nào tôi cũng ra vườn ngó nó 😍
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  const cta = interpolate(frame, [155, 190], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_dendrochop/twist.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 220px", gap: 28 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 900,
            color: "#ffd36e",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 900,
          }}
        >
          Chùm hoa nở kín cả giò{"\n"}công tôi đợi cả năm trời 🌺
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 40,
            color: "#ffe8f0",
            textShadow,
            textAlign: "center",
            opacity: cta,
          }}
        >
          Bạn đang mê giống lan nào nhất? Comment tên cho tôi biết 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STORY = [
  { clip: "clips_dendrochop/s1.mp4", vo: "audio_dendrochop/vo_s1.mp3", dur: SCENES.s1, cap: "Nó chỉ ra hoa một lần một năm, mà lần nào cũng chờ như lần đầu.", color: "#ffffff" },
  { clip: "clips_dendrochop/s2.mp4", vo: "audio_dendrochop/vo_s2.mp3", dur: SCENES.s2, cap: "Có bữa nắng gắt, tôi bỏ ăn trưa để che lưới cho nó.", color: "#ffd24a" },
];

export const DENDROCHOP_TOTAL_FRAMES = TOTAL;

export const OrchidDendroChop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <HookScene />
          </SceneFade>
          <Audio src={staticFile("audio_dendrochop/vo_title.mp3")} />
        </Series.Sequence>

        {STORY.map((s, i) => (
          <Series.Sequence key={i} durationInFrames={s.dur}>
            <SceneFade duration={s.dur}>
              <MotionBG src={staticFile(s.clip)} />
              <CineCaption text={s.cap} color={s.color} />
            </SceneFade>
            <Audio src={staticFile(s.vo)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={SCENES.twist}>
          <SceneFade duration={SCENES.twist}>
            <TwistScene />
          </SceneFade>
          <Audio src={staticFile("audio_dendrochop/vo_twist.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
