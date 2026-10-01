import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "TU", start: 0.0, end: 7.25, text: "Bo ơi! Con coi cái bàn này đi con! Giò nào cũng rợp bông mà sao chỉ có mấy giò được gắn ruy băng vậy con!" },
  { speaker: "BO", start: 7.6, end: 14.0, text: "Trời chú Tư! Con tưởng cứ bông nhiều là ăn giải chớ! Vậy mấy ổng còn chấm cái gì nữa hả chú!" },
  { speaker: "TU", start: 14.35, end: 21.17, text: "Chấm cái ĐỀU con! Con coi giò vàng pha đỏ kia, bông nở kín từ gốc lên ngọn, hổng có chỗ nào trống!" },
  { speaker: "BO", start: 21.52, end: 29.2, text: "Á! Còn giò hồng tím thả rũ kia nữa chú! Vòi nó buông dài quá thành chậu luôn, coi như suối bông á chú Tư!" },
  { speaker: "TU", start: 29.55, end: 36.68, text: "Đó! Cái đó là canh phân canh nắng cả năm mới ra được con! Chớ hổng phải tới ngày thi rồi bơm cho nó bung!" },
  { speaker: "BO", start: 37.03, end: 43.12, text: "Vậy con hiểu rồi chú! Bông nhiều là chuyện của cây, còn bông ĐỀU là chuyện của người chăm hả chú Tư!" },
  { speaker: "TU", start: 43.47, end: 48.92, text: "Con nói câu đó nghe được đó con! Cả nhà thấy đúng hông, comment cho chú Tư biết nha!" },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 14.55, vol: 0.55 },
  { src: "sfx/ting.wav", at: 21.75, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 37.2, vol: 0.42 },
];

export const LEHOI256_TOTAL_FRAMES = 1480;

export const LeHoi256: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi256"
    lines={LINES}
    sfx={SFX}
    title="SAO GIÒ NÀY ĂN GIẢI?"
  />
);
