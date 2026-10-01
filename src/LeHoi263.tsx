import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 3.72, text: "Cả giàn hai chục giò, chỉ được đem một giò đi thi. Chọn giò nào?" },
  { speaker: "MN", start: 4.07, end: 9.16, text: "Đi hội thi hoa lan Cần Thơ, coi mấy giò có ruy băng, mình thấy người ta không chọn giò bông đẹp nhất." },
  { speaker: "MN", start: 9.51, end: 13.88, text: "Người ta chọn giò ĐỀU nhất. Thân đều nhau, lá đều nhau, vòi hoa ra cùng lúc." },
  { speaker: "MN", start: 14.23, end: 18.69, text: "Vì một giò có hai thân bự mà ba thân teo thì ban giám khảo trừ ngay ở mấy thân teo đó." },
  { speaker: "MN", start: 19.04, end: 23.5, text: "Thứ hai là canh ngày nở. Bông nở sớm trước ngày thi một tuần là tới bữa đã xuống màu." },
  { speaker: "MN", start: 23.85, end: 28.39, text: "Nên người có nghề nhìn vòi hoa lúc còn nụ, đếm ngược lại để biết nó bung đúng ngày hay không." },
  { speaker: "MN", start: 28.74, end: 34.36, text: "Thứ ba, chọn giò nào cái chậu còn lành, giá thể còn thoáng. Chậu bung rễ đen là tự mình khai ra." },
  { speaker: "MN", start: 34.71, end: 38.95, text: "Cả nhà mà có hội thi lan gần nhà, sẽ đem giò nào đi. Comment cho mình biết nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 9.7, vol: 0.55 },
  { src: "sfx/ting.wav", at: 19.25, vol: 0.5 },
  { src: "sfx/ting.wav", at: 28.95, vol: 0.5 },
];

export const LEHOI263_TOTAL_FRAMES = 1181;

export const LeHoi263: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi263"
    lines={LINES}
    sfx={SFX}
    title="ĐEM GIÒ NÀO ĐI THI?"
  />
);
