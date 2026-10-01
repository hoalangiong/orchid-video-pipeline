import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 3.77, text: "Chỗ bị trừ điểm nhiều nhất trong hội thi lan, là chỗ không ai chụp hình." },
  { speaker: "MN", start: 4.12, end: 5.44, text: "Mặt dưới của lá." },
  { speaker: "MN", start: 5.79, end: 10.23, text: "Đi hội thi hoa lan Cần Thơ, mình thấy có người xem cầm điện thoại soi ngược lên dưới tàng lá." },
  { speaker: "MN", start: 10.58, end: 15.4, text: "Vì mặt trên lá xanh mướt thì lau sơ cũng bóng. Còn mặt dưới là chỗ cây giữ hết dấu vết." },
  { speaker: "MN", start: 15.75, end: 20.77, text: "Nhện đỏ ăn ở đó, để lại lấm tấm bụi vàng như rắc phấn. Bọ trĩ ăn ở đó, để lại vệt bạc." },
  { speaker: "MN", start: 21.12, end: 25.87, text: "Mà hai con đó ăn cả tháng trước, lá mới hiện dấu. Nên tới ngày thi mới thấy là trễ rồi." },
  { speaker: "MN", start: 26.22, end: 31.45, text: "Nên người có nghề mỗi tuần lật lá lên coi một lần. Coi mặt dưới, coi luôn kẽ giữa lá và thân." },
  { speaker: "MN", start: 31.8, end: 37.54, text: "Mặt trên của lá là bộ mặt. Mặt dưới là hồ sơ. Bông đẹp cỡ nào cũng không che được hồ sơ đó." },
  { speaker: "MN", start: 37.89, end: 43.36, text: "Cả nhà lật thử một lá dưới gốc coi có gì hông. Thả tim rồi lưu bài lại để chiều ra giàn soi nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/shutter.wav", at: 0.15, vol: 0.5 },
  { src: "sfx/ting.wav", at: 4.22, vol: 0.6 },
  { src: "sfx/ting.wav", at: 15.95, vol: 0.55 },
  { src: "sfx/ting.wav", at: 26.4, vol: 0.5 },
  { src: "sfx/ting.wav", at: 32.0, vol: 0.5 },
];

export const LEHOI266_TOTAL_FRAMES = 1313;

export const LeHoi266: React.FC = () => (
  <LeHoiBase
    dir="audio_lehoi266"
    lines={LINES}
    sfx={SFX}
    title="LẬT MẶT DƯỚI CỦA LÁ"
  />
);
