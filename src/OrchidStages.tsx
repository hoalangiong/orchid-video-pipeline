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
  accent: "#7fd6ff",
  gold: "#ffd24a",
  text: "#ffffff",
  sub: "#dcf1ff",
};

const FONT = "'Segoe UI', Arial, sans-serif";

const SCENES = {
  title: 213,
  tip1: 222,
  tip2: 207,
  tip3: 213,
  tip4: 231,
  tip5: 198,
  outro: 192,
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
          "linear-gradient(180deg, rgba(2,12,20,0.32) 0%, rgba(2,12,20,0.12) 40%, rgba(2,12,20,0.78) 100%)",
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
        color: "#0a1c2a",
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
      <MotionBG src={staticFile("clips_giaidoan/title.mp4")} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>📅</div>
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
          LỊCH CHĂM GIẢ HẠC{"\n"}THEO GIAI ĐOẠN
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
          5 giai đoạn, hoa nở đúng thời điểm 🌸
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
      <MotionBG src={staticFile("clips_giaidoan/outro.mp4")} />
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
          Chăm đúng giai đoạn,{"\n"}giả hạc bung hoa! 🌸
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
          Lưu lại để chăm cho chuẩn! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Giai đoạn 1",
    title: "Nảy mầm",
    desc: "Cây nhú mầm ở gốc, giữ ẩm đều và bón đạm nhẹ để mầm bật khỏe.",
    clip: "clips_giaidoan/tip1.mp4",
    vo: "audio_giaidoan/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Giai đoạn 2",
    title: "Phát triển thân",
    desc: "Cây vươn thân mạnh, tăng tưới và bón cân đối để thân dài, mập.",
    clip: "clips_giaidoan/tip2.mp4",
    vo: "audio_giaidoan/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Giai đoạn 3",
    title: "Thắt ngọn",
    desc: "Thân chững lại, giảm đạm, tăng lân kali để cây tích lũy làm nụ.",
    clip: "clips_giaidoan/tip3.mp4",
    vo: "audio_giaidoan/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Giai đoạn 4",
    title: "Ra nụ",
    desc: "Thấy mắt hoa nhú, giữ ẩm ổn định, tránh xê dịch để nụ không teo.",
    clip: "clips_giaidoan/tip4.mp4",
    vo: "audio_giaidoan/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
  {
    label: "Giai đoạn 5",
    title: "Nở hoa",
    desc: "Đưa ra chỗ mát, giảm tưới nhẹ, hoa bền màu và lâu tàn hơn.",
    clip: "clips_giaidoan/tip5.mp4",
    vo: "audio_giaidoan/vo_tip5.mp3",
    dur: SCENES.tip5,
  },
];

export const STAGES_TOTAL_FRAMES = TOTAL;

export const OrchidStages: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020c14" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_giaidoan/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_giaidoan/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
