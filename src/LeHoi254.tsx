import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 6.1, text: "Hai giò lan đứng cạnh nhau, cùng nở rợp bông. Một giò có ruy băng, một giò không có gì. Khác nhau ở đâu?" },
  { speaker: "MN", start: 6.45, end: 14.17, text: "Mình đi hết hội thi hoa lan Cần Thơ, đứng coi kỹ mấy giò đoạt giải. Xin nói trước, đây là góc nhìn của người xem, không phải bảng điểm của ban giám khảo." },
  { speaker: "MN", start: 14.52, end: 22.76, text: "Thứ đầu tiên đập vô mắt không phải hoa. Là bộ lá. Cây đoạt giải lá xanh đều từ gốc lên ngọn, không có lá vàng nào ở dưới, không đốm, không cháy bìa." },
  { speaker: "MN", start: 23.11, end: 29.66, text: "Vì lá dưới gốc mà rụng là cây đã có lúc bị sốc. Thiếu nước, thừa phân, hay bị đổi chỗ. Lá không nói dối được." },
  { speaker: "MN", start: 30.01, end: 36.87, text: "Thứ hai là độ đồng đều của vòi hoa. Cây đoạt giải các vòi vươn ra cùng một hướng, dài gần bằng nhau, bông nở gần như cùng lúc." },
  { speaker: "MN", start: 37.22, end: 43.34, text: "Cái đó không phải may mắn. Đó là cây được đủ nắng đều bốn phía, và người chăm biết canh đúng thời điểm cho cây ăn phân hoa." },
  { speaker: "MN", start: 43.69, end: 51.23, text: "Thứ ba, thứ ít ai để ý. Là cái chậu và bộ rễ. Rễ non trắng bám ra ngoài thành chậu là dấu hiệu giá thể còn thoáng, cây đang sống thật." },
  { speaker: "MN", start: 51.58, end: 57.75, text: "Ngược lại, cây bông đẹp mà gốc trơ, rễ đen, thì bông đó là bông cuối. Người có nghề nhìn cái đó ra liền." },
  { speaker: "MN", start: 58.1, end: 64.58, text: "Nên hội thi lan không chấm một ngày hoa nở. Nó chấm cả năm trước đó. Cây nào bị bỏ bê một tháng thôi là thấy dấu trên thân." },
  { speaker: "MN", start: 64.93, end: 70.97, text: "Cả nhà thấy giò lan nhà mình đạt được mấy điểm trong ba cái này. Thả tim rồi lưu bài lại, coi mà soi giàn nhà mình nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 14.7, vol: 0.55 },
  { src: "sfx/ting.wav", at: 30.2, vol: 0.5 },
  { src: "sfx/ting.wav", at: 43.9, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 58.3, vol: 0.42 },
];

export const LEHOI254_TOTAL_FRAMES = 2140;

export const LeHoi254: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi254"
    lines={LINES}
    sfx={SFX}
    title="CHẤM ĐIỂM MỘT GIÒ LAN"
  />
);
