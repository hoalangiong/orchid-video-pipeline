import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.1, text: "Muốn biết một giò lan được chăm tử tế hay không, đừng coi bông. Coi cái thân." },
  { speaker: "MN", start: 4.45, end: 9.73, text: "Ở hội thi hoa lan Cần Thơ, mấy giò có ruy băng, thân nào cũng mập đều từ dưới lên tới ngọn." },
  { speaker: "MN", start: 10.08, end: 16.23, text: "Thân lan là cái kho lương thực. Cây trữ nước, trữ dinh dưỡng trong đó, để dành qua mùa khô và để dành bung bông." },
  { speaker: "MN", start: 16.58, end: 21.21, text: "Nên thân mập là cây có của ăn của để. Thân teo tóp lại là cây đang phải rút vốn ra sống." },
  { speaker: "MN", start: 21.56, end: 28.18, text: "Coi tiếp mấy cái đốt trên thân. Đốt ngắn mà mập là cây đủ nắng. Đốt dài lêu nghêu là cây thiếu nắng, phải vươn đi tìm." },
  { speaker: "MN", start: 28.53, end: 35.57, text: "Rồi coi cách lá xếp. Lá so le đều hai bên, dày và cứng, là cây ăn đủ. Lá mỏng rũ xuống là thừa nước mà thiếu nắng." },
  { speaker: "MN", start: 35.92, end: 41.56, text: "Cái đáng nói là mấy dấu này không xoá được. Thân đã teo một đoạn thì teo luôn, sang năm nhìn vẫn còn thấy." },
  { speaker: "MN", start: 41.91, end: 46.18, text: "Cả nhà ra soi thân giò lan nhà mình, coi mập hay teo. Comment cho mình biết nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 10.25, vol: 0.55 },
  { src: "sfx/ting.wav", at: 21.75, vol: 0.5 },
  { src: "sfx/ting.wav", at: 28.7, vol: 0.5 },
];

export const LEHOI258_TOTAL_FRAMES = 1398;

export const LeHoi258: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi258"
    lines={LINES}
    sfx={SFX}
    title="COI THÂN, ĐỪNG COI BÔNG"
  />
);
