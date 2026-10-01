import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 5.14, text: "Chưa cần chờ tới Tết. Nhìn cái chỗ này trên thân lan là biết giàn mình năm nay có hoa hay không." },
  { speaker: "MN", start: 5.49, end: 9.9, text: "Trên mỗi giả hành già, chỗ lá rụng đi sẽ để lại một cái mắt. Người ta gọi là mắt ngủ." },
  { speaker: "MN", start: 10.25, end: 14.88, text: "Mắt còn căng, còn phồng lên như hạt gạo, là mắt còn sống. Cây để dành đó chờ tới cữ." },
  { speaker: "MN", start: 15.23, end: 19.99, text: "Mắt nào teo lại, khô đen, xẹp xuống thì coi như xong. Chỗ đó không bung được gì nữa." },
  { speaker: "MN", start: 20.34, end: 25.95, text: "Mắt ở khúc trên gần ngọn thì thường cho hoa. Mắt ở khúc dưới sát gốc thì hay cho mầm, cho cây con." },
  { speaker: "MN", start: 26.3, end: 30.12, text: "Cho nên thân già đừng vội cắt. Cắt là mình cắt luôn chỗ hoa sắp ra." },
  { speaker: "MN", start: 30.47, end: 36.42, text: "Ra giàn đếm thử một thân coi được mấy mắt còn căng. Đếm được mấy cái, comment con số đó cho mình nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 5.6, vol: 0.6 },
  { src: "sfx/ting.wav", at: 10.4, vol: 0.55 },
  { src: "sfx/ting.wav", at: 15.4, vol: 0.55 },
  { src: "sfx/ting.wav", at: 20.5, vol: 0.55 },
];

export const KHO268_TOTAL_FRAMES = 1097;

export const Kho268: React.FC = () => (
  <LeHoiBase
    dir="audio_kho268"
    lines={LINES}
    sfx={SFX}
    title="ĐẾM MẮT NGỦ BIẾT CÓ HOA"
  />
);
