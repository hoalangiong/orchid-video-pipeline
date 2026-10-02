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
  title: 202,
  tip1: 210,
  tip2: 207,
  tip3: 193,
  tip4: 202,
  outro: 204,
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
      <MotionBG src={staticFile("clips_dotbien/title.mp4")} dark={0.62} />
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
          Một cây lan đột biến có thể đáng giá cả trăm triệu, nhưng làm sao để nhận biết?
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
      <MotionBG src={staticFile("clips_dotbien/outro.mp4")} dark={0.6} />
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
          Nhà bạn có cây nào nghi đột biến không? Comment mô tả cho tôi xem thử nhé!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const DOTBIEN15_TOTAL_FRAMES = TOTAL;

export const OrchidDotBien15: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <HookScene />
          </SceneFade>
          <Audio src={staticFile("audio_dotbien15/vo_title.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip1}>
          <SceneFade duration={SCENES.tip1}>
            <MotionBG src={staticFile("clips_dotbien/tip1.mp4")} />
            <CineCaption text="Dấu hiệu đầu tiên: màu hoa khác hoàn toàn so với cây mẹ, dù cùng một giò tách ra." />
          </SceneFade>
          <Audio src={staticFile("audio_dotbien15/vo_tip1.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip2}>
          <SceneFade duration={SCENES.tip2}>
            <MotionBG src={staticFile("clips_dotbien/tip2.mp4")} />
            <CineCaption text="Dấu hiệu thứ hai: cánh hoa có hình dáng lạ, dày hơn hoặc bo tròn khác thường." />
          </SceneFade>
          <Audio src={staticFile("audio_dotbien15/vo_tip2.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip3}>
          <SceneFade duration={SCENES.tip3}>
            <MotionBG src={staticFile("clips_dotbien/tip3.mp4")} />
            <CineCaption text="Dấu hiệu thứ ba: mắt lá hoặc thân cây xuất hiện vệt màu loang không đều." />
          </SceneFade>
          <Audio src={staticFile("audio_dotbien15/vo_tip3.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip4}>
          <SceneFade duration={SCENES.tip4}>
            <MotionBG src={staticFile("clips_dotbien/tip4.mp4")} />
            <CineCaption text="Dấu hiệu thứ tư: hoa nở sai mùa so với giống gốc, sớm hoặc muộn bất thường." />
          </SceneFade>
          <Audio src={staticFile("audio_dotbien15/vo_tip4.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_dotbien15/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
