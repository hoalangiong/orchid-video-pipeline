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
  accent: "#ffb3d9",
  gold: "#ffd24a",
  text: "#ffffff",
  sub: "#ffe8f3",
};

const FONT = "'Segoe UI', Arial, sans-serif";

// Thoi luong tung canh (frames @30fps), dat dai hon voiceover ~2.5-3s
const SCENES = {
  title: 255,
  tip1: 255,
  tip2: 285,
  tip3: 270,
  tip4: 255,
  tip5: 270,
  outro: 240,
};
const TOTAL =
  SCENES.title +
  SCENES.tip1 +
  SCENES.tip2 +
  SCENES.tip3 +
  SCENES.tip4 +
  SCENES.tip5 +
  SCENES.outro;

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
            "linear-gradient(180deg, rgba(20,6,16,0.35) 0%, rgba(20,6,16,0.15) 40%, rgba(20,6,16,0.78) 100%)",
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
        color: "#2a0b20",
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
      <KenBurns src={staticFile("images_kichhoa/title.jpg")} dir={1} duration={duration} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 34,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>🌺</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.15,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          MẸO KÍCH HOA LAN
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.gold,
            textShadow,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          Ép lan sai bông đúng dịp
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
      <KenBurns src={staticFile("images_kichhoa/outro.jpg")} dir={-1} duration={duration} />
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
          Chúc vườn lan{"\n"}sai hoa rực rỡ! 🌸
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
    title: "Cắt nước tạo sốc",
    desc: "Ngưng tưới 7-10 ngày, để cây chuyển từ nuôi thân sang làm nụ.",
    img: "images_kichhoa/tip1.jpg",
    vo: "audio_kichhoa/vo_tip1.mp3",
    dur: SCENES.tip1,
    dir: 1,
  },
  {
    title: "Tăng lân - kali",
    desc: "Đổi sang phân lân cao (NPK 10-30-20) để kích nụ hoa.",
    img: "images_kichhoa/tip2.jpg",
    vo: "audio_kichhoa/vo_tip2.mp3",
    dur: SCENES.tip2,
    dir: -1,
  },
  {
    title: "Chênh lệch nhiệt ngày/đêm",
    desc: "Đưa lan ra nơi đêm mát, ngày ấm để đánh thức mắt hoa.",
    img: "images_kichhoa/tip3.jpg",
    vo: "audio_kichhoa/vo_tip3.mp3",
    dur: SCENES.tip3,
    dir: 1,
  },
  {
    title: "Tăng nắng nhẹ",
    desc: "Cho lan đón nắng sớm nhiều hơn, đủ sáng hoa mới trổ đều.",
    img: "images_kichhoa/tip4.jpg",
    vo: "audio_kichhoa/vo_tip4.mp3",
    dur: SCENES.tip4,
    dir: -1,
  },
  {
    title: "Ngưng đạm khi ra vòi",
    desc: "Khi cây ra vòi, giảm đạm, giữ ẩm ổn định để hoa nở đẹp.",
    img: "images_kichhoa/tip5.jpg",
    vo: "audio_kichhoa/vo_tip5.mp3",
    dur: SCENES.tip5,
    dir: 1,
  },
];

export const BLOOM_TOTAL_FRAMES = TOTAL;

export const OrchidBloomTips: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#140610" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <TitleScene duration={SCENES.title} />
          <Audio src={staticFile("audio_kichhoa/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_kichhoa/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
