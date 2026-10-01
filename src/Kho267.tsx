import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 5.59, text: "Cùng một giống lan, cùng một loại phân. Mà giàn người ta nở rợp như vầy, giàn mình lèo tèo có mấy bông." },
  { speaker: "MN", start: 5.94, end: 9.76, text: "Khác nhau không nằm ở bao phân. Nó nằm ở ba chuyện ít ai nói ra." },
  { speaker: "MN", start: 10.11, end: 14.98, text: "Thứ nhất, cây phải đủ tuổi. Lan chưa đủ thân già thì bón cách nào cũng chỉ ra được vài vòi." },
  { speaker: "MN", start: 15.33, end: 21.14, text: "Vì thân già còn lá mới là cái kho. Cây rút ở đó ra để bung hoa, chớ không rút từ bao phân mình mới mua." },
  { speaker: "MN", start: 21.49, end: 28.35, text: "Thứ hai, phải có cữ khô. Lan nghỉ khô một đợt mới hiểu là tới lúc làm hoa. Tưới đều đều quanh năm thì nó cứ ra lá." },
  { speaker: "MN", start: 28.7, end: 35.4, text: "Thứ ba là nắng. Thiếu nắng cây vẫn xanh tốt mà không có sức làm hoa. Lá xanh mướt quá mà không thấy bông, thường là do chỗ này." },
  { speaker: "MN", start: 35.75, end: 39.49, text: "Ba cái đó không mua được bằng tiền. Nó là chuyện của cả năm trước đó." },
  { speaker: "MN", start: 39.84, end: 43.83, text: "Giàn nhà mình đang thiếu cái nào trong ba cái này. Comment cho mình biết nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 6.05, vol: 0.6 },
  { src: "sfx/ting.wav", at: 10.25, vol: 0.55 },
  { src: "sfx/ting.wav", at: 21.6, vol: 0.55 },
  { src: "sfx/ting.wav", at: 28.85, vol: 0.55 },
];

export const KHO267_TOTAL_FRAMES = 1333;

export const Kho267: React.FC = () => (
  <LeHoiBase
    dir="audio_kho267"
    lines={LINES}
    sfx={SFX}
    title="VÌ SAO GIÀN NGƯỜI TA NỞ RỢP"
  />
);
