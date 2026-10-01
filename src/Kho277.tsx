import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.37, text: "Có người hỏi mình, lan nở mùa nào. Mình trả lời, mùa nào cũng có lan nở." },
  { speaker: "MN", start: 4.72, end: 10.36, text: "Mùa xuân có giả hạc, phi điệp. Thân rụng lá từ tháng mười một, tới tết là bung bông tím rợp giàn." },
  { speaker: "MN", start: 10.71, end: 16.18, text: "Mùa hè có dendro, mokara. Nắng càng gắt nó càng siêng hoa, tưới đều là có bông quanh năm." },
  { speaker: "MN", start: 16.53, end: 21.93, text: "Mùa thu có ngọc điểm. Bông trắng đốm tím, thơm nức cả góc vườn. Người ta kêu là lan đai châu." },
  { speaker: "MN", start: 22.28, end: 26.84, text: "Mùa đông có hồ điệp. Dòng này người ta ép nở đúng tết, nên chợ hoa tháng chạp đầy hồ điệp." },
  { speaker: "MN", start: 27.19, end: 31.53, text: "Thành ra chơi lan là chơi cả năm. Tháng nào cũng có việc, tháng nào cũng có bông để ngắm." },
  { speaker: "MN", start: 31.88, end: 36.95, text: "Chỉ cần nhớ một chuyện. Mỗi dòng có nhịp riêng. Ép nó nở trái mùa là được, mà cây yếu đi." },
  { speaker: "MN", start: 37.3, end: 41.11, text: "Nhà mình thích mùa nào nhất trong bốn mùa hoa? Comment cho mình biết nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 4.8, vol: 0.6 },
  { src: "sfx/ting.wav", at: 10.8, vol: 0.55 },
  { src: "sfx/ting.wav", at: 16.65, vol: 0.55 },
  { src: "sfx/ting.wav", at: 22.4, vol: 0.55 },
];

export const KHO277_TOTAL_FRAMES = 1246;

export const Kho277: React.FC = () => (
  <LeHoiBase
    dir="audio_kho277"
    lines={LINES}
    sfx={SFX}
    title="BỐN MÙA HOA LAN"
  />
);
