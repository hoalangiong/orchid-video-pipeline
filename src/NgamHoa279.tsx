import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FONT = "'Segoe UI', Arial, sans-serif";
const FPS = 30;
const DIR = "audio_ngamhoa279";
const CLIPDIR = "clips_ngamhoa279";
const GAP = 0.35;

const OUTLINE =
  "2px 0 0 rgba(0,0,0,0.96), -2px 0 0 rgba(0,0,0,0.96), 0 2px 0 rgba(0,0,0,0.96), 0 -2px 0 rgba(0,0,0,0.96), 2px 2px 0 rgba(0,0,0,0.96), -2px -2px 0 rgba(0,0,0,0.96), 2px -2px 0 rgba(0,0,0,0.96), -2px 2px 0 rgba(0,0,0,0.96), 0 5px 22px rgba(0,0,0,0.9)";

type Line = {
  start: number;
  end: number;
  text: string;
  clip: string;
  num?: number; // so thu tu hien goc tren, chi cho 6 loai
  name?: string; // ten loai lan
};

// timings do tu audio_ngamhoa279/_timeline.json
const LINES: Line[] = [
  { start: 0.0, end: 7.68, text: "Cả vườn lan này có sáu giò mà ai ghé qua cũng phải đứng lại ngắm. Coi thử nhà mình biết được mấy loại nha.", clip: "c1_vuon.mp4" },
  { start: 8.03, end: 14.99, text: "Số một, Kim Điệp. Hoa vàng rực bám kín thân cây, nở đúng độ là cả bụi sáng lên như treo đèn.", clip: "c2_kimdiep.mp4", num: 1, name: "KIM ĐIỆP" },
  { start: 15.34, end: 21.51, text: "Số hai, Hỏa hoàng. Màu cam cháy, chùm hoa dày khít, treo giữa giàn là nổi nhất vườn.", clip: "c3_hoahoang.mp4", num: 2, name: "HỎA HOÀNG" },
  { start: 21.86, end: 29.27, text: "Số ba, lan Đuôi cáo. Chùm hoa tím hồng dài rủ xuống đúng y cái đuôi con cáo, thơm dịu cả buổi sáng.", clip: "c4_duoicao.mp4", num: 3, name: "ĐUÔI CÁO" },
  { start: 29.62, end: 37.98, text: "Số bốn, Cattleya. Cánh trắng họng vàng, bông to gần bằng bàn tay, dân trong nghề kêu là nữ hoàng của các loài lan.", clip: "c5_cattleya.mp4", num: 4, name: "CATTLEYA" },
  { start: 38.33, end: 46.37, text: "Số năm, Phi điệp tím. Loài được săn nhiều nhất, hoa sai kín thân, màu tím ngọt, ai chơi lan cũng mơ có một giò.", clip: "c6_phidiep.mp4", num: 5, name: "PHI ĐIỆP TÍM" },
  { start: 46.72, end: 53.08, text: "Số sáu, Sơn thủy tiên. Từng chùm vàng buông quanh gốc cây lớn, nhìn một lần là nhớ hoài.", clip: "c7_sonthuytien.mp4", num: 6, name: "SƠN THỦY TIÊN" },
  { start: 53.43, end: 58.35, text: "Nhà mình thích giò số mấy? Comment con số đó cho mình biết nha!", clip: "c8_cta.mp4" },
];

const SFX = [
  { at: 8.03, vol: 0.6 },
  { at: 15.34, vol: 0.55 },
  { at: 21.86, vol: 0.55 },
  { at: 29.62, vol: 0.55 },
  { at: 38.33, vol: 0.55 },
  { at: 46.72, vol: 0.55 },
];

const TITLE = "6 GIÒ LAN ĐẸP NHẤT VƯỜN";

export const NGAMHOA279_TOTAL_FRAMES = 1763;

const Caption: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const pop = interpolate(t, [0, 0.25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // karaoke: to sang tung tu theo nhip doc, chia cum ~2 hang
  const CHUNK_CHARS = 40;
  const words = line.text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => Math.max(w.length, 2));
  const totalW = weights.reduce((a, b) => a + b, 0) || 1;
  const dur = Math.max(line.end - line.start, 0.1);
  let accW = 0;
  const wordStart = weights.map((w) => {
    const s = (accW / totalW) * dur;
    accW += w;
    return s;
  });
  const chunkOf: number[] = [];
  let ci = 0;
  let clen = 0;
  words.forEach((w, i) => {
    const add = (clen === 0 ? 0 : 1) + w.length;
    if (clen > 0 && clen + add > CHUNK_CHARS) {
      ci += 1;
      clen = 0;
    }
    chunkOf[i] = ci;
    clen += (clen === 0 ? 0 : 1) + w.length;
  });
  let curWord = 0;
  for (let i = 0; i < words.length; i++) {
    if (t >= wordStart[i]) curWord = i;
  }
  const activeChunk = chunkOf[curWord];

  return (
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
          display: "inline-block",
          fontFamily: FONT,
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.3,
          textShadow: "0 2px 6px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)",
          WebkitTextStroke: "3px rgba(0,0,0,0.92)",
          paintOrder: "stroke fill",
          padding: "10px 20px",
          transform: `scale(${pop})`,
        }}
      >
        {words.map((w, i) =>
          chunkOf[i] === activeChunk ? (
            <span
              key={i}
              style={{
                color: i <= curWord ? "#ffe14d" : "rgba(255,255,255,0.55)",
              }}
            >
              {w + " "}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
};

const Badge: React.FC<{ num: number; name: string }> = ({ num, name }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const pop = interpolate(t, [0, 0.35], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 210,
        left: 0,
        right: 0,
        textAlign: "center",
        transform: `scale(${pop})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 190,
          fontWeight: 900,
          color: "#ffe14d",
          lineHeight: 1,
          textShadow: OUTLINE,
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 58,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: 2,
          textShadow: OUTLINE,
          marginTop: 6,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export const NgamHoa279: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const titleOp = interpolate(t, [0.3, 0.9, 6.4, 7.2], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      {LINES.map((ln, i) => {
        const from = Math.round(ln.start * FPS);
        const last = i === LINES.length - 1;
        const until = last ? ln.end + 0.6 : LINES[i + 1].start;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={Math.max(Math.round((until - ln.start) * FPS), 1)}
          >
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(`${CLIPDIR}/${ln.clip}`)}
                muted
                startFrom={Math.round(0.3 * FPS)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.04)",
                }}
              />
            </AbsoluteFill>
            {ln.num ? <Badge num={ln.num} name={ln.name as string} /> : null}
            <Caption line={ln} />
          </Sequence>
        );
      })}

      <div
        style={{
          position: "absolute",
          top: 150,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: titleOp,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: FONT,
            fontSize: 62,
            fontWeight: 900,
            color: "#ffe14d",
            letterSpacing: 1,
            lineHeight: 1.2,
            textShadow: OUTLINE,
            padding: "10px 24px",
          }}
        >
          {TITLE}
        </div>
      </div>

      <Audio src={staticFile(`${DIR}/vo_full.mp3`)} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile("sfx/ting.wav")} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
