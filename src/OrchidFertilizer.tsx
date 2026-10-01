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

const COLORS = {
  accent: "#ffd24a",
  gold: "#ffe14a",
  text: "#ffffff",
  sub: "#fff2cc",
};

const FONT = "'Segoe UI', Arial, sans-serif";

const SCENES = {
  title: 216,
  tip1: 174,
  tip2: 180,
  tip3: 168,
  tip4: 168,
  outro: 168,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

const MotionBG: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={src}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(16,12,2,0.32) 0%, rgba(16,12,2,0.12) 40%, rgba(16,12,2,0.78) 100%)",
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
    [0, 10, duration - 10, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const TipBadge: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <div
      style={{
        padding: "14px 40px",
        borderRadius: 60,
        backgroundColor: COLORS.gold,
        color: "#2a1c00",
        fontSize: 52,
        fontWeight: 800,
        transform: `scale(${scale})`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        fontFamily: FONT,
      }}
    >
      {label}
    </div>
  );
};

const textShadow = "0 3px 18px rgba(0,0,0,0.9)";

const TipScene: React.FC<{
  label: string;
  title: string;
  desc: string;
  clip: string;
  duration: number;
}> = ({ label, title, desc, clip }) => {
  const frame = useCurrentFrame();
  const titleY = interpolate(frame, [6, 22], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleOpacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const descOpacity = interpolate(frame, [18, 34], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill>
      <MotionBG src={clip} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 90px 200px",
          gap: 36,
        }}
      >
        <TipBadge label={label} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 74,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            textShadow,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            lineHeight: 1.4,
            color: COLORS.sub,
            textAlign: "center",
            textShadow,
            opacity: descOpacity,
            maxWidth: 880,
          }}
        >
          {desc}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11 } });
  const subOpacity = interpolate(frame, [18, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_bonphan/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🌿</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          LỊCH BÓN PHÂN{"\n"}CHO LAN THEO MÙA
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 50,
            fontWeight: 700,
            color: COLORS.gold,
            textShadow,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          Bón đúng mùa, lan khỏe quanh năm 🌸
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const ctaOpacity = interpolate(frame, [20, 44], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_bonphan/outro.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          padding: 80,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 76,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          Bón đúng mùa,{"\n"}lan khỏe quanh năm! 🌸
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            color: COLORS.sub,
            textShadow,
            textAlign: "center",
            opacity: ctaOpacity,
          }}
        >
          Lưu lại lịch này nhé! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Mùa xuân",
    title: "Bón đạm kích mầm",
    desc: "Cây ra mầm, bón phân giàu đạm để thân lá phát triển mạnh.",
    clip: "clips_bonphan/tip1.mp4",
    vo: "audio_bonphan/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Mùa hè",
    title: "Cân đối NPK",
    desc: "Cây sung sức nhất, bón NPK cân đối đều đặn, tưới đủ nước.",
    clip: "clips_bonphan/tip2.mp4",
    vo: "audio_bonphan/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Mùa thu",
    title: "Tăng lân - kali",
    desc: "Chuẩn bị ra hoa, chuyển sang phân giàu lân và kali để kích nụ.",
    clip: "clips_bonphan/tip3.mp4",
    vo: "audio_bonphan/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Mùa đông",
    title: "Giảm phân, dưỡng sức",
    desc: "Cây nghỉ, giảm hoặc ngưng bón, tưới ít lại cho cây dưỡng sức.",
    clip: "clips_bonphan/tip4.mp4",
    vo: "audio_bonphan/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const FERTILIZER_TOTAL_FRAMES = TOTAL;

export const OrchidFertilizer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#100c02" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_bonphan/vo_title.mp3")} />
        </Series.Sequence>

        {TIPS.map((tip, i) => (
          <Series.Sequence key={i} durationInFrames={tip.dur}>
            <SceneFade duration={tip.dur}>
              <TipScene
                label={tip.label}
                title={tip.title}
                desc={tip.desc}
                clip={staticFile(tip.clip)}
                duration={tip.dur}
              />
            </SceneFade>
            <Audio src={staticFile(tip.vo)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_bonphan/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
