import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.08, text: "Cùng một giò lan, đem về hai cái giàn khác nhau, một năm sau là hai cây khác nhau." },
  { speaker: "MN", start: 4.43, end: 8.77, text: "Đi hội thi hoa lan Cần Thơ, mình coi luôn cái nhà lưới người ta dựng, chớ không chỉ coi bông." },
  { speaker: "MN", start: 9.12, end: 15.6, text: "Thứ nhất là lưới che. Lan cần nắng sáng, mà không chịu được nắng gắt buổi trưa. Một lớp lưới đen cắt bớt là đủ." },
  { speaker: "MN", start: 15.95, end: 24.31, text: "Thứ hai là chiều cao treo. Treo cao thì thoáng gió mà khô nhanh. Treo thấp thì giữ ẩm mà dễ nấm. Người có nghề treo tầm ngang vai, để dễ soi mặt lá." },
  { speaker: "MN", start: 24.66, end: 30.99, text: "Thứ ba, cái ít người làm. Là mặt nước dưới giàn. Nước bốc hơi lên tạo ẩm mát quanh gốc, đỡ phải tưới nhiều lần trong ngày." },
  { speaker: "MN", start: 31.34, end: 37.75, text: "Thứ tư là giá thể. Giỏ gỗ, chậu đất nung có lỗ, than cục to. Rễ lan cần thoáng hơn là cần no nước." },
  { speaker: "MN", start: 38.1, end: 41.82, text: "Cộng lại, cái giàn quyết định phần lớn. Phân với thuốc chỉ là phần cuối." },
  { speaker: "MN", start: 42.17, end: 48.15, text: "Cả nhà đang treo lan ở đâu, sân thượng hay hiên nhà. Thả tim rồi lưu bài lại, bữa nào dựng giàn thì coi lại nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 9.3, vol: 0.55 },
  { src: "sfx/ting.wav", at: 16.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 24.85, vol: 0.5 },
  { src: "sfx/ting.wav", at: 31.5, vol: 0.5 },
];

export const LEHOI260_TOTAL_FRAMES = 1457;

export const LeHoi260: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi260"
    lines={LINES}
    sfx={SFX}
    title="CÁI GIÀN QUYẾT ĐỊNH"
  />
);
