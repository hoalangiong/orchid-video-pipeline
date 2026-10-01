import { LeHoiBase, LeHoiLine, LeHoiSfx } from "./LeHoiBase";

const LINES: LeHoiLine[] = [
  { speaker: "MN", start: 0.0, end: 5.5, text: "Nhìn cái này chắc nhiều người tưởng con gì đang đậu trên cành. Hai cái râu dài, lại có cái mặt đàng hoàng." },
  { speaker: "MN", start: 5.85, end: 10.74, text: "Mà không phải con gì hết. Đó là bông hoa. Lan bướm, người mình hay kêu là vũ nữ tề thiên." },
  { speaker: "MN", start: 11.09, end: 16.85, text: "Hai cái râu đó là hai cánh hoa vươn thẳng lên. Còn cái mặt đó là cánh môi, với mấy đường vằn nâu chạy ngang." },
  { speaker: "MN", start: 17.2, end: 22.99, text: "Ngoài tự nhiên nó nhái y con bướm để dụ ong tới. Bông giả làm con ong tưởng thật, ghé vô là mang phấn đi giùm." },
  { speaker: "MN", start: 23.34, end: 28.57, text: "Cây này khỏi cần bông cũng đã đẹp. Lá nó lốm đốm như da báo, treo lên giàn nhìn là biết cây lạ." },
  { speaker: "MN", start: 28.92, end: 35.88, text: "Ngộ nhất là nó nở lai rai quanh năm. Bông này tàn thì cái vòi cũ đẩy bông khác ra, nên đừng cắt vòi, cắt là mất luôn mấy đợt sau." },
  { speaker: "MN", start: 36.23, end: 40.52, text: "Nhà mình nhìn thấy giống con gì? Comment cho mình biết nha, coi có ai thấy giống mình không." },
];

const SFX: LeHoiSfx[] = [
  { src: "sfx/ting.wav", at: 5.95, vol: 0.6 },
  { src: "sfx/ting.wav", at: 11.2, vol: 0.55 },
  { src: "sfx/ting.wav", at: 17.3, vol: 0.55 },
  { src: "sfx/ting.wav", at: 29.05, vol: 0.55 },
];

export const KHO273_TOTAL_FRAMES = 1260;

export const Kho273: React.FC = () => (
  <LeHoiBase
    dir="audio_kho273"
    lines={LINES}
    sfx={SFX}
    title="LAN BƯỚM VŨ NỮ TỀ THIÊN"
  />
);
