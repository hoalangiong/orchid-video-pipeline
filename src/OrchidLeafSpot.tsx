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
  accent: "#ffb347",
  gold: "#ffe08a",
  text: "#ffffff",
  sub: "#fff3e0",
};

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.9)";

const SCENES = {
  title: 254,
  tip1: 250,
  tip2: 252,
  tip3: 244,
  tip4: 254,
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
        color: "#331f02",
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
      <MotionBG src={staticFile("clips_domla/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🍂</div>
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
          ĐỐM LÁ HẠI LAN:{"\n"}NHẬN BIẾT & ĐIỀU TRỊ
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
          Đốm nâu viền vàng trên lá lan Dendro 🍃
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
      <MotionBG src={staticFile("clips_domla/outro.mp4")} />
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
          Sạch đốm lá,{"\n"}lá lan Dendro xanh bền! 🍃
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
    title: "Đốm nâu đen viền vàng",
    desc: "Lá nổi đốm tròn nhỏ nâu đen, mỗi đốm có quầng vàng bao quanh. Giai đoạn đầu, dễ trị nếu phát hiện sớm.",
    clip: "clips_domla/tip1.mp4",
    vo: "audio_domla/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Dấu hiệu 2",
    title: "Đốm lan rộng, ướt nhũn",
    desc: "Nặng hơn, đốm liên kết thành mảng đen lõm ướt nhũn, lá mềm thối. Đốm ướt nhũn là do vi khuẩn, lây rất nhanh.",
    clip: "clips_domla/tip2.mp4",
    vo: "audio_domla/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Cách trị 1",
    title: "Cắt bỏ phần lá bệnh",
    desc: "Dùng kéo đã khử trùng cắt bỏ phần lá đốm, cắt lẹm vào phần lành, để chỗ khô thoáng cho vết cắt lành.",
    clip: "clips_domla/tip3.mp4",
    vo: "audio_domla/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Cách trị 2",
    title: "Phun Ridomil / Kasumin",
    desc: "Phun thuốc nấm Ridomil Gold hoặc Antracol; đốm ướt nhũn do vi khuẩn thì thêm Kasumin/Starner, phun chiều mát.",
    clip: "clips_domla/tip4.mp4",
    vo: "audio_domla/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const LEAFSPOT_TOTAL_FRAMES = TOTAL;

export const OrchidLeafSpot: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#080501" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_domla/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_domla/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
