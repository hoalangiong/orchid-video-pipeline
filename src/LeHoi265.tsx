import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.51, text: "Hai giò lan đứng kế bên nhau, nhìn y như nhau. Mà một giò đắt gấp mười lần giò kia." },
  { speaker: "MN", start: 4.86, end: 7.65, text: "Khác nhau ở một chỗ mà ít ai chịu đếm." },
  { speaker: "MN", start: 8.0, end: 12.96, text: "Đi hội thi hoa lan Cần Thơ, coi mấy giò có ruy băng, mình thấy giò nào cũng có một điểm chung." },
  { speaker: "MN", start: 13.31, end: 20.01, text: "Đếm thân. Giò thường có ba bốn thân. Giò đoạt giải bảy tám thân, mà thân nào cũng già, cũng chắc, cũng còn lá." },
  { speaker: "MN", start: 20.36, end: 24.87, text: "Vì một năm cây lan chỉ ra thêm được một hai thân trưởng thành. Đếm thân là đếm năm." },
  { speaker: "MN", start: 25.22, end: 29.73, text: "Nên giò tám thân đó không mua được bằng tiền một lần. Nó là tám năm không có năm nào bỏ bê." },
  { speaker: "MN", start: 30.08, end: 36.08, text: "Người mới chơi hay bị gạt ở chỗ này. Thấy bông rợp là tưởng cây lớn, mà thật ra chỉ có hai thân đang gánh hết." },
  { speaker: "MN", start: 36.43, end: 40.35, text: "Muốn biết giò lan mình tới đâu, đừng đếm bông. Đếm thân già còn lá." },
  { speaker: "MN", start: 40.7, end: 45.3, text: "Giò nhiều thân nhất trong giàn nhà mình được mấy thân. Comment con số đó cho mình biết nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 4.95, vol: 0.6 },
  { src: "sfx/ting.wav", at: 13.45, vol: 0.55 },
  { src: "sfx/ting.wav", at: 25.35, vol: 0.5 },
  { src: "sfx/ting.wav", at: 36.55, vol: 0.5 },
];

export const LEHOI265_TOTAL_FRAMES = 1371;

export const LeHoi265: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi265"
    lines={LINES}
    sfx={SFX}
    title="ĐẾM THÂN, ĐỪNG ĐẾM BÔNG"
  />
);
