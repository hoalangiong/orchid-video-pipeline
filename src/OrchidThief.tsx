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
  s1: 204,
  s2: 186,
  s3: 189,
  twist: 231,
  outro: 246,
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
          fontSize: 56,
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

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const subOp = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_sieutrom/title.mp4")} dark={0.62} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 26 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.08,
            letterSpacing: 1,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          SIÊU TRỘM VƯỜN LAN{"\n"}LÚC NỬA ĐÊM
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            fontWeight: 700,
            color: "#ff9a9a",
            textShadow,
            textAlign: "center",
            opacity: subOp,
          }}
        >
          Ai là kẻ phá vườn lan mỗi đêm? 🔦
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_sieutrom/twist.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 240px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 900,
            color: "#ffe14a",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 900,
          }}
        >
          Thủ phạm là...{"\n"}MỘT CON ỐC SÊN 🐌😂
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const cta = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_sieutrom/outro.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 220px", gap: 28 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 62,
            fontWeight: 900,
            color: "#8ef58e",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 900,
          }}
        >
          Rải thuốc trừ ốc sên,{"\n"}vườn lan an toàn! 🌿
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 42,
            color: "#ffe8f0",
            textShadow,
            textAlign: "center",
            opacity: cta,
          }}
        >
          Theo dõi để biết thêm mẹo chơi lan 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STORY = [
  { clip: "clips_sieutrom/s1.mp4", vo: "audio_sieutrom/vo_s1.mp3", dur: SCENES.s1, cap: "Đêm ấy, anh cầm đèn pin, mai phục.", color: "#ffffff" },
  { clip: "clips_sieutrom/s2.mp4", vo: "audio_sieutrom/vo_s2.mp3", dur: SCENES.s2, cap: "Nửa đêm... một cái bóng di chuyển.", color: "#ff9a9a" },
  { clip: "clips_sieutrom/s3.mp4", vo: "audio_sieutrom/vo_s3.mp3", dur: SCENES.s3, cap: "Anh lao tới, rọi thẳng đèn vào!", color: "#ffffff" },
];

export const THIEF_TOTAL_FRAMES = TOTAL;

export const OrchidThief: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_sieutrom/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_sieutrom/vo_twist.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_sieutrom/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
