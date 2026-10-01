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

// vien den quanh chu, thay cho hop nen den
const OUTLINE =
  "2px 0 0 rgba(0,0,0,0.96), -2px 0 0 rgba(0,0,0,0.96), 0 2px 0 rgba(0,0,0,0.96), 0 -2px 0 rgba(0,0,0,0.96), 2px 2px 0 rgba(0,0,0,0.96), -2px -2px 0 rgba(0,0,0,0.96), 2px -2px 0 rgba(0,0,0,0.96), -2px 2px 0 rgba(0,0,0,0.96), 0 5px 22px rgba(0,0,0,0.9)";

export type LeHoiLine = {
  speaker: "MN" | "TU" | "BO";
  start: number;
  end: number;
  text: string;
};

export type LeHoiSfx = { src: string; at: number; vol: number };

type Props = {
  dir: string; // vd "audio_lehoi252"
  lines: LeHoiLine[];
  sfx: LeHoiSfx[];
  title: string; // chu tren dau khung
};

export const LeHoiBase: React.FC<Props> = ({ dir, lines, sfx, title }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (t >= lines[i].start) idx = i;
  }
  const cur = lines[idx];

  const localT = t - cur.start;
  const pop = interpolate(localT, [0, 0.25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // karaoke: to sang tung tu theo nhip doc, chia cum ~2 hang
  const CHUNK_CHARS = 40;
  const words = cur.text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => Math.max(w.length, 2));
  const totalW = weights.reduce((a, b) => a + b, 0) || 1;
  const dur = Math.max(cur.end - cur.start, 0.1);
  let accW = 0;
  const wordStart = weights.map((w) => {
    const s = cur.start + (accW / totalW) * dur;
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

  // ten hoi thi hien 4s dau
  const titleOp = interpolate(t, [0.3, 0.9, 4.0, 4.8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(`${dir}/bg_multi.mp4`)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.04)",
          }}
        />
      </AbsoluteFill>

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
            fontSize: 46,
            fontWeight: 800,
            color: "#ffe14d",
            letterSpacing: 1,
            lineHeight: 1.25,
            textShadow: OUTLINE,
            padding: "10px 24px",
          }}
        >
          {title}
        </div>
      </div>

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
            textShadow:
              "0 2px 6px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)",
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

      <Audio src={staticFile(`${dir}/vo_full.mp3`)} />
      {sfx.map((s, i) => (
        <Sequence
          key={i}
          from={Math.round(s.at * FPS)}
          durationInFrames={30}
        >
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
