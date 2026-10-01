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
  accent: "#8ef58e",
  gold: "#ffd24a",
  text: "#ffffff",
  sub: "#e0f5e4",
};

const FONT = "'Segoe UI', Arial, sans-serif";

// Nhip nhanh: canh = voiceover + ~1.5s. Clip PlenX dai 8s nen du.
const SCENES = {
  title: 216,
  tip1: 228,
  tip2: 228,
  tip3: 225,
  tip4: 228,
  outro: 198,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

// Clip dong nen (mute, vi clip PlenX co audio rieng) + lop toi de chu de doc
const MotionBG: React.FC<{ src: string }> = ({ src }) => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={src}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,12,0.32) 0%, rgba(6,20,12,0.12) 40%, rgba(6,20,12,0.78) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

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
        color: "#0b2016",
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
}> = ({ n, title, desc, clip, duration }) => {
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
            fontSize: 78,
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
      <MotionBG src={staticFile("clips_trongmoi/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🌱</div>
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
          TRỒNG LAN GIẢ HẠC{"\n"}CHO NGƯỜI MỚI
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
          4 bước cơ bản, sống khỏe ngay 🌿
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
      <MotionBG src={staticFile("clips_trongmoi/outro.mp4")} />
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
          Bắt tay trồng thử{"\n"}ngay thôi! 🌸
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
          Thắc mắc gì cứ comment nhé! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    title: "Ghép giá thể đúng",
    desc: "Ghép lên gỗ hoặc vỏ thông thoáng, để rễ bám chắc, không úng.",
    clip: "clips_trongmoi/tip1.mp4",
    vo: "audio_trongmoi/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    title: "Chỗ thoáng, sáng vừa",
    desc: "Treo nơi có gió và nắng nhẹ qua lưới, tránh nắng gắt trực tiếp.",
    clip: "clips_trongmoi/tip2.mp4",
    vo: "audio_trongmoi/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    title: "Tưới đúng cách",
    desc: "Tưới khi giá thể khô, tưới đẫm rồi để ráo, đừng để gốc luôn ẩm.",
    clip: "clips_trongmoi/tip3.mp4",
    vo: "audio_trongmoi/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    title: "Bón phân loãng",
    desc: "Phân pha thật loãng, tưới định kỳ, nhẹ nhưng đều thì cây mới sung.",
    clip: "clips_trongmoi/tip4.mp4",
    vo: "audio_trongmoi/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const GROWNEW_TOTAL_FRAMES = TOTAL;

export const OrchidGrowNew: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#06140c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_trongmoi/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_trongmoi/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
