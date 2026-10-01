import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.34, text: "Cả một bàn dài, giò nào cũng rợp bông. Mà chỉ vài giò có ruy băng gắn trên chậu." },
  { speaker: "MN", start: 4.69, end: 9.85, text: "Hội thi hoa lan Cần Thơ. Mình đi coi màu, và đây là mấy màu đứng lại lâu nhất trong mắt mình." },
  { speaker: "MN", start: 10.2, end: 16.37, text: "Giò vàng pha đỏ. Bông xếp thành chùm dày, vàng ở ngoài, đỏ thẫm ở giữa. Đứng xa cả thước vẫn thấy." },
  { speaker: "MN", start: 16.72, end: 21.16, text: "Giò hồng tím thả rũ. Vòi buông dài xuống quá thành chậu, bông nhỏ mà đếm không ra." },
  { speaker: "MN", start: 21.51, end: 25.52, text: "Giò nâu đốm. Màu này ít người trồng, mà đem đi thi thì nhìn sang lắm." },
  { speaker: "MN", start: 25.87, end: 30.29, text: "Còn giò cam ngả san hô. Nở kín từ gốc lên ngọn, không có chỗ nào trống." },
  { speaker: "MN", start: 30.64, end: 34.34, text: "Cả nhà thích màu nào nhất trong mấy màu này. Comment cho mình biết nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 10.4, vol: 0.5 },
  { src: "sfx/ting.wav", at: 16.9, vol: 0.45 },
  { src: "sfx/ting.wav", at: 21.7, vol: 0.45 },
  { src: "sfx/ting.wav", at: 26.05, vol: 0.45 },
];

export const LEHOI255_TOTAL_FRAMES = 1043;

export const LeHoi255: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi255"
    lines={LINES}
    sfx={SFX}
    title="MÀU LAN ĐOẠT GIẢI"
  />
);
