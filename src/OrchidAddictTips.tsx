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
  accent: "#ffe14a",
  gold: "#ff8a3d",
  text: "#ffffff",
  sub: "#fff2cc",
};

const FONT = "'Segoe UI', Arial, sans-serif";

// Nhip nhanh: moi canh = voiceover + ~1.7s. 8 canh.
const SCENES = {
  title: 225,
  tip1: 186,
  tip2: 204,
  tip3: 207,
  tip4: 165,
  tip5: 165,
  tip6: 195,
  outro: 174,
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
            "linear-gradient(180deg, rgba(10,8,2,0.3) 0%, rgba(10,8,2,0.12) 40%, rgba(10,8,2,0.78) 100%)",
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
        color: "#2a1500",
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
      <KenBurns src={staticFile("images_nghien/title.jpg")} dir={1} duration={duration} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 30,
        }}
      >
        <div style={{ fontSize: 120, textShadow }}>😍</div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 800,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          6 DẤU HIỆU BẠN{"\n"}ĐÃ NGHIỆN LAN
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 50,
            fontWeight: 700,
            color: COLORS.accent,
            textShadow,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          Trúng hết là "hết thuốc chữa" 😂
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const handleOpacity = interpolate(frame, [20, 44], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <KenBurns src={staticFile("images_nghien/outro.jpg")} dir={-1} duration={duration} />
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
            fontSize: 74,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow,
            transform: `scale(${scale})`,
          }}
        >
          Bạn trúng mấy{"\n"}dấu hiệu? 😆
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
          Comment số của bạn nhé! 👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TIPS = [
  {
    title: "Điện thoại toàn ảnh lan",
    desc: "Hàng nghìn tấm ảnh, mà 90% là chụp lan.",
    img: "images_nghien/tip1.jpg",
    vo: "audio_nghien/vo_tip1.mp3",
    dur: SCENES.tip1,
    dir: 1,
  },
  {
    title: "Thấy lan là không cưỡng được",
    desc: "Đi qua vườn lan kiểu gì cũng rước thêm một giò.",
    img: "images_nghien/tip2.jpg",
    vo: "audio_nghien/vo_tip2.mp3",
    dur: SCENES.tip2,
    dir: -1,
  },
  {
    title: "Dậy sớm chỉ để ngắm lan",
    desc: "Việc đầu tiên buổi sáng là chạy ra ngắm lan.",
    img: "images_nghien/tip3.jpg",
    vo: "audio_nghien/vo_tip3.mp3",
    dur: SCENES.tip3,
    dir: 1,
  },
  {
    title: "Nói chuyện với lan nhiều hơn",
    desc: "Tâm sự với lan còn nhiều hơn với người yêu.",
    img: "images_nghien/tip4.jpg",
    vo: "audio_nghien/vo_tip4.mp3",
    dur: SCENES.tip4,
    dir: -1,
  },
  {
    title: "Ví cạn, giàn lan dài thêm",
    desc: "Tiền thì hết, mà giàn lan cứ dài ra mãi.",
    img: "images_nghien/tip5.jpg",
    vo: "audio_nghien/vo_tip5.mp3",
    dur: SCENES.tip5,
    dir: 1,
  },
  {
    title: "Chỗ nào trống là nhét lan",
    desc: "Ban công, sân nhà, chỗ nào trống là có lan.",
    img: "images_nghien/tip6.jpg",
    vo: "audio_nghien/vo_tip6.mp3",
    dur: SCENES.tip6,
    dir: -1,
  },
];

export const ADDICT_TOTAL_FRAMES = TOTAL;

export const OrchidAddictTips: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0802" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.title}>
          <SceneFade duration={SCENES.title}>
            <TitleScene duration={SCENES.title} />
          </SceneFade>
          <Audio src={staticFile("audio_nghien/vo_title.mp3")} />
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
          <Audio src={staticFile("audio_nghien/vo_outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
