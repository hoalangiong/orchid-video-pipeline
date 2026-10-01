import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.87, text: "Giò lan đi thi về, treo lên giàn cái là rụng lá, xuống sức. Nhiều người tưởng tại nó già rồi." },
  { speaker: "MN", start: 5.22, end: 11.17, text: "Không phải. Nó bị sốc. Cây lan ở một chỗ lâu nó quen nắng đó, quen gió đó, quen giờ tưới đó." },
  { speaker: "MN", start: 11.52, end: 17.24, text: "Đem đi hội thi, hai ba ngày nó đứng trong nhà lưới lạ, ánh sáng khác, gió khác, không được tưới đúng cữ." },
  { speaker: "MN", start: 17.59, end: 23.49, text: "Rồi chở về, treo lại chỗ cũ. Với mình là về nhà. Với cây là đổi chỗ lần thứ hai trong một tuần." },
  { speaker: "MN", start: 23.84, end: 29.46, text: "Nên đi thi về, đừng treo ngay ra chỗ nắng nhất. Cho nó vô chỗ mát, sáng dịu, đứng đó vài ngày." },
  { speaker: "MN", start: 29.81, end: 36.05, text: "Và đừng bón phân liền. Cây đang mệt mà cho ăn là hư rễ. Chờ nó ra rễ non trắng lại rồi hãy cho ăn nhẹ." },
  { speaker: "MN", start: 36.4, end: 41.12, text: "Còn mấy vòi hoa đã tàn thì cắt bỏ, để cây dồn sức nuôi thân, chớ đừng để nó gánh thêm." },
  { speaker: "MN", start: 41.47, end: 45.63, text: "Cả nhà có giò nào đi chơi xa về rồi xuống sức không. Thả tim rồi lưu bài lại nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 5.4, vol: 0.55 },
  { src: "sfx/ting.wav", at: 24.05, vol: 0.5 },
  { src: "sfx/ting.wav", at: 30.0, vol: 0.5 },
];

export const LEHOI262_TOTAL_FRAMES = 1381;

export const LeHoi262: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi262"
    lines={LINES}
    sfx={SFX}
    title="ĐI THI VỀ LÀ XUỐNG SỨC"
  />
);
