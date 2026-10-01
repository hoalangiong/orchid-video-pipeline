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
  accent: "#8ef5c0",
  gold: "#ffd24a",
  text: "#ffffff",
  sub: "#dcfced",
};

const FONT = "'Segoe UI', Arial, sans-serif";

const SCENES = {
  title: 222,
  tip1: 258,
  tip2: 219,
  tip3: 243,
  tip4: 231,
  tip5: 219,
  outro: 180,
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
          "linear-gradient(180deg, rgba(4,16,10,0.32) 0%, rgba(4,16,10,0.12) 40%, rgba(4,16,10,0.78) 100%)",
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

const TipBadge: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: "50%",
        backgroundColor: COLORS.gold,
        color: "#0a2a1a",
        fontSize: 82,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      {n}
    </div>
  );
};

const textShadow = "0 3px 18px rgba(0,0,0,0.9)";

const TipScene: React.FC<{
  n: number;
  title: string;
  desc: string;
  clip: string;
  duration: number;
}> = ({ n, title, desc, clip }) => {
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
          gap: 40,
        }}
      >
        <TipBadge n={n} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 76,
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
      <MotionBG src={staticFile("clips_giathe/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🪵</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 88,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          5 LOẠI GIÁ THỂ{"\n"}TRỒNG GIẢ HẠC TỐT NHẤT
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
          Chọn đúng, rễ khỏe cây sung 🌿
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
      <MotionBG src={staticFile("clips_giathe/outro.mp4")} />
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
          Chọn đúng giá thể,{"\n"}giả hạc khỏe mạnh! 🌸
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
          Lưu lại để chọn cho vườn! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    title: "Vỏ thông",
    desc: "Thoáng, thoát nước nhanh, giữ ẩm vừa, rễ bám chắc. Phổ biến nhất.",
    clip: "clips_giathe/tip1.mp4",
    vo: "audio_giathe/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    title: "Than củi",
    desc: "Sạch mầm bệnh, giữ ẩm tốt, ổn định độ chua cho giá thể.",
    clip: "clips_giathe/tip2.mp4",
    vo: "audio_giathe/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    title: "Vỏ dừa",
    desc: "Giữ ẩm lâu, giá rẻ. Nhớ xử lý chát kỹ trước khi dùng.",
    clip: "clips_giathe/tip3.mp4",
    vo: "audio_giathe/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    title: "Ghép gỗ",
    desc: "Trồng lên lũa/gỗ giúp cây tự nhiên, thoáng gốc, hạn chế thối rễ.",
    clip: "clips_giathe/tip4.mp4",
    vo: "audio_giathe/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
  {
    title: "Dớn hoặc rêu",
    desc: "Giữ ẩm rất tốt, hợp ươm keiki và cây con, nhưng cần thoáng.",
    clip: "clips_giathe/tip5.mp4",
    vo: "audio_giathe/vo_tip5.mp3",
    dur: SCENES.tip5,
  },
];

export const MEDIA_TOTAL_FRAMES = TOTAL;

export const OrchidMedia: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04100a" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_giathe/vo_title.mp3")} />
        </Series.Sequence>

        {TIPS.map((tip, i) => (
          <Series.Sequence key={i} durationInFrames={tip.dur}>
            <SceneFade duration={tip.dur}>
              <TipScene
                n={i + 1}
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
          <Audio src={staticFile("audio_giathe/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
