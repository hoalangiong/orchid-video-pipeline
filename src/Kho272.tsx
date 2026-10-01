import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 3.62, text: "Cây đang nở rực như vầy là cây mình nên tránh, nếu mới bắt đầu chơi lan." },
  { speaker: "MN", start: 3.97, end: 9.45, text: "Nghe ngược đời mà đúng. Lúc có hoa là lúc cây dốc hết sức ra, nhìn không biết được nó khoẻ hay yếu." },
  { speaker: "MN", start: 9.8, end: 14.57, text: "Hoa còn che cho mình luôn. Che cái gốc mục, che mấy cái rễ đã hư, che vết bệnh trên lá." },
  { speaker: "MN", start: 14.92, end: 19.48, text: "Mua về chưng được mươi bữa hoa tàn, cây tuột dần. Rồi mình tưởng tại mình chăm dở." },
  { speaker: "MN", start: 19.83, end: 25.21, text: "Mua thân tơ mới trưởng thành thì chắc hơn. Coi được cái gốc, coi được bộ rễ, biết mình mua cái gì." },
  { speaker: "MN", start: 25.56, end: 29.52, text: "Còn muốn mua lúc có hoa thì nhớ lật đáy chậu lên, coi rễ trước khi coi bông." },
  { speaker: "MN", start: 29.87, end: 35.29, text: "Nhà mình chắc có người sắp đi chợ lan. Gửi cái này cho họ coi trước, đỡ mua hớ như mình hồi đó." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 4.1, vol: 0.6 },
  { src: "sfx/ting.wav", at: 9.95, vol: 0.55 },
  { src: "sfx/ting.wav", at: 19.95, vol: 0.55 },
  { src: "sfx/ting.wav", at: 25.7, vol: 0.55 },
];

export const KHO272_TOTAL_FRAMES = 1063;

export const Kho272: React.FC = () => (
  <LeHoiBase
    dir="audio_kho272"
    lines={LINES}
    sfx={SFX}
    title="ĐỪNG MUA LAN ĐANG CÓ HOA"
  />
);
