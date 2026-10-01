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
};

const FONT = "'Segoe UI', Arial, sans-serif";

// Khong dung lop phu toi, khong dung hop nen den sau chu: chi vien den quanh chu
// (giu video sang han). Xem memory feedback_no_dark_overlay_all.
const stroke = {
  WebkitTextStroke: "10px #000",
  paintOrder: "stroke fill",
} as const;

const SCENES = {
  title: 248,
  tip1: 319,
  tip2: 278,
  tip3: 295,
  tip4: 400,
  outro: 216,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

// Zoom cham lam ben day thay vi ffmpeg: zoompan cua ffmpeg cham toi muc timeout
// 10 phut khong xong 6 clip, con CSS transform thi Chromium lam mien phi.
const MotionBG: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [1, 1.14], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={src}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
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
  clip: string;
  dur: number;
}> = ({ label, title, clip, dur }) => {
  const frame = useCurrentFrame();
  const titleY = interpolate(frame, [6, 22], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleOpacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill>
      <MotionBG src={clip} dur={dur} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 80px 220px",
          gap: 40,
        }}
      >
        <TipBadge label={label} />
        <div
          style={{
            ...stroke,
            fontFamily: FONT,
            fontSize: 84,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.16,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          {title}
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
      <MotionBG
        src={staticFile("clips_tulieutribenh/title.mp4")}
        dur={SCENES.title}
      />
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
            ...stroke,
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            transform: `scale(${scale})`,
          }}
        >
          3 DẤU HIỆU{"\n"}LAN SẮP CHẾT
        </div>
        <div
          style={{
            ...stroke,
            fontFamily: FONT,
            fontSize: 54,
            fontWeight: 700,
            color: COLORS.gold,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          Thấy trên lá là phải cứu ngay 🍃
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
      <MotionBG
        src={staticFile("clips_tulieutribenh/outro.mp4")}
        dur={SCENES.outro}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          padding: 70,
        }}
      >
        <div
          style={{
            ...stroke,
            fontFamily: FONT,
            fontSize: 82,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.28,
            transform: `scale(${scale})`,
          }}
        >
          Chăm đúng,{"\n"}lan lại xanh mướt! 🌿
        </div>
        <div
          style={{
            ...stroke,
            fontFamily: FONT,
            fontSize: 50,
            color: COLORS.gold,
            textAlign: "center",
            opacity: ctaOpacity,
          }}
        >
          Thả cho mình một trái tim nhé! ❤️
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    label: "Dấu hiệu 1",
    title: "Lá nổi đốm nâu vàng",
    clip: "clips_tulieutribenh/tip1.mp4",
    vo: "audio_tulieutribenh/vo_tip1.mp3",
    dur: SCENES.tip1,
  },
  {
    label: "Dấu hiệu 2",
    title: "Vàng lá, giả hành teo",
    clip: "clips_tulieutribenh/tip2.mp4",
    vo: "audio_tulieutribenh/vo_tip2.mp3",
    dur: SCENES.tip2,
  },
  {
    label: "Dấu hiệu 3",
    title: "Lá thối nhũn, chảy nước",
    clip: "clips_tulieutribenh/tip3.mp4",
    vo: "audio_tulieutribenh/vo_tip3.mp3",
    dur: SCENES.tip3,
  },
  {
    label: "Cách xử lý",
    title: "Cắt bỏ, phun thuốc,\nsoi lại rễ",
    clip: "clips_tulieutribenh/tip4.mp4",
    vo: "audio_tulieutribenh/vo_tip4.mp3",
    dur: SCENES.tip4,
  },
];

export const TULIEUTRIBENH_TOTAL_FRAMES = TOTAL;

export const OrchidTuLieuTriBenh: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#080501" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene />
          </SceneFade>
          <Audio src={staticFile("audio_tulieutribenh/vo_title.mp3")} />
        </Series.Sequence>

        {TIPS.map((tip, i) => (
          <Series.Sequence key={i} durationInFrames={tip.dur}>
            <SceneFade duration={tip.dur}>
              <TipScene
                label={tip.label}
                title={tip.title}
                clip={staticFile(tip.clip)}
                dur={tip.dur}
              />
            </SceneFade>
            <Audio src={staticFile(tip.vo)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_tulieutribenh/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
