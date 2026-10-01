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
  accent: "#7ab8ff",
  gold: "#c8e2ff",
  text: "#ffffff",
  sub: "#dcecff",
};

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.95)";
const PRODUCT = staticFile("products/dichchuoi.jpg");

const SCENES = {
  title: 294,
  tip1: 276,
  tip2: 264,
  tip3: 285,
  tip4: 271,
  outro: 249,
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
          "linear-gradient(180deg, rgba(4,12,24,0) 0%, rgba(4,12,24,0) 55%, rgba(4,12,24,0.55) 100%)",
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
        color: "#062038",
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
      <MotionBG src={staticFile("clips_nghidong/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div
          style={{
            borderRadius: 32,
            overflow: "hidden",
            border: "5px solid rgba(255,255,255,0.92)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.65)",
            background: "#fff",
            transform: `scale(${scale})`,
          }}
        >
          <Img src={PRODUCT} style={{ width: 340, height: 340, objectFit: "cover", display: "block" }} />
        </div>
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
          DÙNG DỊCH CHUỐI{"\n"}CHO LAN NGHỈ ĐÔNG
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
          4 bước cho lan Dendro nghỉ ngơi qua mùa lạnh ❄️
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
      <MotionBG src={staticFile("clips_nghidong/outro.mp4")} />
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
            borderRadius: 32,
            overflow: "hidden",
            border: "5px solid rgba(255,255,255,0.92)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.65)",
            background: "#fff",
            transform: `scale(${scale})`,
          }}
        >
          <Img src={PRODUCT} style={{ width: 340, height: 340, objectFit: "cover", display: "block" }} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 66,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          Mùa nghỉ đông chỉ cần dịch chuối{"\n"}cực loãng, giãn cữ và giữ ấm, lan{"\n"}Dendro sẽ bung mầm khỏe khi xuân về
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Bước 1",
    title: "Giảm mạnh cữ dịch chuối",
    desc: "Mùa nghỉ cây gần như ngừng hút, chỉ bổ sung dịch chuối rất loãng nửa tháng một lần, hoặc tạm ngưng khi quá lạnh.",
    clip: "clips_nghidong/tip1.mp4",
    vo: "audio_nghidong/vo_tip1.mp3",
    dur: SCENES.tip1,
    showProduct: true,
  },
  {
    label: "Bước 2",
    title: "Chờ trời ấm mới tưới",
    desc: "Chọn ngày nắng ấm giữa trưa để tưới dịch chuối loãng, tránh tưới khi nhiệt độ xuống thấp làm rễ dễ nhiễm lạnh.",
    clip: "clips_nghidong/tip2.mp4",
    vo: "audio_nghidong/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Bước 3",
    title: "Giữ giá thể khô thoáng",
    desc: "Mùa nghỉ giá thể cần khô hơn, chỉ ẩm nhẹ, dịch chuối lúc này chủ yếu để duy trì sức chứ không thúc cây ra mầm.",
    clip: "clips_nghidong/tip3.mp4",
    vo: "audio_nghidong/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Bước 4",
    title: "Tránh gió lạnh, chờ xuân",
    desc: "Che chắn gió lùa, để lan nghỉ trọn vẹn, khi trời ấm lên mới tăng dần dịch chuối để cây bật mầm mạnh.",
    clip: "clips_nghidong/tip4.mp4",
    vo: "audio_nghidong/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const NGHIDONG_TOTAL_FRAMES = TOTAL;

export const OrchidNghiDong: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040c18" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_nghidong/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_nghidong/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
