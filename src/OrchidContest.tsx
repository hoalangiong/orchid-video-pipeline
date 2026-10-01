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
  title: 210,
  s1: 189,
  s2: 186,
  s3: 171,
  s4: 180,
  twist: 282,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

const MotionBG: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={src}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          background: "rgba(0,0,0,0.55)",
          padding: "26px 40px",
          borderRadius: 28,
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
      <MotionBG src={staticFile("clips_cuocthi/title.mp4")} />
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
          CUỘC THI LAN{"\n"}ĐẸP NHẤT LÀNG
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
          Ai thắng sẽ khiến bạn bất ngờ... 🏆
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  const cta = interpolate(frame, [185, 220], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_cuocthi/twist.mp4")} />
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
          Giò lan NHỎ NHẤT{"\n"}lại vô địch! 🥇😲
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
          Chơi lan, không phải cứ to là thắng 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const STORY = [
  { clip: "clips_cuocthi/s1.mp4", vo: "audio_cuocthi/vo_s1.mp3", dur: SCENES.s1, cap: "Ứng viên số 1: giò lan khổng lồ, hoa dày.", color: "#ffd24a" },
  { clip: "clips_cuocthi/s2.mp4", vo: "audio_cuocthi/vo_s2.mp3", dur: SCENES.s2, cap: "Góc bàn: một giò lan nhỏ, chẳng ai để ý.", color: "#ffffff" },
  { clip: "clips_cuocthi/s3.mp4", vo: "audio_cuocthi/vo_s3.mp3", dur: SCENES.s3, cap: "Ban giám khảo xem xét... căng thẳng.", color: "#ffffff" },
  { clip: "clips_cuocthi/s4.mp4", vo: "audio_cuocthi/vo_s4.mp3", dur: SCENES.s4, cap: "Giải nhất thuộc về... giò lan nhỏ bé!", color: "#8ef5c0" },
];

export const CONTEST_TOTAL_FRAMES = TOTAL;

export const OrchidContest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04080c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_cuocthi/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_cuocthi/vo_twist.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
