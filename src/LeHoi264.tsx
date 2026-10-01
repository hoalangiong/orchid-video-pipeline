import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "BO", start: 0.0, end: 7.21, text: "Chú Tư ơi! Con mới đi hội thi hoa lan Cần Thơ về! Con quyết định là con hổng dám nhận mình chơi lan nữa chú ơi!" },
  { speaker: "TU", start: 7.56, end: 11.59, text: "Ủa sao vậy con! Con có ba giò treo trước hiên mà con!" },
  { speaker: "BO", start: 11.94, end: 21.11, text: "Ba giò của con vô đó là chưa chơi gì hết á chú! Con đứng coi mà con chắp tay sau lưng cho chắc, chớ con sợ quơ tay đụng bông là con đền hổng nổi!" },
  { speaker: "TU", start: 21.46, end: 25.66, text: "Ừ! Vô đó đừng có đụng con! Mà con coi được gì hông con!" },
  { speaker: "BO", start: 26.01, end: 34.0, text: "Con coi được cái tật của con đó chú! Người ta chỉ đâu con cũng gật gật à à, chớ thật ra con hổng biết đó là lan gì luôn chú ơi!" },
  { speaker: "TU", start: 34.35, end: 37.45, text: "Trời đất! Vậy con gật cái gì đó con!" },
  { speaker: "BO", start: 37.8, end: 47.33, text: "Gật cho giống dân trong nghề chú! Rồi thấy cái bảng số trên chậu con còn tưởng là giá tiền, con nhẩm bụng giò này tám trăm bảy mươi bảy ngàn, rẻ dữ vậy ta!" },
  { speaker: "TU", start: 47.68, end: 51.79, text: "Số dự thi mà con! Con làm chú mắc cỡ giùm con luôn!" },
  { speaker: "BO", start: 52.14, end: 61.8, text: "Con chụp quá trời hình, mà về coi hình nào cũng có cái đầu người ta che nửa bông! Cả nhà đi hội thi lan có ai lầy như con hông, comment cho con đỡ tủi nha!" },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 12.1, vol: 0.55 },
  { src: "sfx/ting.wav", at: 26.2, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 38.0, vol: 0.45 },
  { src: "sfx/shutter.wav", at: 52.3, vol: 0.42 },
];

export const LEHOI264_TOTAL_FRAMES = 1866;

export const LeHoi264: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi264"
    lines={LINES}
    sfx={SFX}
    title="ĐI NGẮM LAN MÀ LẦY"
  />
);
