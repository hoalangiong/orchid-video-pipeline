import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.42, text: "Cây này treo lên giàn là đẹp liền. Không cần chậu xịn, không cần giá thể cầu kỳ." },
  { speaker: "MN", start: 4.77, end: 10.69, text: "Lan hoàng thảo thân thòng. Người miền Tây hay kêu là lan đuôi chồn, vì cái vòi hoa buông xuống y như đuôi con chồn." },
  { speaker: "MN", start: 11.04, end: 16.78, text: "Thân nó dài cả thước, lá xếp đều hai bên. Treo lên cao cho nó rũ xuống, gió thổi qua là lắc lư." },
  { speaker: "MN", start: 17.13, end: 21.74, text: "Hoa nở thành chùm dọc theo thân. Chùm nào cũng dài ba bốn tấc, bông nhỏ mà đếm không ra." },
  { speaker: "MN", start: 22.09, end: 26.5, text: "Cây này dễ chơi lắm. Nắng nhiều một chút cũng được, tưới thiếu một hai ngày cũng không sao." },
  { speaker: "MN", start: 26.85, end: 31.97, text: "Chỉ nhớ một chuyện. Mùa khô nó rụng lá để nghỉ. Thấy lá vàng đừng tưởng cây chết, đừng vứt." },
  { speaker: "MN", start: 32.32, end: 37.19, text: "Tới mùa mưa nó đâm chồi mới, rồi bung bông. Cái đó là nhịp của nó, mình can thiệp là hỏng." },
  { speaker: "MN", start: 37.54, end: 41.76, text: "Nhà mình có giò nào đang treo trên giàn không? Comment cho mình biết tên dòng lan nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 4.85, vol: 0.6 },
  { src: "sfx/ting.wav", at: 11.15, vol: 0.55 },
  { src: "sfx/ting.wav", at: 17.25, vol: 0.55 },
  { src: "sfx/ting.wav", at: 26.95, vol: 0.55 },
];

export const KHO274_TOTAL_FRAMES = 1265;

export const Kho274: React.FC = () => (
  <LeHoiBase
    dir="audio_kho274"
    lines={LINES}
    sfx={SFX}
    title="LAN ĐUÔI CHỒN THÂN THÒNG"
  />
);
