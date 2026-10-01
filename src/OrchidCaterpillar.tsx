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
  accent: "#a8e063",
  gold: "#ffe08a",
  text: "#ffffff",
  sub: "#eefbe0",
};

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.9)";

const SCENES = {
  title: 252,
  tip1: 244,
  tip2: 252,
  tip3: 244,
  tip4: 250,
  outro: 252,
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
    [0, 12, duration - 12, duration],
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
        backgroundColor: COLORS.accent,
        color: "#1a2e06",
        fontSize: 46,
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

const TipScene: React.FC<{
  label: string;
  title: string;
  desc: string;
  clip: string;
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            background: "rgba(0,0,0,0.55)",
            padding: "34px 46px",
            borderRadius: 28,
            maxWidth: 960,
          }}
        >
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
            }}
          >
            {desc}
          </div>
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
      <MotionBG src={staticFile("clips_sauanla/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🐛</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 80,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          SÂU ĂN LÁ HẠI LAN:{"\n"}NHẬN BIẾT & DIỆT TRỪ
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
          Kẻ gặm thủng lá lan Dendro trong đêm 🌙
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const ctaOpacity = interpolate(frame, [30, 56], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_sauanla/outro.mp4")} />
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
          Diệt sâu ăn lá,{"\n"}giữ lá lan Dendro nguyên vẹn! 🌿
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
          Theo dõi để trị bệnh cho lan! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Dấu hiệu 1",
    title: "Lá thủng lỗ, mép nham nhở",
    desc: "Lá và đọt non có lỗ thủng lớn, mép bị gặm nham nhở, vết cắn còn tươi, thường thấy sau một đêm.",
    clip: "clips_sauanla/tip1.mp4",
    vo: "audio_sauanla/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Dấu hiệu 2",
    title: "Sâu ẩn, phân đen dưới lá",
    desc: "Lật mặt dưới lá thấy sâu xanh nằm ẩn, cạnh đó có phân đen li ti và nụ hoa bị gặm dở.",
    clip: "clips_sauanla/tip2.mp4",
    vo: "audio_sauanla/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Cách trị 1",
    title: "Soi đèn bắt sâu ban đêm",
    desc: "Chiều tối soi đèn pin, dùng nhíp hoặc tay bắt sâu bỏ đi. Sâu ăn đêm nên bắt lúc chạng vạng hiệu quả nhất.",
    clip: "clips_sauanla/tip3.mp4",
    vo: "audio_sauanla/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Cách trị 2",
    title: "Phun thuốc sinh học Bt",
    desc: "Vườn nhiều sâu thì phun Radiant, Tasieu hoặc Bt lên lá và đọt vào chiều mát, lặp lại sau 5 ngày.",
    clip: "clips_sauanla/tip4.mp4",
    vo: "audio_sauanla/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const CATERPILLAR_TOTAL_FRAMES = TOTAL;

export const OrchidCaterpillar: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040802" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_sauanla/vo_title.mp3")} />
        </Series.Sequence>

        {TIPS.map((tip, i) => (
          <Series.Sequence key={i} durationInFrames={tip.dur}>
            <SceneFade duration={tip.dur}>
              <TipScene
                label={tip.label}
                title={tip.title}
                desc={tip.desc}
                clip={staticFile(tip.clip)}
              />
            </SceneFade>
            <Audio src={staticFile(tip.vo)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_sauanla/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
