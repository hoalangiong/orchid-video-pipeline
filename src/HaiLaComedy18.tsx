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
  { speaker: "TU", start: 0.0, end: 7.42, text: "Bo ơi! Mùa mưa dầm dề mà mày cứ để lan hứng nước xối xả suốt ngày đêm, thúi nhũn cả giàn giờ mới cuống con ơi!" },
  { speaker: "BO", start: 7.77, end: 15.0, text: "Ủa chú Tư! Trời mưa khỏi tưới đỡ mệt, nước mưa mát cây thích lắm, con để nó tắm mưa thả ga chớ sao đâu chú!" },
  { speaker: "TU", start: 15.35, end: 23.18, text: "Bậy nào! Mưa dầm nước đọng úng gốc, ẩm cao lại bí gió là ổ bệnh thúi nhũn. Phải che bớt mưa cho giàn con nghe chưa!" },
  { speaker: "BO", start: 23.53, end: 31.26, text: "Á… vậy mùa mưa chăm khác sao hả chú? Con tưởng khỏi tưới là khỏe re, mưa lo gì, để trời lo hết cho mình chớ!" },
  { speaker: "TU", start: 31.61, end: 39.58, text: "Trời đất! Mùa mưa phải che mái cho tạnh bớt, ngưng tưới thêm, xịt phòng nấm khuẩn dày hơn, giàn treo cao cho thoát nước con!" },
  { speaker: "BO", start: 39.93, end: 47.71, text: "Hèn chi… mưa xong giàn con nước đọng cả vũng, gốc lúc nào cũng sũng, đọt thúi đen thui cả loạt, thảo nào hà chú ơi!" },
  { speaker: "TU", start: 48.06, end: 56.32, text: "Đúng rồi đó! Mưa dầm là bớt hoặc ngưng phân, nhớ xịt phòng bệnh sau mưa. Thấy đọt thúi là cắt liền kẻo lây cả giàn con!" },
  { speaker: "BO", start: 56.67, end: 65.21, text: "Dạ dạ con hiểu rồi! Mùa mưa che mái, ngưng tưới, xịt phòng dày, treo cao thoát nước chớ hổng cho tắm mưa thả ga nữa đâu chú!" },
  { speaker: "TU", start: 65.56, end: 73.84, text: "Ngoan! Nhớ nè: mùa mưa là mùa bệnh, che chắn phòng xa thì cây qua mưa vẫn khỏe. Phó mặc trời mưa là thúi sạch cả giàn con!" },
  { speaker: "BO", start: 74.19, end: 83.67, text: "Hi hi! Còn các bạn thì sao? Mùa mưa nhà mình chăm lan kiểu gì, có che mưa không? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA18_TOTAL_FRAMES = 2511;

export const HaiLaComedy18: React.FC = () => {
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
          src={staticFile("audio_haila18/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila18/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
