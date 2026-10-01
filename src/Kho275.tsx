import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 5.33, text: "Nhìn bộ rễ này chắc nhiều người tưởng cây sắp chết. Rễ gì mà trơ ra ngoài, không chịu chui vô đất." },
  { speaker: "MN", start: 5.68, end: 12.3, text: "Mà không phải. Đó là rễ khí sinh. Lan sống trên cây trong rừng, rễ nó bám vào vỏ cây, hút sương và nước mưa." },
  { speaker: "MN", start: 12.65, end: 19.01, text: "Cái lớp vỏ trắng bọc ngoài rễ đó gọi là velamen. Nó hút nước nhanh như miếng bọt biển, rồi giữ lại cho cây dùng dần." },
  { speaker: "MN", start: 19.36, end: 25.43, text: "Rễ xanh là rễ đang hút nước. Rễ bạc trắng là rễ khô, chờ đợt tưới sau. Cả hai đều bình thường." },
  { speaker: "MN", start: 25.78, end: 32.12, text: "Nhiều người mới chơi thấy rễ trồi ra ngoài chậu là lấy tay ấn vô. Đừng làm vậy. Rễ bị gãy đầu là ngưng phát triển luôn." },
  { speaker: "MN", start: 32.47, end: 39.07, text: "Rễ lan thích thoáng. Chậu bí quá là rễ đen, cây úng. Nên người ta mới trồng bằng dớn, bằng than, bằng vỏ thông." },
  { speaker: "MN", start: 39.42, end: 44.34, text: "Cái giỏ gỗ treo lan đó không phải để đẹp. Là để rễ nó thở, để nước tưới xong là ráo liền." },
  { speaker: "MN", start: 44.69, end: 49.27, text: "Nhà mình có bao giờ ấn rễ lan vô chậu chưa? Comment thú thiệt đi, mình không cười đâu." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 5.75, vol: 0.6 },
  { src: "sfx/ting.wav", at: 12.75, vol: 0.55 },
  { src: "sfx/ting.wav", at: 19.45, vol: 0.55 },
  { src: "sfx/ting.wav", at: 25.85, vol: 0.55 },
];

export const KHO275_TOTAL_FRAMES = 1491;

export const Kho275: React.FC = () => (
  <LeHoiBase
    dir="audio_kho275"
    lines={LINES}
    sfx={SFX}
    title="RỄ LAN TRÊN KHÔNG"
  />
);
