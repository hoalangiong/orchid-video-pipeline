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

const SCENES = { title: 153, tip: 206, outro: 167 };
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
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_lanhaydep2/v1_vunutethien.mp4")} dark={0.62} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 24 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 900,
            color: "#ffb37a",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow,
            opacity: hookOp,
            transform: `scale(${0.9 + pop * 0.1})`,
          }}
        >
          Một chùm hoa vàng cam mà hình dáng lạ{"\n"}như thế này, nhìn kỹ mới biết là hoa lan
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  const cta = interpolate(frame, [132, 167], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_lanhaydep2/v1_vunutethien.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 220px", gap: 28 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            fontWeight: 900,
            color: "#ffe14a",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 900,
          }}
        >
          Vũ nữ Tề Thiên đây, cánh hoa xoắn lạ mắt{"\n"}màu vàng cam nổi bật, càng nhìn càng độc đáo 💜
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
          Bạn có thấy hình dáng hoa này giống con gì không, comment cho tôi biết nhé!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LANHAY11_TOTAL_FRAMES = TOTAL;

export const OrchidLanHay11: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <HookScene />
          </SceneFade>
          <Audio src={staticFile("audio_lanhaydep2/v1_title.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip}>
          <SceneFade duration={SCENES.tip}>
            <MotionBG src={staticFile("clips_lanhaydep2/v1_vunutethien.mp4")} />
            <CineCaption
              text="Vũ nữ Tề Thiên đây, cánh hoa xoắn lạ mắt, màu vàng cam nổi bật, càng nhìn càng thấy độc đáo."
              color="#ffffff"
            />
          </SceneFade>
          <Audio src={staticFile("audio_lanhaydep2/v1_tip.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <TwistScene />
          </SceneFade>
          <Audio src={staticFile("audio_lanhaydep2/v1_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
