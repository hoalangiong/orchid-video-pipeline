import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Series,
} from "remotion";

const COLORS = {
  accent: "#8fd14f",
  gold: "#e8ffb8",
  text: "#ffffff",
  sub: "#f2ffe0",
};

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.95)";
const PRODUCT = staticFile("products/nuoc-voi.jpg");

const SCENES = {
  title: 258,
  tip1: 252,
  tip2: 256,
  tip3: 256,
  tip4: 256,
  outro: 254,
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
          "linear-gradient(180deg, rgba(4,10,2,0) 0%, rgba(4,10,2,0) 55%, rgba(4,10,2,0.55) 100%)",
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
    [0, 12, duration - 12, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Product bottle card that floats in from the side on tip scenes
const ProductCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const x = interpolate(s, [0, 1], [180, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        right: 44,
        transform: `translateX(${x}px)`,
        borderRadius: 28,
        overflow: "hidden",
        border: "4px solid rgba(255,255,255,0.9)",
        boxShadow: "0 16px 50px rgba(0,0,0,0.6)",
        background: "#fff",
      }}
    >
      <Img src={PRODUCT} style={{ width: 300, height: 300, objectFit: "cover", display: "block" }} />
    </div>
  );
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
        color: "#123006",
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
      <ProductCard />
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
            fontSize: 72,
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
  const prodSpring = spring({ frame: frame - 14, fps, config: { damping: 13, stiffness: 110 } });
  const prodY = interpolate(prodSpring, [0, 1], [80, 0]);
  const subOpacity = interpolate(frame, [40, 62], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_nuocvoi/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 70,
          gap: 34,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 78,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          MÙA MƯA LAN THỐI?{"\n"}ĐÃ CÓ GIẢI PHÁP TỰ NHIÊN
        </div>
        <div
          style={{
            transform: `translateY(${prodY}px) scale(${prodSpring})`,
            opacity: prodSpring,
            borderRadius: 32,
            overflow: "hidden",
            border: "5px solid rgba(255,255,255,0.95)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            background: "#fff",
          }}
        >
          <Img src={PRODUCT} style={{ width: 440, height: 440, objectFit: "cover", display: "block" }} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.gold,
            textShadow,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          NƯỚC VÔI THIÊN NHIÊN 🌿
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const prodSpring = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 110 } });
  const ctaOpacity = interpolate(frame, [40, 66], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_nuocvoi/outro.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          padding: 70,
        }}
      >
        <div
          style={{
            transform: `scale(${prodSpring})`,
            opacity: prodSpring,
            borderRadius: 32,
            overflow: "hidden",
            border: "5px solid rgba(255,255,255,0.95)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            background: "#fff",
          }}
        >
          <Img src={PRODUCT} style={{ width: 400, height: 400, objectFit: "cover", display: "block" }} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 62,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          NƯỚC VÔI THIÊN NHIÊN{"\n"}An toàn - Tự nhiên - Hiệu quả 🌿
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
          Nhắn tin để được tư vấn ngay! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Giải pháp",
    title: "Tự nhiên & an toàn",
    desc: "Nước vôi thiên nhiên phòng và trị bệnh cho lan, không độc hại, an toàn cho người dùng và thân thiện với cây.",
    clip: "clips_nuocvoi/tip1.mp4",
    vo: "audio_nuocvoi/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Công dụng",
    title: "Sát khuẩn, diệt nấm",
    desc: "Diệt nấm, sát khuẩn, làm khô nhanh vết thối. Bôi lên vết cắt giúp liền sẹo và chặn vi khuẩn lây lan.",
    clip: "clips_nuocvoi/tip2.mp4",
    vo: "audio_nuocvoi/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Cách dùng",
    title: "Phun phòng định kỳ",
    desc: "Pha loãng với nước sạch, phun đều lên giò lan 7-10 ngày một lần trong mùa mưa để ngăn nấm khuẩn bùng phát.",
    clip: "clips_nuocvoi/tip3.mp4",
    vo: "audio_nuocvoi/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Trị vết thối",
    title: "Cắt rồi bôi trực tiếp",
    desc: "Cắt bỏ phần hư, bôi trực tiếp nước vôi lên vết cắt, để nơi khô thoáng. Vết thương khô se, cây phục hồi nhanh.",
    clip: "clips_nuocvoi/tip4.mp4",
    vo: "audio_nuocvoi/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const NUOCVOI_TOTAL_FRAMES = TOTAL;

export const OrchidNuocVoi: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040a02" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_nuocvoi/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_nuocvoi/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
