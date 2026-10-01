import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "TU", start: 0.0, end: 6.46, text: "Bo ơi! Con lại đây chú chỉ con cái này! Con thấy mấy cái rễ trắng nó bò ra ngoài chậu hông con!" },
  { speaker: "BO", start: 6.81, end: 13.47, text: "Thấy chú! Mà con tưởng rễ bò ra ngoài vậy là cây bị chật chậu, phải sang chậu liền chớ chú Tư!" },
  { speaker: "TU", start: 13.82, end: 22.24, text: "Sai bét con! Rễ bò ra ngoài để đón sương đón khí trời, người ta gọi là rễ gió đó con! Cây khoẻ mới dám đẩy rễ ra ngoài!" },
  { speaker: "BO", start: 22.59, end: 28.86, text: "Á! Vậy là nó khoe của hả chú! Vậy chớ cây yếu thì bộ rễ nó làm sao hả chú Tư?" },
  { speaker: "TU", start: 29.21, end: 38.04, text: "Cây yếu rễ nó rút vô trong, đen thui, bóp cái là nát con! Còn rễ khoẻ thì trắng, đầu rễ có cái mũi xanh xanh, bóp thấy cứng!" },
  { speaker: "BO", start: 38.39, end: 46.99, text: "Trời! Vậy con soi cái đầu rễ là biết cây sống thật hay sắp đi hả chú! Mà chú ơi, rễ gió đó mình có cắt cho gọn hông chú!" },
  { speaker: "TU", start: 47.34, end: 56.0, text: "Đừng con! Con cắt cái đó là con cắt ống thở của nó! Cả nhà ai từng cắt rễ gió cho gọn thì comment thú thiệt với chú Tư nha!" },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 14.0, vol: 0.55 },
  { src: "sfx/ting.wav", at: 29.4, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 47.5, vol: 0.42 },
];

export const LEHOI259_TOTAL_FRAMES = 1693;

export const LeHoi259: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi259"
    lines={LINES}
    sfx={SFX}
    title="RỄ BÒ RA NGOÀI CHẬU"
  />
);
