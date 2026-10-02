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

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 4px 24px rgba(0,0,0,0.95)";

const SCENES = {
  title: 209,
  tip1: 191,
  tip2: 212,
  tip3: 185,
  tip4: 189,
  tip5: 206,
  outro: 208,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

const MotionBG: React.FC<{ src: string; dark?: number }> = ({ src, dark = 0.55 }) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={src}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(4,6,12,0.35) 0%, rgba(4,6,12,0.1) 45%, rgba(4,6,12,${dark}) 100%)`,
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
    [0, 14, duration - 14, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const CineCaption: React.FC<{ text: string; color?: string }> = ({
  text,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [8, 26], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 240px" }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 800,
          color,
          textAlign: "center",
          lineHeight: 1.35,
          textShadow,
          opacity: op,
          transform: `translateY(${y}px)`,
          maxWidth: 920,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hookOp = interpolate(frame, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 130 } });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_lanhay35_nuhoanglilip/title.mp4")} dark={0.62} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 24 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 900,
            color: "#ffdd8a",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow,
            opacity: hookOp,
            transform: `scale(${0.9 + pop * 0.1})`,
          }}
        >
          Dân chơi lan gọi đây là dòng quý tộc, vì vẻ đẹp sang trọng hiếm cây nào sánh được.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <MotionBG src={staticFile("clips_lanhay39_phidiepvang/outro.mp4")} dark={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 220px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 42,
            fontWeight: 900,
            color: "#ffe14a",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow,
            transform: `scale(${scale})`,
            maxWidth: 920,
          }}
        >
          Bạn thích giống quý tộc nào nhất? Thả tim nếu bạn mê dòng lan sang trọng này nhé!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LANQUYTOC13_TOTAL_FRAMES = TOTAL;

export const OrchidLanQuyToc13: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <HookScene />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_title.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip1}>
          <SceneFade duration={SCENES.tip1}>
            <MotionBG src={staticFile("clips_lanhay35_nuhoanglilip/tip.mp4")} />
            <CineCaption text="Nữ hoàng Lilip, hoa to màu tím hồng kiêu sa, cánh hoa như lụa mềm." />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_tip1.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip2}>
          <SceneFade duration={SCENES.tip2}>
            <MotionBG src={staticFile("clips_lanhay36_bocap/tip.mp4")} />
            <CineCaption text="Bò cạp, dáng hoa cong nhọn lạ mắt, màu nâu đỏ độc đáo không lẫn với giống nào khác." />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_tip2.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip3}>
          <SceneFade duration={SCENES.tip3}>
            <MotionBG src={staticFile("clips_lanhay37_diachlan/tip.mp4")} />
            <CineCaption text="Diệc lan, hoa trắng mảnh như cánh chim diệc, bay bổng và thanh thoát." />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_tip3.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip4}>
          <SceneFade duration={SCENES.tip4}>
            <MotionBG src={staticFile("clips_lanhay38_hoanghauxanh/tip.mp4")} />
            <CineCaption text="Hoàng hậu xanh, màu xanh ngọc hiếm gặp, chỉ nhìn thôi đã thấy quý phái." />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_tip4.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip5}>
          <SceneFade duration={SCENES.tip5}>
            <MotionBG src={staticFile("clips_lanhay39_phidiepvang/tip.mp4")} />
            <CineCaption text="Giáng hương, hoa vàng chùm dài, thơm nồng đặc trưng, trồng một cây thơm cả vườn." />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_tip5.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_lanquytoc13/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
