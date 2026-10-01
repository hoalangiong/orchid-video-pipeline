import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.44, text: "Mấy bình thủy tinh có cây con li ti bên trong đó, mình mua về giàn thì sống được mấy phần?" },
  { speaker: "MN", start: 4.79, end: 10.14, text: "Cây trong bình là cây cấy mô. Nó lớn lên trong môi trường vô trùng, có sẵn đường sẵn thạch để ăn." },
  { speaker: "MN", start: 10.49, end: 16.37, text: "Đưa thẳng ra giàn là sốc chết gần hết. Vì nó chưa từng biết gió, chưa từng biết nắng, chưa tự hút nước." },
  { speaker: "MN", start: 16.72, end: 22.43, text: "Muốn sống thì phải qua bước tập. Rửa sạch thạch ở rễ, trồng trong khay dớn mịn, che kín, giữ ẩm cao." },
  { speaker: "MN", start: 22.78, end: 26.91, text: "Mỗi ngày hé ra một chút cho nó quen dần. Cỡ ba bốn tuần mới cho ăn nắng thật." },
  { speaker: "MN", start: 27.26, end: 32.61, text: "Được cái là giá rẻ và cây sạch bệnh. Mất cái là chờ lâu, hai ba năm mới có hoa để mà ngắm." },
  { speaker: "MN", start: 32.96, end: 38.08, text: "Ai muốn mình làm kỹ khúc tập cây con ra giàn thì comment chữ BÌNH, đủ người mình làm riêng một tập." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 4.9, vol: 0.6 },
  { src: "sfx/ting.wav", at: 10.6, vol: 0.55 },
  { src: "sfx/ting.wav", at: 16.85, vol: 0.55 },
  { src: "sfx/ting.wav", at: 27.4, vol: 0.55 },
];

export const KHO271_TOTAL_FRAMES = 1147;

export const Kho271: React.FC = () => (
  <LeHoiBase
    dir="audio_kho271"
    lines={LINES}
    sfx={SFX}
    title="MUA LAN CẤY MÔ TRONG BÌNH"
  />
);
