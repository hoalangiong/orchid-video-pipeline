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
  title: Math.round((5.598 + 1.8) * 30),
  tip1: Math.round((5.136 + 1.8) * 30),
  tip2: Math.round((5.070 + 1.8) * 30),
  tip3: Math.round((5.040 + 1.8) * 30),
  outro: Math.round((4.656 + 1.8) * 30),
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
          fontSize: 46,
          fontWeight: 800,
          color,
          textAlign: "center",
          lineHeight: 1.35,
          textShadow,
          opacity: op,
          transform: `translateY(${y}px)`,
          maxWidth: 920,
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
      <MotionBG src={staticFile("clips_thuanrung/title.mp4")} dark={0.62} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 24 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 900,
            color: "#ffdd8a",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow,
            opacity: hookOp,
            transform: `scale(${0.9 + pop * 0.1})`,
          }}
        >
          Lần đầu mang về một giò lan rừng, mình đã lo lắng không biết chăm thế nào cho đúng.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_thuanrung/outro.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 220px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 42,
            fontWeight: 900,
            color: "#ffe14a",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 920,
          }}
        >
          Bạn còn nhớ cảm giác tuần đầu nuôi lan của mình không? Kể cho mình nghe nhé!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TUANDAUTIEN10_TOTAL_FRAMES = TOTAL;

export const OrchidTuanDauTien10: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <HookScene />
          </SceneFade>
          <Audio src={staticFile("audio_tuandautien10/vo_title.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip1}>
          <SceneFade duration={SCENES.tip1}>
            <MotionBG src={staticFile("clips_thuanrung/tip1.mp4")} />
            <CineCaption text="Mình để cây nơi mát, chưa bón gì, chỉ phun ẩm nhẹ cho rễ quen giá thể mới." />
          </SceneFade>
          <Audio src={staticFile("audio_tuandautien10/vo_tip1.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip2}>
          <SceneFade duration={SCENES.tip2}>
            <MotionBG src={staticFile("clips_thuanrung/tip2.mp4")} />
            <CineCaption text="Mình bắt đầu ghép lại giá thể thoáng hơn, rễ lan rừng rất sợ ẩm ứ nước." />
          </SceneFade>
          <Audio src={staticFile("audio_tuandautien10/vo_tip2.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip3}>
          <SceneFade duration={SCENES.tip3}>
            <MotionBG src={staticFile("clips_thuanrung/tip3.mp4")} />
            <CineCaption text="Mình thấy rễ non đầu tiên nhú lên, mừng như lần đầu nuôi cây có hoa." />
          </SceneFade>
          <Audio src={staticFile("audio_tuandautien10/vo_tip3.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_tuandautien10/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
