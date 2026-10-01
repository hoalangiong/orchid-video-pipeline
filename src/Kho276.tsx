import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 4.27, text: "Lan mà trồng dưới đất? Nghe lạ hả. Mà có thiệt đó, và nó đẹp dữ dội." },
  { speaker: "MN", start: 4.62, end: 10.84, text: "Lan đất, người mình hay kêu là địa lan. Khác với lan rừng bám trên cây, mấy dòng này sống trong đất, trong lá mục." },
  { speaker: "MN", start: 11.19, end: 15.7, text: "Lá nó dài và mềm, mọc thành bụi. Nhìn xa tưởng cây cỏ, tới mùa hoa mới biết là lan." },
  { speaker: "MN", start: 16.05, end: 20.49, text: "Hoa lan đất thường thơm. Thơm nhẹ, thơm thanh, không gắt như mấy dòng lan công nghiệp." },
  { speaker: "MN", start: 20.84, end: 27.25, text: "Chơi lan đất dễ hơn lan rừng. Không lo úng rễ, không lo nắng cháy. Cứ trồng vô chậu đất trộn xơ dừa là sống." },
  { speaker: "MN", start: 27.6, end: 32.81, text: "Mà nó có cái khó riêng. Chậm lớn. Một năm ra được hai ba lá là mừng rồi. Phải kiên nhẫn." },
  { speaker: "MN", start: 33.16, end: 38.27, text: "Bù lại, khi nó bung vòi hoa là đáng công chờ. Vòi dài cả gang tay, bông xếp đều, màu nhã." },
  { speaker: "MN", start: 38.62, end: 42.53, text: "Nhà mình đã từng trồng lan đất chưa? Comment cho mình biết trải nghiệm nha." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 4.7, vol: 0.6 },
  { src: "sfx/ting.wav", at: 11.3, vol: 0.55 },
  { src: "sfx/ting.wav", at: 16.15, vol: 0.55 },
  { src: "sfx/ting.wav", at: 27.7, vol: 0.55 },
];

export const KHO276_TOTAL_FRAMES = 1288;

export const Kho276: React.FC = () => (
  <LeHoiBase
    dir="audio_kho276"
    lines={LINES}
    sfx={SFX}
    title="LAN ĐẤT ĐỊA LAN"
  />
);
