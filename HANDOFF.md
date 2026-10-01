# HANDOFF — Orchid TikTok Video Pipeline

Tài liệu này để một AI coding tool khác (Codex, hoặc bất kỳ agent nào) tiếp quản project này mà không cần Claude giải thích lại từ đầu. Đọc hết trước khi sửa gì.

## Mục tiêu project

Sản xuất video TikTok dọc 9:16 về hoa lan (viral, chăm sóc, quảng cáo) bằng pipeline tự động: chọn clip thật → sinh giọng đọc AI → dựng composition Remotion → render mp4. Ngôn ngữ nội dung: tiếng Việt.

Thư mục gốc: `C:\Users\Dell Precision 5560\.openclaw\remotion-video\` (không phải git repo).

## Pipeline chuẩn cho 1 video mới

1. **Chọn clip nguồn** từ `tulieu-video/tulieu/<cat>/tiktok/*.mp4` hoặc `facebook/*.mp4` (xem mục CSV bên dưới để lọc).
2. **Cắt/biến đổi clip bằng ffmpeg** (bắt buộc, để tránh TikTok Content Check bắt trùng — xem mục "Copyright-evasion filter").
3. **Sinh giọng đọc VBee TTS** — viết script Python riêng cho video đó (xem mẫu `gen_voiceover_lanhay44.py`).
4. **Đo thời lượng mp3** bằng ffprobe, tính `durationInFrames = round((giây_voiceover + 1.5) * 30fps)` cho mỗi cảnh.
5. **Tạo file composition** `src/OrchidLanHay<N>.tsx` theo template có sẵn (copy từ file gần nhất, sửa số + nội dung).
6. **Đăng ký vào `src/Root.tsx` — BẮT BUỘC 2 chỗ**, xem mục cảnh báo dưới đây, đây là lỗi hay gặp nhất.
7. **Render**: dùng lệnh redirect TEMP sang ổ D (xem mục Disk Space).
8. **Verify bằng ffprobe**: kiểm tra có stream h264 (video) + aac (audio), đúng resolution 1080x1920, đúng duration.

## ⚠️ CẢNH BÁO QUAN TRỌNG NHẤT: Root.tsx cần ĐĂNG KÝ 2 LẦN

Lỗi runtime phổ biến nhất: `Could not find composition with ID OrchidLanHayXX`.

Root.tsx cần **cả hai** phần sau, thiếu 1 trong 2 sẽ lỗi:

**(a) Import ở đầu file:**
```tsx
import { OrchidLanHay44, LANHAY44_TOTAL_FRAMES } from "./OrchidLanHay44";
```

**(b) Composition JSX block trong `<CompositionSelector>` / return JSX:**
```tsx
<Composition
  id="OrchidLanHay44"
  component={OrchidLanHay44}
  durationInFrames={LANHAY44_TOTAL_FRAMES}
  fps={30}
  width={1080}
  height={1920}
/>
```

**Bài học thực tế**: video #43 (Ngọc Điểm) fail render 3 lần liên tiếp với lỗi "Could not find composition". Chẩn đoán sai lần đầu là do cache webpack cũ (đã xóa `node_modules/.cache/webpack`, không fix được). Nguyên nhân thật: import đã có nhưng **Composition block bị thiếu hoàn toàn** trong Root.tsx — block nhảy thẳng từ #42 sang OrchidPropagate. Sau khi đọc kỹ Root.tsx và thêm block thiếu, render mới thành công.

**Quy tắc rút ra**: khi gặp lỗi "Could not find composition", đừng vội nghĩ là cache — hãy `grep` trực tiếp trong Root.tsx để xác nhận CẢ import VÀ Composition block đều tồn tại cho đúng ID đó, trước khi thử fix gì khác.

## Disk Space — dùng ổ D cho render

Máy này ổ C chỉ còn ~16GB trống (353GB tổng). Remotion render cần nhiều temp space, dễ bị lỗi ENOSPC. **Không được xóa file trên ổ C mà không hỏi user trước.**

Fix: redirect biến môi trường TEMP/TMP sang ổ D (306GB trống) chỉ cho lệnh render:

```bash
TEMP="D:\\remotion-temp" TMP="D:\\remotion-temp" npx remotion render OrchidLanHay44 out/lanhay44.mp4 --concurrency=2
```

Luôn dùng `--concurrency=2` (máy yếu, concurrency cao dễ crash).

## Template composition (copy từ file gần nhất, ví dụ OrchidLanHay44.tsx)

Cấu trúc chuẩn mỗi video (3 cảnh: title/hook → tip → outro):

```tsx
import {
  AbsoluteFill, Audio, OffthreadVideo, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Series,
} from "remotion";

const SCENES = { title: <frames>, tip: <frames>, outro: <frames> };
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

// Sub-components: MotionBG (video nền + gradient tối), SceneFade (fade in/out),
// CineCaption (chữ phụ đề), HookScene (cảnh mở), TwistScene (cảnh kết + CTA)

export const LANHAY<N>_TOTAL_FRAMES = TOTAL;

export const OrchidLanHay<N>: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.title}>
        {/* HookScene + Audio vo_title.mp3 */}
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.tip}>
        {/* MotionBG + CineCaption + Audio vo_tip.mp3 */}
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.outro}>
        {/* TwistScene + Audio vo_outro.mp3 */}
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
```

Assets tham chiếu qua `staticFile()`:
- Video: `clips_lanhay<N>_<slug>/{title,tip,outro}.mp4`
- Audio: `audio_lanhay<N>_<slug>/vo_{title,tip,outro}.mp3`

Cả hai nằm trong `public/`.

## VBee TTS — sinh giọng đọc

Copy `gen_voiceover_lanhay44.py`, chỉ sửa `OUT_DIR` và dict `SCENES` (text tiếng Việt). Credentials cố định:

```python
APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
```

Flow: POST tạo job → poll GET `{BASE}/{request_id}` tới `status == "SUCCESS"` → tải mp3 (cần header `User-Agent: Mozilla/5.0` khi download, không cần khi poll/post). Chạy bằng `py <script>.py` (không dùng `python3`, alias hỏng trên máy này).

**Không đổi giọng/tốc độ/pitch** — giữ nguyên tone Minh Niệm 2 theo yêu cầu user.

## Copyright-evasion ffmpeg filter (bắt buộc cho mọi clip)

```bash
FFMPEG="C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg"
COMMON="-map_metadata -1 -metadata comment= -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -an -r 30 -movflags +faststart -y"

