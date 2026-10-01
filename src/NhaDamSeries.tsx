import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Series,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const textShadow = "0 3px 18px rgba(0,0,0,0.95)";
const DEFAULT_PRODUCT = "products/dichnhadam.jpg";

// Hướng D auto-split: tách desc thành các mẩu caption ngắn theo dấu phẩy/chấm,
// gộp lại sao cho mỗi mẩu không quá dài (dễ đọc, hiện 1 mẩu 1 lúc).
const autoChunks = (desc: string): string[] => {
  const MAX = 46; // số ký tự tối đa mỗi mẩu caption
  const parts = desc
    .split(/[,.;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if (!cur) {
      cur = p;
    } else if ((cur + ", " + p).length <= MAX) {
      cur = cur + ", " + p;
    } else {
      out.push(cur);
      cur = p;
    }
  }
  if (cur) out.push(cur);
  return out.length > 0 ? out : [desc];
};

type Colors = {
  accent: string;
  gold: string;
  sub: string;
  badgeText: string;
  bg: string;
  gradient: string; // "r,g,b"
};

type Tip = {
  label: string;
  title: string;
  desc: string;
  descChunks?: string[]; // hướng D: nếu có, hiện lần lượt từng mẩu theo lời đọc (chỉ 1 mẩu 1 lúc). Không có -> dùng desc tĩnh như cũ.
};

export type VideoConfig = {
  slug: string;
  colors: Colors;
  scenes: { title: number; tip1: number; tip2: number; tip3: number; tip4: number; outro: number };
  titleText: string; // may contain \n
  subText: string;
  tips: Tip[]; // exactly 4
  outroText: string; // may contain \n
  product?: string; // product image on title/tip1 (relative to public/), defaults to dichnhadam.jpg
  productOutro?: string; // product image on outro, defaults to product
  productTall?: boolean; // render product image in portrait aspect (for tall bottle/pack shots)
  jarOverlay?: string; // transparent-cutout product jar (PNG w/ alpha) composited into the scene as a real prop
  jarScenes?: Array<"title" | "tip1" | "tip2" | "tip3" | "tip4" | "outro">; // which scenes show the jar overlay
  useImages?: boolean; // background is a static image (images_<slug>/*.jpg + Ken Burns) instead of clips_<slug>/*.mp4
  hideProduct?: boolean; // knowledge video with no product: suppress the product card on title/tip1/outro
  bottleLabels?: { left: string; right: string }; // pin two text badges onto the two bottles in the title clip
};

// Nen dong tu clip .mp4 HOAC anh tinh (Ken Burns) khi useImages=true.
const MotionBG: React.FC<{ src: string; rgb: string; still?: boolean }> = ({ src, rgb, still }) => {
  const frame = useCurrentFrame();
  // Ken Burns nhe: phong to cham tu 1.0 -> 1.12 de anh tinh khong bi "chet".
  const kbScale = still ? interpolate(frame, [0, 300], [1.05, 1.16], { extrapolateRight: "clamp" }) : 1;
  const kbY = still ? interpolate(frame, [0, 300], [0, -30], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill>
      {still ? (
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${kbScale}) translateY(${kbY}px)`,
          }}
        />
      ) : (
        <OffthreadVideo
          src={src}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(${rgb},0) 0%, rgba(${rgb},0) 55%, rgba(${rgb},0.55) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{ duration: number; children: React.ReactNode; fadeIn?: boolean }> = ({
  duration,
  children,
  fadeIn = true,
}) => {
  const frame = useCurrentFrame();
  // fadeIn=false: bat dau sang luon (frame 0 khong bi den -> thumbnail TikTok dep).
  const opacity = fadeIn
    ? interpolate(frame, [0, 12, duration - 12, duration], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [duration - 12, duration], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const ProductCard: React.FC<{ src: string; tall?: boolean }> = ({ src, tall }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const x = interpolate(s, [0, 1], [180, 0]);
  const w = tall ? 240 : 300;
  const h = tall ? 330 : 300;
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        right: 44,
        transform: `translateX(${x}px)`,
        borderRadius: 28,
        overflow: "hidden",
        border: "4px solid rgba(255,255,255,0.9)",
        boxShadow: "0 16px 50px rgba(0,0,0,0.6)",
        background: "#fff",
      }}
    >
      <Img src={src} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
    </div>
  );
};

const TipBadge: React.FC<{ label: string; c: Colors }> = ({ label, c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <div
      style={{
        padding: "14px 40px",
        borderRadius: 60,
        backgroundColor: c.accent,
        color: c.badgeText,
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

// Ghep hu san pham THAT (anh cutout PNG co alpha) vao canh nhu mot prop that.
// Nhan chuan 100% vi dung thang anh, khong phu thuoc AI. Co chuyen dong nhe: troi len + lo lung.
const JarOverlay: React.FC<{ src: string; anchor?: "center" | "bottomRight" | "topRight" }> = ({
  src,
  anchor = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const enterY = interpolate(s, [0, 1], [70, 0]);
  const float = Math.sin(frame / 22) * 10; // lo lung nhe
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const pos =
    anchor === "topRight"
      ? { top: 150, right: 60, height: 520 }
      : anchor === "bottomRight"
      ? { bottom: 340, right: 70, height: 620 }
      : { bottom: 300, left: "50%" as const, marginLeft: -240, height: 760 };
  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        transform: `translateY(${enterY + float}px) scale(${scale})`,
        filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.55))",
      }}
    >
      <Img src={src} style={{ height: "100%", width: "auto", display: "block" }} />
    </div>
  );
};

const TipScene: React.FC<{
  tip: Tip;
  clip: string;
  c: Colors;
  dur: number;
  showProduct?: boolean;
  product: string;
  productTall?: boolean;
  jar?: string;
  still?: boolean;
}> = ({ tip, clip, c, dur, showProduct, product, productTall, jar, still }) => {
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

  // Hướng D: chữ chạy theo lời đọc. Chia đều thời lượng cảnh cho số mẩu,
  // mỗi mẩu fade in/out đúng lượt (chỉ 1 mẩu hiện tại một thời điểm).
  // Nếu tip không khai báo descChunks -> tự tách desc theo dấu câu thành mẩu ngắn.
  const chunks = tip.descChunks ?? autoChunks(tip.desc);
  const DESC_START = 18; // khớp với desc tĩnh, chừa thời gian cho title vào trước
  const FADE = 8;
  let activeChunk: string | null = null;
  let chunkOpacity = 1;
  if (chunks && chunks.length > 0) {
    const span = (dur - DESC_START) / chunks.length;
    const idx = Math.min(chunks.length - 1, Math.max(0, Math.floor((frame - DESC_START) / span)));
    activeChunk = chunks[idx];
    const localStart = DESC_START + idx * span;
    const fadeIn = interpolate(frame, [localStart, localStart + FADE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const isLast = idx === chunks.length - 1;
    const fadeOut = isLast
      ? 1
      : interpolate(frame, [localStart + span - FADE, localStart + span], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
    chunkOpacity = Math.min(fadeIn, fadeOut);
  }

  return (
    <AbsoluteFill>
      <MotionBG src={clip} rgb={c.gradient} still={still} />
      {jar && <JarOverlay src={jar} anchor="topRight" />}
      {showProduct && !jar && !still && <ProductCard src={product} tall={productTall} />}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 90px 200px",
          gap: 36,
        }}
      >
        <TipBadge label={tip.label} c={c} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 72,
            fontWeight: 800,
            color: c.accent,
            textAlign: "center",
            textShadow,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          {tip.title}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 46,
            lineHeight: 1.4,
            color: c.sub,
            textAlign: "center",
            textShadow,
            opacity: chunks && chunks.length > 0 ? chunkOpacity : descOpacity,
            maxWidth: 880,
          }}
        >
          {activeChunk ?? tip.desc}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{ cfg: VideoConfig; product: string; jar?: string }> = ({ cfg, product, jar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11 } });
  const subOpacity = interpolate(frame, [18, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pw = cfg.productTall ? 300 : 340;
  const ph = cfg.productTall ? 410 : 340;
  const still = cfg.useImages === true;
  const showCard = !still && !cfg.hideProduct;
  const bgSrc = still
    ? staticFile(`images_${cfg.slug}/title.jpg`)
    : staticFile(`clips_${cfg.slug}/title.mp4`);
  return (
    <AbsoluteFill>
      <MotionBG src={bgSrc} rgb={cfg.colors.gradient} still={still} />
      {jar && <JarOverlay src={jar} anchor="center" />}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 30 }}
      >
        {showCard && (
        <div
          style={{
            borderRadius: 32,
            overflow: "hidden",
            border: "5px solid rgba(255,255,255,0.92)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.65)",
            background: "#fff",
            transform: `scale(${scale})`,
          }}
        >
          <Img src={product} style={{ width: pw, height: ph, objectFit: "cover", display: "block" }} />
        </div>
        )}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 80,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.12,
            textShadow,
            transform: `scale(${scale})`,
            whiteSpace: "pre-line",
          }}
        >
          {cfg.titleText}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 50,
            fontWeight: 700,
            color: cfg.colors.gold,
            textShadow,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          {cfg.subText}
        </div>
      </AbsoluteFill>
      {cfg.bottleLabels && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 150,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: subOpacity,
              transform: `scale(${scale})`,
            }}
          >
            <BottleLabel text={cfg.bottleLabels.left} bg="rgba(20,14,4,0.92)" fg="#f0d79e" />
            <BottleLabel text={cfg.bottleLabels.right} bg="rgba(214,158,46,0.95)" fg="#2a1c02" />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const BottleLabel: React.FC<{ text: string; bg: string; fg: string }> = ({ text, bg, fg }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 46,
      fontWeight: 800,
      letterSpacing: 2,
      color: fg,
      background: bg,
      padding: "16px 34px",
      borderRadius: 50,
      border: "3px solid rgba(255,255,255,0.85)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    }}
  >
    {text}
  </div>
);

const OutroScene: React.FC<{ cfg: VideoConfig; product: string }> = ({ cfg, product }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 13 } });
  const pw = cfg.productTall ? 300 : 340;
  const ph = cfg.productTall ? 410 : 340;
  const still = cfg.useImages === true;
  const showCard = !still && !cfg.hideProduct;
  const bgSrc = still
    ? staticFile(`images_${cfg.slug}/outro.jpg`)
    : staticFile(`clips_${cfg.slug}/outro.mp4`);
  return (
    <AbsoluteFill>
      <MotionBG src={bgSrc} rgb={cfg.colors.gradient} still={still} />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 34, padding: 80 }}
      >
        {showCard && (
        <div
          style={{
            borderRadius: 32,
            overflow: "hidden",
            border: "5px solid rgba(255,255,255,0.92)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.65)",
            background: "#fff",
            transform: `scale(${scale})`,
          }}
        >
          <Img src={product} style={{ width: pw, height: ph, objectFit: "cover", display: "block" }} />
        </div>
        )}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 66,
            fontWeight: 800,
            color: cfg.colors.accent,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow,
            transform: `scale(${scale})`,
            whiteSpace: "pre-line",
          }}
        >
          {cfg.outroText}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const totalFrames = (cfg: VideoConfig) =>
  Object.values(cfg.scenes).reduce((a, b) => a + b, 0);

export const makeOrchidVideo = (cfg: VideoConfig): React.FC => () => {
  const s = cfg.scenes;
  const product = staticFile(cfg.product ?? DEFAULT_PRODUCT);
  const productOutro = staticFile(cfg.productOutro ?? cfg.product ?? DEFAULT_PRODUCT);
  const jar = cfg.jarOverlay ? staticFile(cfg.jarOverlay) : undefined;
  const jarScenes = cfg.jarScenes ?? [];
  return (
    <AbsoluteFill style={{ backgroundColor: cfg.colors.bg }}>
      <Series>
        <Series.Sequence durationInFrames={s.title}>
          <SceneFade duration={s.title} fadeIn={false}>
            <TitleScene cfg={cfg} product={product} jar={jarScenes.includes("title") ? jar : undefined} />
          </SceneFade>
          <Audio src={staticFile(`audio_${cfg.slug}/vo_title.mp3`)} />
        </Series.Sequence>

        {cfg.tips.map((tip, i) => {
          const dur = [s.tip1, s.tip2, s.tip3, s.tip4][i];
          const tipKey = `tip${i + 1}` as "tip1" | "tip2" | "tip3" | "tip4";
          return (
            <Series.Sequence key={i} durationInFrames={dur}>
              <SceneFade duration={dur}>
                <TipScene
                  tip={tip}
                  clip={
                    cfg.useImages
                      ? staticFile(`images_${cfg.slug}/tip${i + 1}.jpg`)
                      : staticFile(`clips_${cfg.slug}/tip${i + 1}.mp4`)
                  }
                  c={cfg.colors}
                  dur={dur}
                  showProduct={i === 0 && !cfg.hideProduct}
                  product={product}
                  productTall={cfg.productTall}
                  jar={jarScenes.includes(tipKey) ? jar : undefined}
                  still={cfg.useImages === true}
                />
              </SceneFade>
              <Audio src={staticFile(`audio_${cfg.slug}/vo_tip${i + 1}.mp3`)} />
            </Series.Sequence>
          );
        })}

        <Series.Sequence durationInFrames={s.outro}>
          <SceneFade duration={s.outro}>
            <OutroScene cfg={cfg} product={productOutro} />
          </SceneFade>
          <Audio src={staticFile(`audio_${cfg.slug}/vo_outro.mp3`)} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
