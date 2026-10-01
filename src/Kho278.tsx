import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "TT", start: 0.0, end: 6.22, text: "Lan trồng cả năm mà rễ còi, lá vàng nhạt, không chịu ra mầm? Coi chừng cây đang đói." },
  { speaker: "TT", start: 6.57, end: 14.39, text: "Đa số người mới chơi lan chỉ lo tưới nước, quên mất chuyện bón phân. Giá thể nghèo dinh dưỡng là cây suy từ từ." },
  { speaker: "TT", start: 14.74, end: 22.9, text: "Nhìn bộ rễ là biết. Rễ đen thối là úng, rễ trắng mập là khỏe. Lá vàng nhạt mỏng là thiếu đạm, thiếu vi lượng." },
  { speaker: "TT", start: 23.25, end: 31.48, text: "Thời điểm bón tốt nhất là sau khi cắt hoa xong, hoặc đầu mùa mưa lúc cây bắt đầu đâm chồi. Đừng bón lúc đang nở bông." },
  { speaker: "TT", start: 31.83, end: 40.9, text: "Nhà mình dùng Evergreen hơn nửa năm nay. Phân hữu cơ chậm tan, rắc vô gốc là nó nhả dinh dưỡng từ từ, không sợ cháy rễ." },
  { speaker: "TT", start: 41.25, end: 48.77, text: "Từ ngày dùng, rễ trắng mập thấy rõ, chồi mới bật liên tục. Lá xanh dày, thân mập biếc hẳn so với trước." },
  { speaker: "TT", start: 49.12, end: 56.56, text: "Cách dùng đơn giản lắm. Bốc một nhúm tay rắc vô gốc lan, tưới nước bình thường. Một túi một ký dùng được cả vườn." },
  { speaker: "TT", start: 56.91, end: 62.55, text: "Link mình để ở giỏ hàng nha. Nhà mình thử rồi comment cho mình biết kết quả!" },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 6.65, vol: 0.6 },
  { src: "sfx/ting.wav", at: 14.85, vol: 0.55 },
  { src: "sfx/ting.wav", at: 23.35, vol: 0.55 },
  { src: "sfx/ting.wav", at: 31.95, vol: 0.55 },
];

export const KHO278_TOTAL_FRAMES = 1889;

export const Kho278: React.FC = () => (
  <LeHoiBase
    dir="audio_kho278"
    lines={LINES}
    sfx={SFX}
    title="CÁCH BÓN PHÂN CHO LAN"
  />
);