"$FFMPEG" -ss <start> -t <duration> -i "<source.mp4>" \
  -vf "hflip,crop=iw*0.92:ih*0.92:iw*0.04:ih*0.04,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.06:saturation=1.08:brightness=0.0" \
  $COMMON "public/clips_lanhay<N>_<slug>/<scene>.mp4"
```

Biến thiên `hflip` (bật/tắt), tỉ lệ crop (0.90-0.96), giá trị `eq` giữa các clip trong cùng video để tránh pattern giống nhau.

ffprobe/ffmpeg path đầy đủ:
```
C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\{ffmpeg,ffprobe}
```

## Kho clip nguồn: tulieu-video/

Hai file CSV ở `tulieu-video/`:

- **`classify.csv`** (119 dòng): cột `file, cat, scene, loai_lan, nguoi_nuocngoai, cay_khoemanh, chu_trong_hinh, canhbao, ghichu`. Category có thật: `chamsoc, mathoa, bo, thamkhao, vuongian` (KHÔNG có "sailam").
- **`manifest.csv`** (136 dòng): cột `taixong, cat, platform, id, uploader, title, duration_s, resolution, vcodec, tbr_kbps, size_mb, file, url`. Join với classify.csv qua cột `file`.

**Không có cột nào track video nào đã dùng clip nào** — phải tự nhớ/ghi lại nếu muốn tránh trùng clip giữa các video trong batch.

**Quan trọng**: clip có `cay_khoemanh=False` (cây yếu/lá vàng/thối) KHÔNG phải phế phẩm — đây là tư liệu hợp lệ cho video minh họa lỗi chăm sóc hoặc trị bệnh (nhóm `chamsoc`). Chỉ tránh dùng cho video giới thiệu/quảng cáo cần cây đẹp.

## Quy tắc nội dung bắt buộc (đã chốt với user, không tự ý đổi)

- Người Việt/châu Á trong hình, **tuyệt đối không người nước ngoài**.
- Voiceover mở đầu bằng HOOK (tò mò/bất ngờ/nỗi đau), không chào "cả nhà".
- Nhịp nhanh: mỗi cảnh ≈ voiceover + 1.5s (không cộng 3s).
- **Không nhạc nền** — user tự ghép nhạc trending TikTok sau. Không thêm `<Audio>` bgm nào ngoài voiceover.
- **Không hiện tên kênh** ở outro — kết bằng CTA (mời comment hoặc thả tim).
- Cây/lan trong hình phải trông khỏe mạnh xanh mướt, TRỪ khi đang minh họa lỗi chăm sóc (xem mục clip nguồn).
- Bỏ lớp phủ tối toàn khung và hộp nền đen sau chữ — chỉ dùng viền/shadow đen quanh chữ (`textShadow` trong code hiện tại đã đúng chuẩn này).

## Trạng thái batch hiện tại (lanhay41-50)

| # | Slug | Trạng thái |
|---|------|-----------|
| 41 | longnhan | ✅ hoàn tất |
| 42 | kiemhongdaknak | ✅ hoàn tất |
| 43 | ngocdiem | ✅ hoàn tất (verified: h264/aac, 1080x1920, 20.69s) |
| 44 | bobephan | ✅ hoàn tất (verified: h264/aac, 1080x1920, 21.8s) |
| 45 | chuoingoc | ⏳ chưa làm — nguồn gợi ý: `tulieu/mathoa/tiktok/20260905_6603033741076217857_7682064334687669512.mp4` (⚠️ chu_trong_hinh=True, crop cẩn thận) |
| 46 | lake | ⏳ chưa làm — nguồn gợi ý: `m.facebook.com_1826347075009092.mp4` hoặc `tulieu/chamsoc/tiktok/tiktok.com_7675607210919070994.mp4` |
| 47 | nhanbiet | ⏳ chưa làm — chưa có clip nguồn cố định |
| 48 | koratkoki | ⏳ chưa làm — nguồn gợi ý: `tulieu/mathoa/tiktok/20260711_7016637895508231169_7661224961884933397.mp4` |
| 49 | boquensong | ⏳ chưa làm — chưa có clip nguồn cố định |
| 50 | quetrang | ⏳ chưa làm — nguồn gợi ý: `tulieu/mathoa/tiktok/20260823_7676687708970615816_7677041190990089490.mp4` (576x1024, h264, 36s) |

Output render nằm ở `remotion-video/out/lanhay<N>.mp4`.

## Lệnh hữu ích

```bash
# Render 1 video
TEMP="D:\\remotion-temp" TMP="D:\\remotion-temp" npx remotion render OrchidLanHay<N> out/lanhay<N>.mp4 --concurrency=2

# Verify output
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -show_entries format=duration -of default=noprint_wrappers=1 out/lanhay<N>.mp4

# Sinh giọng đọc
py gen_voiceover_lanhay<N>.py
```

## Web app (nhánh phụ, đang phát triển riêng)

Có 1 Express server ở `server/` (port 3200, chạy `npm run web`) cho phép user tự tạo video qua browser không cần vào Claude — đây là 1 dự án con riêng biệt, không liên quan trực tiếp đến batch lanhay41-50. Có tài liệu kế hoạch riêng nếu cần tiếp tục việc này (hỏi user).
