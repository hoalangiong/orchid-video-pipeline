// Video có MC Vy dẫn chương trình.
//
// ĐÂY LÀ MỤC RIÊNG, KHÔNG dùng chung với video lan (NhaDamSeries.tsx). Chủ shop đã
// dặn tách ra. Sửa file này không ảnh hưởng 156 config lan đang chạy, và ngược lại.
//
// MC Vy là clip nền xanh ở hlglive/_ref/host_clips/c1_*_green.mp4, đã tách nền sang
// WebM alpha (VP9) đặt ở public/mc_vy/{talking,idle}.webm. Chromium giải mã được alpha
// này; ffmpeg thì KHÔNG (ffprobe báo yuv420p, decode ra đen) nên đừng dùng ffmpeg để
// kiểm tra độ trong suốt - phải render thật rồi coi frame.
//
// MC CHỈ hiện khi cờ mcVy = true. Mặc định tắt.

import {
  AbsoluteFill,
  Audio,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

/** Thứ tự cảnh, khớp tên file TTS (vo_title, vo_tip1..4, vo_outro) để dùng lại
 *  đúng bộ máy tạo giọng + _scenes.json của web app, không phải viết mới. */
export const MCVY_KEYS = ["title", "tip1", "tip2", "tip3", "tip4", "outro"] as const;
export type McVyKey = (typeof MCVY_KEYS)[number];

export interface McVyConfig {
  slug: string;
  /** Chữ trên khung của từng cảnh. Cảnh nào để trống thì không hiện chữ. */
  captions: Partial<Record<McVyKey, string>>;
  /** Số frame mỗi cảnh. Web app ghi đè bằng số đo từ giọng đọc thật. */
  scenes: Partial<Record<McVyKey, number>>;
  colors: {
    accent: string;
    sub: string;
    bg: string;
  };
  /** Chế độ "1 video": mọi cảnh dùng chung một clip nền ở single_<slug>/bg.mp4,
   *  thay vì 6 clip rời trong clips_<slug>/. Dùng cho mục nhập video của người dùng. */
  bgSingle?: boolean;
  /** Số frame của clip nền đó (server đo bằng ffprobe). Clip ngắn hơn cảnh thì lặp lại. */
  bgFrames?: number;
  /** Tên file ảnh phủ lên clip nền, nằm ở single_<slug>/. Server ghi tên vào đây. */
  overlay?: string;
  /** Độ đục ảnh phủ tính theo %: càng nhỏ càng thấy rõ video gốc. Mặc định 35. */
  overlayOpacity?: number;
  // --- MC Vy: chỉ bật khi người dùng chọn ---
  mcVy?: boolean;
  /** talking = đang nói (mặc định), idle = đứng im */
  mcPose?: "talking" | "idle";
  /** Chiều cao MC tính theo % chiều cao khung. Mặc định 42: khung clip MC giờ cắt
   *  bán thân sát người nên 62 như trước ra cô MC to quá nửa khung. */
  mcHeight?: number;
  mcSide?: "left" | "right" | "center";
  /** Chọn MC nào: khoá trong MC_OPTIONS bên dưới. Mặc định "vy". */
  mcId?: string;
}

const FPS = 30;
/** Clip MC gốc 7,2s; cắt còn 7,0s cho chắc rồi lặp lại nếu cảnh dài hơn. */
const MC_LOOP_FRAMES = 7 * FPS;

/** Các MC chọn được. Thêm MC mới = thêm một dòng ở đây + một nút trong web/index.html.
 *  kind "clip" = clip WebM alpha, có hai tư thế talking/idle, miệng mấp máy như đang nói.
 *  kind "image" = ảnh PNG trong suốt, đứng im — ảnh tĩnh nên không có tư thế để chọn.
 *  File nào cũng nằm ở public/mc_vy/ (mcvyQueue tự sao cả thư mục này vào bundle). */
export const MC_OPTIONS: Record<
  string,
  { label: string; kind: "clip" | "image"; file?: string }
> = {
  vy: { label: "Vy (người thật)", kind: "clip" },
  chibi: { label: "Bé Na (hoạt hình)", kind: "image", file: "chibi.png" },
};

export const mcVyTotalFrames = (cfg: McVyConfig): number =>
  MCVY_KEYS.reduce((sum, k) => sum + (cfg.scenes[k] ?? 0), 0);

const McOverlay: React.FC<{ cfg: McVyConfig }> = ({ cfg }) => {
  // Gọi hook TRƯỚC khi return null, không thì React báo lỗi gọi hook có điều kiện.
  const frame = useCurrentFrame();
  if (!cfg.mcVy) return null;

  const mc = MC_OPTIONS[cfg.mcId ?? "vy"] ?? MC_OPTIONS.vy;
  const pose = cfg.mcPose ?? "talking";
  const heightPct = cfg.mcHeight ?? 42;
  const side = cfg.mcSide ?? "left";

  const horizontal =
    side === "center"
      ? { left: "50%", transform: "translateX(-50%)" }
      // Sat mep, khong day am nua: khung clip da cat sat nguoi (440x780) nen day am
      // 6% la cat mat canh tay. Hoi truoc khung rong 700px con nen hai ben, day am
      // de che rac thi hop ly.
      : side === "left"
        ? { left: 0 }
        : { right: 0 };

  const style: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    height: `${heightPct}%`,
    width: "auto",
    objectFit: "contain",
    ...horizontal,
  };

  // MC ảnh: không có tư thế nên không cần Loop (ảnh tĩnh thì lặp cái gì), nhưng để
  // đứng im hoàn toàn thì trông như dán hình chết lên video. Cho thở nhẹ:
  //   - nhấp nhô 7px theo nhịp 3,2s = hít vào thở ra
  //   - nghiêng người 0,8 độ theo nhịp 6,4s = dồn trọng lượng sang chân này chân kia
  // Hai nhịp lệch nhau (3,2 và 6,4) cho đỡ máy móc; cùng nhịp là thấy giả liền.
  // Quay quanh đáy khung (50% 100%) để chân đứng yên tại chỗ, chỉ thân trên nghiêng.
  // Đặt transform ở lớp bọc, không đặt vào ảnh, vì ảnh đã dùng transform riêng để
  // canh giữa (translateX(-50%)) - ghi đè lên là MC nhảy lệch sang phải.
  if (mc.kind === "image") {
    const giay = frame / FPS;
    const thoY = Math.sin((giay / 3.2) * 2 * Math.PI) * 7;
    const lac = Math.sin((giay / 6.4) * 2 * Math.PI) * 0.8;
    return (
      <AbsoluteFill
        style={{
          transform: `translateY(${thoY}px) rotate(${lac}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <Img src={staticFile(`mc_vy/${mc.file}`)} style={style} />
      </AbsoluteFill>
    );
  }

  return (
    <Loop durationInFrames={MC_LOOP_FRAMES}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(`mc_vy/${pose}.webm`)}
          transparent
          muted
          style={style}
        />
      </AbsoluteFill>
    </Loop>
  );
};

const Scene: React.FC<{ cfg: McVyConfig; sceneKey: McVyKey }> = ({ cfg, sceneKey }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cfg.colors.bg }}>
      {/* Hình nền: clip của cảnh này, hoặc clip đơn dùng chung cho cả video */}
      {cfg.bgSingle ? (
        <Loop durationInFrames={Math.max(30, cfg.bgFrames ?? 300)}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile(`single_${cfg.slug}/bg.mp4`)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </Loop>
      ) : (
        <OffthreadVideo
          src={staticFile(`clips_${cfg.slug}/${sceneKey}.mp4`)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* Ảnh phủ lên clip nền. Giảm độ đục để vẫn thấy video gốc xuyên qua. */}
      {cfg.overlay ? (
        <Img
          src={staticFile(`single_${cfg.slug}/${cfg.overlay}`)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: (cfg.overlayOpacity ?? 35) / 100,
          }}
        />
      ) : null}

      <McOverlay cfg={cfg} />

      <Audio src={staticFile(`audio_${cfg.slug}/vo_${sceneKey}.mp3`)} />
    </AbsoluteFill>
  );
};

export const McVyVideo: React.FC<{ config: McVyConfig }> = ({ config }) => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: config.colors.bg }}>
      {MCVY_KEYS.map((k) => {
        const len = config.scenes[k] ?? 0;
        if (len <= 0) return null;
        const el = (
          <Sequence key={k} from={from} durationInFrames={len}>
            <Scene cfg={config} sceneKey={k} />
          </Sequence>
        );
        from += len;
        return el;
      })}
    </AbsoluteFill>
  );
};
