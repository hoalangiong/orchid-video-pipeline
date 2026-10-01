import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "TU", start: 0.0, end: 7.7, text: "Bo! Mai chú với con đi hội thi hoa lan Cần Thơ nghe con! Chú đem cái giò giả hạc chú chăm ba năm nay đi thi đó con!" },
  { speaker: "BO", start: 8.05, end: 17.9, text: "Trời chú Tư ơi! Thi hoa lan là thi cái gì hả chú? Chớ con tưởng đem ra ai bông bự nhứt thì thắng, vậy chú đem giò bông bự đi là ăn chắc rồi chú Tư!" },
  { speaker: "TU", start: 18.25, end: 27.44, text: "Bự hổng ăn đâu con! Ban giám khảo mà lật lá lên coi, thấy dưới gốc có lá vàng rụng là trừ điểm liền. Bông bự cỡ nào cũng hổng cứu được con!" },
  { speaker: "BO", start: 27.79, end: 36.44, text: "Hả! Lật lá lên coi hả chú? Vậy là đi thi lan mà mấy ổng đi soi cái lưng của lá hả chú Tư! Nghe cực dữ hen chú!" },
  { speaker: "TU", start: 36.79, end: 48.17, text: "Soi hết chớ con! Soi lá, soi thân, soi luôn bộ rễ trong chậu! Rễ non trắng bám ra thành chậu là cây sống thật. Còn gốc trơ rễ đen là biết cây mới bung bông rồi sắp tàn con!" },
  { speaker: "BO", start: 48.52, end: 56.14, text: "Á! Vậy là bộ rễ nó tố cáo chú hết trơn rồi! Vậy chớ mình bôi chút gì cho rễ nó trắng trắng được hông chú Tư ơi!" },
  { speaker: "TU", start: 56.49, end: 66.48, text: "Con nói cái gì đó! Rễ đâu có gian được con! Cái đó là công cả năm. Con bỏ bê cây một tháng thôi là nó ghi lên thân, tới ngày thi nó khai ra hết trơn!" },
  { speaker: "BO", start: 66.83, end: 75.16, text: "Trời đất! Vậy cái giò lan là cuốn sổ ghi nợ của người chăm luôn hả chú. Vậy chớ giò chú đem đi thi được cái ruy băng gì hả chú Tư?" },
  { speaker: "TU", start: 75.51, end: 84.56, text: "Chú được giải đồng con! Mà chú vui thiệt á! Vô hạng lan tổng hợp là hạng đông nhứt, cây nào cũng đẹp, có được cái ruy băng là chú mừng rồi con!" },
  { speaker: "BO", start: 84.91, end: 93.82, text: "Hi hi! Chú Tư giải đồng mà cười tươi hơn người ta giải vàng luôn! Cả nhà comment cho chú Tư biết giàn nhà mình có giò nào dám đi thi hông nha!" },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 36.9, vol: 0.55 },
  { src: "sfx/ting.wav", at: 56.6, vol: 0.5 },
  { src: "sfx/shutter.wav", at: 75.6, vol: 0.45 },
];

export const LEHOI253_TOTAL_FRAMES = 2825;

export const LeHoi253: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi253"
    lines={LINES}
    sfx={SFX}
    title="ĐI HỘI THI HOA LAN CẦN THƠ"
  />
);
