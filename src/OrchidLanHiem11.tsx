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
  title: 203,
  tip1: 209,
  tip2: 217,
  tip3: 208,
  tip4: 193,
  tip5: 220,
  outro: 182,
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
      <MotionBG src={staticFile("clips_lanhay21_caesarred/title.mp4")} dark={0.62} />
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
          Những giống lan này đẹp đến mức dân chơi lâu năm cũng phải xin một cây về trồng.
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
      <MotionBG src={staticFile("clips_lanhay25_vunutethien/outro.mp4")} dark={0.6} />
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
          Bạn ưng giống nào nhất? Comment số thứ tự cho tôi biết nhé!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LANHIEM11_TOTAL_FRAMES = TOTAL;

export const OrchidLanHiem11: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <HookScene />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_title.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip1}>
          <SceneFade duration={SCENES.tip1}>
            <MotionBG src={staticFile("clips_lanhay21_caesarred/tip.mp4")} />
            <CineCaption text="Caesar Red, hoa đỏ tươi như nhung, cánh dày và bền, chơi được cả tuần không tàn." />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_tip1.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip2}>
          <SceneFade duration={SCENES.tip2}>
            <MotionBG src={staticFile("clips_lanhay22_cattleya/tip.mp4")} />
            <CineCaption text="Cattleya, hoa to như bàn tay, màu sắc rực rỡ, mùi thơm ngọt lan khắp nhà." />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_tip2.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip3}>
          <SceneFade duration={SCENES.tip3}>
            <MotionBG src={staticFile("clips_lanhay23_sonthuytien/tip.mp4")} />
            <CineCaption text="Sơn thủy tiên, hoa chùm trắng vàng, dáng rủ mềm mại, thơm dịu rất dễ chịu." />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_tip3.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip4}>
          <SceneFade duration={SCENES.tip4}>
            <MotionBG src={staticFile("clips_lanhay24_hoangthao/tip.mp4")} />
            <CineCaption text="Hoàng thảo, thân dài lá xanh mướt, hoa nở từng đợt suốt mấy tháng liền." />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_tip4.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.tip5}>
          <SceneFade duration={SCENES.tip5}>
            <MotionBG src={staticFile("clips_lanhay25_vunutethien/tip.mp4")} />
            <CineCaption text="Vũ nữ Thái Lan, hoa nhỏ nhưng nở thành chùm dày đặc, màu sắc sặc sỡ như bướm lượn." />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_tip5.mp3")} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene />
          </SceneFade>
          <Audio src={staticFile("audio_lanhiem11/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
