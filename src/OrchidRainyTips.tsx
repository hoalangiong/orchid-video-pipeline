import {
  AbsoluteFill,
  Audio,
  Img,
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

// Thoi luong tung canh (frames @30fps), dat dai hon voiceover ~1.3s
const SCENES = {
  title: 210,
  tip1: 225,
  tip2: 225,
  tip3: 225,
  tip4: 225,
  tip5: 210,
  outro: 195,
};
const TOTAL =
  SCENES.title +
  SCENES.tip1 +
  SCENES.tip2 +
  SCENES.tip3 +
  SCENES.tip4 +
  SCENES.tip5 +
  SCENES.outro;

// Anh nen voi hieu ung Ken Burns (zoom + pan cham) + lop toi de chu de doc
const KenBurns: React.FC<{ src: string; dir: number; duration: number }> = ({
  src,
  dir,
  duration,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.08, 1.22]);
  const tx = interpolate(frame, [0, duration], [0, 24 * dir]);
  const ty = interpolate(frame, [0, duration], [0, -18]);
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,12,0.35) 0%, rgba(6,20,12,0.15) 40%, rgba(6,20,12,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Fade in/out cho toan bo canh
const SceneFade: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 15, duration - 15, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const TipBadge: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
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

const textShadow = "0 3px 18px rgba(0,0,0,0.85)";

const TipScene: React.FC<{
  n: number;
  title: string;
  desc: string;
  img: string;
  duration: number;
  dir: number;
}> = ({ n, title, desc, img, duration, dir }) => {
  const frame = useCurrentFrame();
  const titleY = interpolate(frame, [10, 30], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const descOpacity = interpolate(frame, [26, 46], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill>
      <KenBurns src={img} dir={dir} duration={duration} />
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
            maxWidth: 860,
          }}
        >
          {desc}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const subOpacity = interpolate(frame, [24, 50], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <KenBurns src={staticFile("images/title.jpg")} dir={1} duration={duration} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 34,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🌸</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.15,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          CHĂM SÓC HOA LAN{"\n"}MÙA MƯA BÃO
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.gold,
            textShadow,
            opacity: subOpacity,
          }}
        >
          5 tip giữ lan luôn khỏe
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const handleOpacity = interpolate(frame, [28, 54], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <KenBurns src={staticFile("images/outro.jpg")} dir={-1} duration={duration} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
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
          Chúc vườn lan{"\n"}luôn xanh tốt! 🌿
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            color: COLORS.sub,
            textShadow,
            opacity: handleOpacity,
          }}
        >
          Theo dõi @nongdanai.hoalangiong
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    title: "Che chắn mưa",
    desc: "Lắp mái che hoặc lưới, tránh mưa xối trực tiếp làm dập lá và thối ngọn.",
    img: "images/tip1.jpg",
    vo: "audio/vo_tip1.mp3",
    dur: SCENES.tip1,
    dir: 1,
  },
  {
    title: "Giảm tưới nước",
    desc: "Mùa mưa độ ẩm cao, hãy ngưng hoặc giảm tưới để rễ không bị úng.",
    img: "images/tip2.jpg",
    vo: "audio/vo_tip2.mp3",
    dur: SCENES.tip2,
    dir: -1,
  },
  {
    title: "Tăng thông thoáng",
    desc: "Treo giò thưa ra, bật quạt gió cho lá mau khô, chặn nấm bệnh.",
    img: "images/tip3.jpg",
    vo: "audio/vo_tip3.mp3",
    dur: SCENES.tip3,
    dir: 1,
  },
  {
    title: "Phòng nấm khuẩn",
    desc: "Phun thuốc phòng nấm định kỳ 7-10 ngày một lần, nhất là sau mưa lớn.",
    img: "images/tip4.jpg",
    vo: "audio/vo_tip4.mp3",
    dur: SCENES.tip4,
    dir: -1,
  },
  {
    title: "Kiểm tra giá thể",
    desc: "Đảm bảo chậu thoát nước tốt, thay ngay giá thể đã mục nát.",
    img: "images/tip5.jpg",
    vo: "audio/vo_tip5.mp3",
    dur: SCENES.tip5,
    dir: 1,
  },
];

export const ORCHID_TOTAL_FRAMES = TOTAL;

export const OrchidRainyTips: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#06140c" }}>
      {/* Nhac nen chay xuyen suot */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={0.35} />

      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <TitleScene duration={SCENES.title} />
          <Audio src={staticFile("audio/vo_title.mp3")} />
        </Series.Sequence>

        {TIPS.map((tip, i) => (
          <Series.Sequence key={i} durationInFrames={tip.dur}>
            <SceneFade duration={tip.dur}>
              <TipScene
                n={i + 1}
                title={tip.title}
                desc={tip.desc}
                img={staticFile(tip.img)}
                duration={tip.dur}
                dir={tip.dir}
              />
            </SceneFade>
            <Audio src={staticFile(tip.vo)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneFade duration={SCENES.outro}>
            <OutroScene duration={SCENES.outro} />
          </SceneFade>
          <Audio src={staticFile("audio/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
