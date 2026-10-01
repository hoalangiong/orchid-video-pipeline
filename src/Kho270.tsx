import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.15, text: "Chậu này rễ còn trắng nõn, mà thật ra là rễ chết rồi. Bóp vô mới biết." },
  { speaker: "MN", start: 4.5, end: 8.92, text: "Rễ lan sống thì cứng, chắc tay, đầu rễ có một chấm xanh hoặc tím đang nhích ra." },
  { speaker: "MN", start: 9.27, end: 14.28, text: "Rễ chết thì bóp nhẹ là xẹp, tuột cái vỏ ngoài ra còn trơ cái lõi như sợi chỉ. Trắng mà rỗng." },
  { speaker: "MN", start: 14.63, end: 19.24, text: "Rễ nâu chưa chắc chết. Rễ già nó nâu là bình thường, miễn còn cứng là còn hút nước." },
  { speaker: "MN", start: 19.59, end: 24.03, text: "Cái phải cắt là rễ nhũn, rễ rỗng, rễ có mùi. Để lại là nó lây lên gốc." },
  { speaker: "MN", start: 24.38, end: 30.09, text: "Cắt xong để chỗ mát cho vết cắt khô mặt một hai ngày rồi mới trồng lại. Trồng ướt liền là thối tiếp." },
  { speaker: "MN", start: 30.44, end: 34.93, text: "Chừng nào bung chậu ra thay thì lôi cái này ra coi lại. Lưu lại đi rồi tới lúc đó khỏi tìm." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 4.6, vol: 0.6 },
  { src: "sfx/ting.wav", at: 9.4, vol: 0.55 },
  { src: "sfx/ting.wav", at: 19.7, vol: 0.55 },
  { src: "sfx/ting.wav", at: 24.5, vol: 0.55 },
];

export const KHO270_TOTAL_FRAMES = 1052;

export const Kho270: React.FC = () => (
  <LeHoiBase
    dir="audio_kho270"
    lines={LINES}
    sfx={SFX}
    title="RỄ TRẮNG CHƯA CHẮC LÀ RỄ SỐNG"
  />
);
