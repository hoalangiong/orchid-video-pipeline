import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 5.54, text: "Cái này là vòi hoa, chớ không phải mầm non. Nhiều người tưới đạm vô ngay lúc này, mất trắng một mùa hoa." },
  { speaker: "MN", start: 5.89, end: 8.82, text: "Hai đứa nó nhìn giống nhau lắm, mà có ba chỗ khác." },
  { speaker: "MN", start: 9.17, end: 13.52, text: "Mầm non mọc từ sát gốc, chĩa lên trời, đầu nhọn hoắt và có bẹ lá ôm quanh." },
  { speaker: "MN", start: 13.87, end: 19.7, text: "Vòi hoa thì nhú ra ở hông thân, ngay chỗ mắt ngủ. Nó mọc ngang, hơi chúc xuống, đầu tròn tròn." },
  { speaker: "MN", start: 20.05, end: 25.04, text: "Chỗ thứ ba là màu. Vòi hoa thường xanh non pha tím, bóng láng. Mầm thì xanh đục hơn." },
  { speaker: "MN", start: 25.39, end: 31.17, text: "Thấy vòi hoa rồi thì ngưng đạm liền, chuyển qua lân với kali. Đạm lúc này cây quay lại nuôi lá, vòi lụi." },
  { speaker: "MN", start: 31.52, end: 37.16, text: "Mình đoán chắc ở đây nhiều người từng nhầm y vậy. Ai từng rồi thì thả cho mình cái tim, đỡ phải kể ra." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 6.0, vol: 0.6 },
  { src: "sfx/ting.wav", at: 9.3, vol: 0.55 },
  { src: "sfx/ting.wav", at: 14.0, vol: 0.55 },
  { src: "sfx/ting.wav", at: 20.2, vol: 0.55 },
];

export const KHO269_TOTAL_FRAMES = 1119;

export const Kho269: React.FC = () => (
  <LeHoiBase
    dir="audio_kho269"
    lines={LINES}
    sfx={SFX}
    title="VÒI HOA HAY MẦM NON"
  />
);
