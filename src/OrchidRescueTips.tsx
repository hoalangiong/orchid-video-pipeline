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
  accent: "#7fe3a0",
  gold: "#ffd24a",
  text: "#ffffff",
  sub: "#dff5e6",
};

const FONT = "'Segoe UI', Arial, sans-serif";

// Nhip nhanh: moi canh = voiceover + ~1.6s. 8 canh.
const SCENES = {
  title: 225,
  tip1: 219,
  tip2: 186,
  tip3: 183,
  tip4: 192,
  tip5: 210,
  tip6: 222,
  outro: 180,
};
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

const KenBurns: React.FC<{ src: string; dir: number; duration: number }> = ({
  src,
  dir,
  duration,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.1, 1.26]);
  const tx = interpolate(frame, [0, duration], [0, 26 * dir]);
  const ty = interpolate(frame, [0, duration], [0, -16]);
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
            "linear-gradient(180deg, rgba(4,16,9,0.32) 0%, rgba(4,16,9,0.12) 40%, rgba(4,16,9,0.8) 100%)",
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
  img: string;
  duration: number;
  dir: number;
}> = ({ n, title, desc, img, duration, dir }) => {
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

const TitleScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11 } });
  const subOpacity = interpolate(frame, [18, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <KenBurns src={staticFile("images_cuulan/title.jpg")} dir={1} duration={duration} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 110, textShadow }}>🌱</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 94,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          CỨU GIÒ LAN{"\n"}SẮP CHẾT
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
          6 bước hồi sinh lan thối rễ
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const ctaOpacity = interpolate(frame, [20, 44], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <KenBurns src={staticFile("images_cuulan/outro.jpg")} dir={-1} duration={duration} />
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
          Cứu lan thành công! 🌿
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            color: COLORS.sub,
            textShadow,
            opacity: ctaOpacity,
          }}
        >
          Lưu lại để dùng khi cần nhé! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    title: "Cắt bỏ phần hỏng",
    desc: "Dùng kéo sạch cắt hết rễ thối, lá vàng, chỉ giữ phần khỏe.",
    img: "images_cuulan/tip1.jpg",
    vo: "audio_cuulan/vo_tip1.mp3",
    dur: SCENES.tip1,
    dir: 1,
  },
  {
    title: "Ngâm sát khuẩn",
    desc: "Ngâm cây vào dung dịch kích rễ pha thuốc nấm, diệt mầm bệnh.",
    img: "images_cuulan/tip2.jpg",
    vo: "audio_cuulan/vo_tip2.mp3",
    dur: SCENES.tip2,
    dir: -1,
  },
  {
    title: "Treo cho khô",
    desc: "Treo ngược cây nơi thoáng mát, tránh nắng, cho vết cắt khô.",
    img: "images_cuulan/tip3.jpg",
    vo: "audio_cuulan/vo_tip3.mp3",
    dur: SCENES.tip3,
    dir: 1,
  },
  {
    title: "Ghép giá thể mới",
    desc: "Ghép lên dớn hoặc vỏ thông sạch, thoát nước thật tốt.",
    img: "images_cuulan/tip4.jpg",
    vo: "audio_cuulan/vo_tip4.mp3",
    dur: SCENES.tip4,
    dir: -1,
  },
  {
    title: "Giữ ẩm, đừng tưới đẫm",
    desc: "Chỉ phun sương nhẹ mỗi ngày, tuyệt đối không tưới sũng.",
    img: "images_cuulan/tip5.jpg",
    vo: "audio_cuulan/vo_tip5.mp3",
    dur: SCENES.tip5,
    dir: 1,
  },
  {
    title: "Chờ rễ mới",
    desc: "Vài tuần sau, rễ trắng và mầm non nhú lên là cứu thành công.",
    img: "images_cuulan/tip6.jpg",
    vo: "audio_cuulan/vo_tip6.mp3",
    dur: SCENES.tip6,
    dir: -1,
  },
];

export const RESCUE_TOTAL_FRAMES = TOTAL;

export const OrchidRescueTips: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#041009" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene duration={SCENES.title} />
          </SceneFade>
          <Audio src={staticFile("audio_cuulan/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_cuulan/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
