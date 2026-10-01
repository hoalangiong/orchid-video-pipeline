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
  { speaker: "TU", start: 0.0, end: 7.49, text: "Bo ơi! Nắng hè gay gắt bốn chục độ mà mày để giàn lan phơi trần hứng trọn, cháy lá teo củ hết cả giàn con ơi!" },
  { speaker: "BO", start: 7.84, end: 15.2, text: "Ủa chú Tư! Mùa hè nắng nhiều cây quang hợp mạnh chớ, con để phơi cho nó ăn nắng thả ga, mắc gì phải che hả chú!" },
  { speaker: "TU", start: 15.55, end: 23.79, text: "Bậy nào! Nắng hè giữa trưa nó nướng chín lá con. Phải căng thêm lớp lưới che, tăng tưới giữ mát, chớ phơi trần là toi!" },
  { speaker: "BO", start: 24.14, end: 31.37, text: "Á… vậy mùa hè chăm khác mùa thường sao hả chú? Con tưởng mùa nào cũng chăm y chang, nắng thì càng khỏe chớ bộ!" },
  { speaker: "TU", start: 31.72, end: 39.19, text: "Trời đất! Hè nóng thì che lưới dày hơn, tưới sáng sớm với chiều mát cho hạ nhiệt, phun sương quanh giàn cho đỡ hầm con!" },
  { speaker: "BO", start: 39.54, end: 47.58, text: "Hèn chi… trưa hè giàn con nóng như lò, lá cháy nám cong queo, củ thì teo tóp lại, thảo nào cây đứng hình hà chú ơi!" },
  { speaker: "TU", start: 47.93, end: 55.97, text: "Đúng rồi đó! Nóng quá cây ngừng phát triển, đừng bón phân nặng lúc đỉnh nắng. Che mát giữ ẩm cho nó vượt qua mùa hè con!" },
  { speaker: "BO", start: 56.32, end: 64.42, text: "Dạ dạ con hiểu rồi! Hè thì che lưới dày, tưới sáng chiều, phun sương hạ nhiệt, ngưng phân nặng chớ hổng phơi trần nữa đâu chú!" },
  { speaker: "TU", start: 64.77, end: 72.88, text: "Ngoan! Nhớ nè: mùa hè là cứu cây khỏi nắng, che mát đủ nước thì cây vượt nóng. Phơi trần bỏ mặc là cháy sạch cả giàn con!" },
  { speaker: "BO", start: 73.23, end: 82.98, text: "Hi hi! Còn các bạn thì sao? Mùa hè nhà mình chống nắng cho lan kiểu gì, che lưới mấy lớp? Kể chú Tư với con nghe với nha, comment liền nào!" },
];

export const HAILA17_TOTAL_FRAMES = 2490;

export const HaiLaComedy17: React.FC = () => {
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
          src={staticFile("audio_haila17/bg_multi.mp4")}
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

      <Audio src={staticFile("audio_haila17/vo_full.mp3")} />
    </AbsoluteFill>
  );
};
