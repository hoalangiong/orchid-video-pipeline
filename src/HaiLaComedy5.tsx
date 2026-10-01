import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const FPS = 30;

type Line = { speaker: "TU" | "BO"; start: number; end: number; text: string };

const LINES: Line[] = [
  { speaker: "TU", start: 0.0, end: 7.94, text: "Ối trời đất ơi Bo! Lan mới tàn bông mày cắt trụi lủi cả cây vầy hả? Cắt luôn giả hành xanh là cây lấy gì mà sống con!" },
  { speaker: "BO", start: 8.29, end: 14.85, text: "Ủa chú Tư! Con thấy hoa tàn rồi thì cắt hết cho gọn, để chi mấy cái cành cũ nhìn xấu hoắc à!" },
  { speaker: "TU", start: 15.2, end: 22.9, text: "Bậy nào! Giả hành còn xanh là kho lương thực của cây đó con! Cắt nó đi là cây đói lả, năm sau khỏi ra hoa luôn!" },
  { speaker: "BO", start: 23.25, end: 27.93, text: "Á… vậy chớ con phải cắt cái gì? Chẳng lẽ để nguyên hết trơn hả chú?" },
  { speaker: "TU", start: 28.28, end: 35.17, text: "Chỉ cắt cái vòi hoa đã khô thôi con! Còn giả hành nào vàng khô teo tóp rồi thì mới cắt sát gốc, bỏ đi!" },
  { speaker: "BO", start: 35.52, end: 41.34, text: "Hèn chi… con cắt cả đám xanh mướt, giờ cây còi cọc không thèm nhú mầm nào, tức ghê chú ơi!" },
  { speaker: "TU", start: 41.69, end: 49.18, text: "Đó! Với lại dao kéo phải hơ lửa hay lau cồn khử trùng nghe con. Cắt bằng dao dơ là rước bệnh vô cây liền!" },
  { speaker: "BO", start: 49.53, end: 56.56, text: "Dạ dạ con hiểu rồi! Chỉ cắt vòi khô với giả hành teo, chừa đồ xanh lại, dao phải khử trùng đúng hông chú?" },
  { speaker: "TU", start: 56.91, end: 64.23, text: "Ngoan! Nhớ nè: giả hành xanh là để dành, đừng thấy tàn hoa mà cắt sạch, cắt bậy là cây giận không nở nữa đó con!" },
  { speaker: "BO", start: 64.58, end: 72.96, text: "Hi hi! Còn các bạn thì sao? Sau khi lan tàn bông có ai cắt trụi như con hông? Kể chú Tư nghe với, comment liền nha!" },
];

export const HAILA5_TOTAL_FRAMES = 2182;

export const HaiLaComedy5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = (() => {
    let found = 0;
    for (let i = 0; i < LINES.length; i++) {
      if (t >= LINES[i].start) found = i;
    }
    return found;
  })();
  const cur = LINES[idx];

  const localT = t - cur.start;
  const pop = interpolate(localT, [0, 0.25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("audio_haila5/bg_multi.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.04)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)" }} />

      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 66,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.32,
            textShadow: "0 3px 18px rgba(0,0,0,0.95)",
            background: "rgba(0,0,0,0.55)",
            padding: "28px 34px",
            borderRadius: 26,
            transform: `scale(${pop})`,
          }}
        >
          {cur.text}
        </div>
      </div>

      <Audio src={staticFile("audio_haila5/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
