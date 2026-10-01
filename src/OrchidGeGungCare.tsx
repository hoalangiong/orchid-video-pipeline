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
  accent: "#7be0a3",
  gold: "#d4f7c5",
  text: "#ffffff",
  sub: "#eafff0",
};

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.95)";
const PRODUCT = staticFile("products/ge-gung.png");

const SCENES = {
  title: 256,
  tip1: 252,
  tip2: 256,
  tip3: 256,
  tip4: 256,
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
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(3,10,6,0) 0%, rgba(3,10,6,0) 55%, rgba(3,10,6,0.55) 100%)",
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

// Product card only on the GE Gung step (tip3)
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
        color: "#08321c",
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
  showProduct?: boolean;
}> = ({ label, title, desc, clip, showProduct }) => {
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
      {showProduct && <ProductCard />}
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
  const subOpacity = interpolate(frame, [18, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_gegungcs/title.mp4")} />
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
            fontSize: 80,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          CHĂM LAN DENDRO{"\n"}KHỎE QUANH NĂM
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
          4 bước cơ bản cùng GE Gừng 🫚
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_gegungcs/outro.mp4")} />
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
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          Chăm đúng cách,{"\n"}lan Dendro xanh tốt{"\n"}bền hoa quanh năm! 🌿
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Bước 1",
    title: "Ánh sáng & thông thoáng",
    desc: "Treo lan dưới lưới che khoảng 70% nắng, giàn thoáng gió giúp cây quang hợp tốt và hạn chế nấm bệnh tích tụ.",
    clip: "clips_gegungcs/tip1.mp4",
    vo: "audio_gegungcs/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Bước 2",
    title: "Tưới nước hợp lý",
    desc: "Tưới đẫm vào sáng sớm, để giá thể khô ráo rồi mới tưới lại. Tránh tưới chiều tối vì nước đọng qua đêm dễ gây thối.",
    clip: "clips_gegungcs/tip2.mp4",
    vo: "audio_gegungcs/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Bước 3",
    title: "Phun phòng GE Gừng",
    desc: "Chế phẩm sinh học từ gừng giúp xua côn trùng và phòng nấm khuẩn tự nhiên. Pha loãng, phun đều 7-10 ngày một lần.",
    clip: "clips_gegungcs/tip3.mp4",
    vo: "audio_gegungcs/vo_tip3.mp3",
    dur: SCENES.tip3,
    showProduct: true,
  },
  {
    label: "Bước 4",
    title: "Dinh dưỡng & quan sát",
    desc: "Bón phân loãng theo giai đoạn, thường xuyên nhìn rễ và lá. Rễ trắng mập, lá xanh cứng là dấu hiệu cây đang khỏe.",
    clip: "clips_gegungcs/tip4.mp4",
    vo: "audio_gegungcs/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const GEGUNGCARE_TOTAL_FRAMES = TOTAL;

export const OrchidGeGungCare: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030a06" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_gegungcs/vo_title.mp3")} />
        </Series.Sequence>

        {TIPS.map((tip, i) => (
          <Series.Sequence key={i} durationInFrames={tip.dur}>
            <SceneFade duration={tip.dur}>
              <TipScene
                label={tip.label}
                title={tip.title}
                desc={tip.desc}
                clip={staticFile(tip.clip)}
                showProduct={tip.showProduct}
              />
            </SceneFade>
            <Audio src={staticFile(tip.vo)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_gegungcs/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
