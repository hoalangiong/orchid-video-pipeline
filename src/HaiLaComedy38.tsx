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

type Line = { speaker: "TU" | "BO"; start: number; end: number; text: string };

const LINES: Line[] = [
  { speaker: "TU", start: 0.0, end: 9.94, text: "Bo! Trái dừa này chú hổng có uống nghe con, chú để tưới lan! Với cái vỏ trứng bà con bỏ đi đó, chú xin về nghiền phun là lan cứng cây mập chồi luôn con!" },
  { speaker: "BO", start: 10.29, end: 19.95, text: "Trời chú Tư ơi, nước dừa mát rượi vậy mà chú đem tưới cây, còn vỏ trứng là rác mà chú xin về! Chú làm gì con thấy cũng ngược đời hết á chú Tư!" },
  { speaker: "TU", start: 20.3, end: 30.45, text: "Ngược mà hay con! Nước dừa có chất kích mầm tự nhiên với đường với chất khoáng. Còn vỏ trứng gần như toàn canxi, cây thiếu canxi là ngọn teo đầu rễ thối con!" },
  { speaker: "BO", start: 30.8, end: 40.21, text: "Á vậy vỏ trứng là canxi hả chú, con tưởng chỉ có vôi mới có canxi. Vậy làm sao chú, con đập vỏ trứng bỏ vô chậu là được hả chú Tư?" },
  { speaker: "TU", start: 40.56, end: 51.33, text: "Đừng bỏ nguyên miếng nghe con, cả năm nó hổng tan! Rửa sạch, phơi khô, nướng sơ cho giòn rồi xay thành bột mịn. Bột đó ngâm nước hai ngày, lọc lấy nước phun mới ăn được con!" },
  { speaker: "BO", start: 51.68, end: 60.62, text: "Dạ phải nướng với xay mịn mới được. Còn nước dừa thì sao chú, đổ nguyên trái vô gốc luôn hả chú, hay cũng phải pha loãng ra nữa hả chú Tư?" },
  { speaker: "TU", start: 60.97, end: 71.43, text: "Pha loãng con, một phần nước dừa với mười phần nước sạch. Đừng đổ nguyên trái, ngọt quá kiến bu nấm mọc. Mà chỉ tưới cây đang lên chồi thôi, cây ngủ đông tưới là hư con!" },
  { speaker: "BO", start: 71.78, end: 80.06, text: "Dạ một dừa mười nước, chỉ tưới lúc cây lên chồi. Mà hai thứ này pha chung một bình được hông chú, với bao lâu làm một lần hả chú Tư ơi!" },
  { speaker: "TU", start: 80.41, end: 91.04, text: "Pha chung được con, nửa tháng một lần là đủ. Nhớ lọc cho kỹ đừng để cặn bít lỗ phun, với đây là bổ sung chớ hổng thay phân chính. Cây vẫn phải có phân đều nghe con!" },
  { speaker: "BO", start: 91.39, end: 100.77, text: "Hi hi! Cả nhà từ nay đừng bỏ vỏ trứng nghe, comment cho chú Tư biết nhà mình hay bỏ cái gì nữa, để chú Tư chỉ cách xài lại luôn nha cả nhà!" },
];

// SFX foley nhe: (file, startSec, volume). Chen dung khoanh khac, khong de nhac.
const SFX: { src: string; at: number; vol: number }[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },   // hook mo dau
  { src: "sfx/ting.wav", at: 41.0, vol: 0.55 },     // cau 5: cach so che vo trung (payoff 1)
  { src: "sfx/ting.wav", at: 61.4, vol: 0.5 },      // cau 7: pha loang 1:10 nuoc dua (payoff 2)
  { src: "sfx/shutter.wav", at: 80.41, vol: 0.45 }, // cau 9: chot bo sung chu khong thay phan
];

export const HAILA38_TOTAL_FRAMES = 3030;

export const HaiLaComedy38: React.FC = () => {
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

  // --- KARAOKE: chia cau thanh cum ~2 hang, giong doc toi tu nao sang tu do ---
  const CHUNK_CHARS = 40; // ~2 hang o fontSize 54
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

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a03" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("audio_haila38/bg_multi.mp4")}
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
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.3,
            textShadow: "0 2px 6px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)",
            padding: "24px 32px",
            transform: `scale(${pop})`,
          }}
        >
          {words.map((w, i) =>
            chunkOf[i] === activeChunk ? (
              <span
                key={i}
                style={{
                  color: i <= curWord ? "#ffe14d" : "rgba(255,255,255,0.55)",
                  transition: "color 0.1s",
                }}
              >
                {w + " "}
              </span>
            ) : null
          )}
        </div>
      </div>

      <Audio src={staticFile("audio_haila38/vo_full.mp3")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={30}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
