import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.3, text: "Một giò lan rợp bông, mà không có ruy băng nào gắn trên chậu. Nó thiếu cái gì?" },
  { speaker: "MN", start: 4.65, end: 11.9, text: "Mình đứng coi kỹ mấy giò đoạt giải ở hội thi hoa lan Cần Thơ. Nói trước, đây là góc nhìn của người xem, không phải bảng điểm ban giám khảo." },
  { speaker: "MN", start: 12.25, end: 18.13, text: "Thứ nhất, bông có nở đều không. Giò được giải bông kín từ gốc lên ngọn, không có khoảng trống nào ở giữa." },
  { speaker: "MN", start: 18.48, end: 22.61, text: "Khoảng trống đó nói lên chuyện cây thiếu nắng một bên, hoặc vòi hoa ra không cùng lúc." },
  { speaker: "MN", start: 22.96, end: 27.38, text: "Thứ hai, màu có sạch không. Bông không rám nắng, không đốm nước, cánh không quăn ở bìa." },
  { speaker: "MN", start: 27.73, end: 32.46, text: "Vì bông lan chỉ cần một cữ nước tưới sai giờ là để lại vết. Vết đó tới ngày thi vẫn còn." },
  { speaker: "MN", start: 32.81, end: 37.85, text: "Thứ ba, bông phải còn tươi. Nở sớm quá thì tới ngày thi đã xuống màu, nhìn là biết liền." },
  { speaker: "MN", start: 38.2, end: 42.33, text: "Cả nhà soi giò lan nhà mình thử coi được mấy điểm. Thả tim rồi lưu bài lại nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 12.45, vol: 0.55 },
  { src: "sfx/ting.wav", at: 23.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 33.0, vol: 0.5 },
];

export const LEHOI257_TOTAL_FRAMES = 1282;

export const LeHoi257: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi257"
    lines={LINES}
    sfx={SFX}
    title="GIÒ NÀY THIẾU GÌ?"
  />
);
