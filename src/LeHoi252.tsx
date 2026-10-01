import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 6.26, text: "Một cái ruy băng nhỏ gắn trên thành chậu. Chỉ vậy thôi, mà người chủ giò lan đó có thể đã chờ nó suốt mấy năm trời." },
  { speaker: "MN", start: 6.61, end: 12.04, text: "Đây là Hội thi hoa lan Cần Thơ, tổ chức mừng Quốc khánh mùng hai tháng chín. Lan từ khắp nơi tụ về đây." },
  { speaker: "MN", start: 12.39, end: 20.45, text: "Mỗi giò lan vô thi đều mang một con số. Số tám trăm bảy mươi bảy. Số hai trăm chín mươi ba. Sau con số đó là một người, một giàn lan, và mấy năm chăm." },
  { speaker: "MN", start: 20.8, end: 26.49, text: "Nhìn vô bàn trưng bày mới thấy một điều. Người ta không đem cây có bông bự nhất. Người ta đem cây khỏe nhất." },
  { speaker: "MN", start: 26.84, end: 33.99, text: "Lá dày, xanh đều từ gốc lên ngọn. Thân mập, không teo đoạn nào. Vòi hoa vươn ra cùng một hướng, bông nở gần như cùng lúc." },
  { speaker: "MN", start: 34.34, end: 39.48, text: "Cái ruy băng giải bạc, giải đồng gắn trên đó không chấm riêng bông hoa. Nó chấm cả một quá trình." },
  { speaker: "MN", start: 39.83, end: 46.26, text: "Hạng lan tổng hợp là hạng đông nhất, mà cũng là hạng khó nhất. Vì ở đó cây nào cũng đẹp, người ta hơn nhau từng chi tiết nhỏ." },
  { speaker: "MN", start: 46.61, end: 53.64, text: "Đi hết một vòng nhà lưới, thứ đọng lại trong mình không phải màu hoa. Là mấy cái chậu gỗ đã lên nước, rễ non trắng bám ra ngoài thành chậu." },
  { speaker: "MN", start: 53.99, end: 59.82, text: "Đó là dấu vết của bàn tay người chăm. Hoa nở mấy tuần rồi tàn, còn bộ rễ đó là công của cả một năm." },
  { speaker: "MN", start: 60.17, end: 65.55, text: "Cả nhà đã đi hội thi lan lần nào chưa. Comment cho mình biết ở chỗ mình có hội thi lan không nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 34.5, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 46.7, vol: 0.42 },
];

export const LEHOI252_TOTAL_FRAMES = 1978;

export const LeHoi252: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi252"
    lines={LINES}
    sfx={SFX}
    title="HỘI THI HOA LAN CẦN THƠ"
  />
);
