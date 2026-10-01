import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "TU", start: 0.0, end: 5.62, text: "Bo ơi! Mai chú đi hội thi hoa lan Cần Thơ, con qua chở giùm chú giò lan nghe con!" },
  { speaker: "BO", start: 5.97, end: 12.21, text: "Dạ được chú! Con lấy xe máy chở, con để cái chậu giữa hai chân con giữ cho chắc hả chú Tư!" },
  { speaker: "TU", start: 12.56, end: 19.98, text: "Thôi con! Kẹp vậy tới nơi bông rụng hết trơn! Vòi hoa lan mà cọ vô nhau là dập, dập là mất điểm liền con!" },
  { speaker: "BO", start: 20.33, end: 27.22, text: "Hả! Vậy chớ chở làm sao hả chú! Chú nói con nghe coi, chớ con hổng biết đường nào mà lần!" },
  { speaker: "TU", start: 27.57, end: 34.65, text: "Con lấy giấy báo cuốn lỏng quanh vòi hoa, rồi bỏ chậu vô thùng giấy, chèn khăn cũ chung quanh cho nó đứng yên con!" },
  { speaker: "BO", start: 35.0, end: 42.71, text: "Á! Vậy là gói như gói quà hả chú! Mà chú ơi, đi đường xa vậy có cần tưới nước dọc đường hông chú Tư!" },
  { speaker: "TU", start: 43.06, end: 50.21, text: "Đừng con! Tưới rồi bông ướt, xe chạy gió tạt vô là đốm hết! Tưới đẫm trước ở nhà một ngày là đủ con!" },
  { speaker: "BO", start: 50.56, end: 58.74, text: "Trời! Chở giò lan đi thi mà cực hơn chở người luôn hả chú! Cả nhà ai từng chở lan đi thi rồi thì comment kể cho chú Tư nghe nha!" },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 12.75, vol: 0.55 },
  { src: "sfx/ting.wav", at: 27.75, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 43.25, vol: 0.42 },
];

export const LEHOI261_TOTAL_FRAMES = 1774;

export const LeHoi261: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi261"
    lines={LINES}
    sfx={SFX}
    title="CHỞ LAN ĐI THI"
  />
);
