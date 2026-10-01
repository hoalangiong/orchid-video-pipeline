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
  title: 222,
  s1: 177,
  s2: 180,
  s3: 198,
  s4: 183,
  twist: 252,
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
      <MotionBG src={staticFile("clips_bimat/title.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 26 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.08,
            letterSpacing: 1,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          BÍ MẬT SAU{"\n"}GIÀN LAN TIỀN TỶ
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            fontWeight: 700,
            color: "#ffd24a",
            textShadow,
            textAlign: "center",
            opacity: subOp,
          }}
        >
          Sự thật ít ai ngờ tới... 🌿
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  const cta = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_bimat/twist.mp4")} dark={0.62} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 220px", gap: 28 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 58,
            fontWeight: 900,
            color: "#8ef58e",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 900,
          }}
        >
          "Tiền tỷ" là tiền công{"\n"}tưới nước mỗi sáng 😂
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
          Nghề chơi lan là vậy đó 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STORY = [
  { clip: "clips_bimat/s1.mp4", vo: "audio_bimat/vo_s1.mp3", dur: SCENES.s1, cap: "Từng giò lan xếp hàng như báu vật.", color: "#ffd24a" },
  { clip: "clips_bimat/s2.mp4", vo: "audio_bimat/vo_s2.mp3", dur: SCENES.s2, cap: "Chủ nhân bước đi như một ông hoàng.", color: "#ffffff" },
  { clip: "clips_bimat/s3.mp4", vo: "audio_bimat/vo_s3.mp3", dur: SCENES.s3, cap: "Bí mật? Chăm từng giò như chăm con.", color: "#ffffff" },
  { clip: "clips_bimat/s4.mp4", vo: "audio_bimat/vo_s4.mp3", dur: SCENES.s4, cap: "Cả giàn lan Dendro bung hoa đồng loạt.", color: "#8ef5c0" },
];

export const SECRET_TOTAL_FRAMES = TOTAL;

export const OrchidSecret: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_bimat/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_bimat/vo_twist.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
