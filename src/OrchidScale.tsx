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
  accent: "#ffb066",
  gold: "#ffe0a0",
  text: "#ffffff",
  sub: "#fff1e0",
};

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.95)";

const SCENES = {
  title: 256,
  tip1: 250,
  tip2: 252,
  tip3: 256,
  tip4: 258,
  outro: 250,
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
        color: "#2e1902",
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
      <MotionBG src={staticFile("clips_repvay/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🐞</div>
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
          RỆP VẢY HẠI LAN:{"\n"}NHẬN BIẾT & DIỆT TRỪ
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
          Vảy nâu cứng chích hút nhựa lan Dendro 🌿
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
      <MotionBG src={staticFile("clips_repvay/outro.mp4")} />
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
          Sạch rệp vảy,{"\n"}lan Dendro khỏe mạnh! 🌿
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
    title: "Vảy nâu cứng bám thân",
    desc: "Trên thân, bẹ và mặt dưới lá nổi vảy nhỏ bầu dục nâu vàng, cứng như mai, bám chặt. Đó là con rệp vảy chích hút nhựa.",
    clip: "clips_repvay/tip1.mp4",
    vo: "audio_repvay/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Dấu hiệu 2",
    title: "Lá vàng, mật dính đen",
    desc: "Nặng thì lá vàng còi cọc, tiết mật dính bóng kéo theo nấm bồ hóng đen. Rệp vảy sinh sản nhanh, lây qua giả hành khác.",
    clip: "clips_repvay/tip2.mp4",
    vo: "audio_repvay/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Cách trị 1",
    title: "Chà cồn, cạy sạch vảy",
    desc: "Số ít thì dùng bông thấm cồn và bàn chải mềm chà sạch từng con vảy, cạy hết lớp vảy cứng rồi lau lại cho hết mật dính.",
    clip: "clips_repvay/tip3.mp4",
    vo: "audio_repvay/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Cách trị 2",
    title: "Phun dầu khoáng / Movento",
    desc: "Bị nhiều thì phun dầu khoáng SK Enspray hoặc Movento, Confidor; phun lặp lại sau 7-10 ngày để diệt lứa rệp non mới nở.",
    clip: "clips_repvay/tip4.mp4",
    vo: "audio_repvay/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const SCALE_TOTAL_FRAMES = TOTAL;

export const OrchidScale: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#060301" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_repvay/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_repvay/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
