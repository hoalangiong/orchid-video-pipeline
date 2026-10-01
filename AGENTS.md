# AGENTS.md — Hướng dẫn cho Codex (hoặc bất kỳ coding agent nào khác)

File này Codex CLI tự động đọc khi mở project này. Mục tiêu: giúp Codex tiếp quản pipeline sản xuất video TikTok hoa lan mà không cần hỏi lại từ đầu.

Đọc file này TRƯỚC. Nếu cần chi tiết sâu hơn về 1 mục cụ thể, xem `HANDOFF.md` cùng thư mục (viết chi tiết hơn, cùng nội dung gốc).

## Bối cảnh project

- Thư mục: `C:\Users\Dell Precision 5560\.openclaw\remotion-video\` — **không phải git repo**, không có `.git`. Không kỳ vọng thao tác git ở đây.
- Máy Windows, chạy Claude Code (Anthropic) làm agent chính từ trước tới nay. Codex là agent MỚI được thêm vào, có thể chạy song song hoặc thay thế cho 1 số task.
- Mục tiêu sản phẩm: video TikTok dọc 9:16 về hoa lan (viral/chăm sóc/quảng cáo), tiếng Việt, dùng clip thật (không AI-generate video) + giọng đọc AI (VBee TTS) + composition Remotion.
- Người dùng KHÔNG code, chỉ ra yêu cầu bằng tiếng Việt. Trả lời/tường thuật nên bằng tiếng Việt trừ khi user chỉ định khác.

## Việc chính đang làm: batch lanhay41-50

10 video theo pipeline chuẩn, đánh số 41-50, slug mô tả sau số (ví dụ `lanhay44_bobephan`). Trạng thái:

| # | Slug | Trạng thái |
|---|------|-----------|
| 41 | longnhan | ✅ hoàn tất |
| 42 | kiemhongdaknak | ✅ hoàn tất |
| 43 | ngocdiem | ✅ hoàn tất |
| 44 | bobephan | ✅ hoàn tất |
| 45 | chuoingoc | ⏳ chưa làm |
| 46 | lake | ⏳ chưa làm |
| 47 | nhanbiet | ⏳ chưa làm |
| 48 | koratkoki | ⏳ chưa làm |
| 49 | boquensong | ⏳ chưa làm |
| 50 | quetrang | ⏳ chưa làm |

Gợi ý clip nguồn cho các video còn lại nằm trong `HANDOFF.md` mục "Trạng thái batch hiện tại".

## Pipeline chuẩn cho 1 video mới (bắt buộc theo đúng thứ tự)

1. **Chọn clip nguồn** từ `tulieu-video/tulieu/<cat>/{tiktok,facebook}/*.mp4`. Lọc qua `classify.csv`/`manifest.csv` (xem mục CSV dưới).
2. **Cắt/biến đổi clip bằng ffmpeg** — bắt buộc, để né TikTok Content Check bắt trùng clip nguồn (xem "Copyright-evasion filter").
3. **Sinh giọng đọc VBee TTS** — viết 1 script Python riêng cho video đó, copy từ `gen_voiceover_lanhay44.py` làm mẫu.
4. **Đo thời lượng mp3 bằng ffprobe**, tính `durationInFrames = round((giây_voiceover + 1.5) * 30fps)` mỗi cảnh.
5. **Tạo file composition** `src/OrchidLanHay<N>.tsx`, copy cấu trúc từ file gần nhất (ví dụ `OrchidLanHay44.tsx`), chỉ sửa số, SCENES, text, đường dẫn asset.
6. **Đăng ký vào `src/Root.tsx` — BẮT BUỘC 2 chỗ riêng biệt** (xem cảnh báo dưới, lỗi hay gặp nhất).
7. **Render** với TEMP redirect sang ổ D (xem mục Disk Space).
8. **Verify bằng ffprobe**: có stream h264 (video) + aac (audio), đúng 1080x1920, đúng duration khớp tổng SCENES/30fps.

## ⚠️ Cảnh báo #1: Root.tsx cần đăng ký ĐỦ 2 phần

Lỗi runtime hay gặp nhất: `Could not find composition with ID OrchidLanHayXX`.

**Đây từng bị chẩn đoán sai 2 lần** là do cache webpack cũ (xóa `node_modules/.cache/webpack` không fix được gì) trước khi tìm ra nguyên nhân thật: file `Root.tsx` có import nhưng **thiếu hẳn Composition JSX block**. Bài học: khi gặp lỗi "Could not find composition", đừng đoán cache trước — `grep` trực tiếp Root.tsx để xác nhận CẢ HAI phần dưới đây tồn tại cho đúng ID:

**(a) Import ở đầu file:**
```tsx
import { OrchidLanHay44, LANHAY44_TOTAL_FRAMES } from "./OrchidLanHay44";
```

**(b) Composition block trong JSX return:**
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

Luôn thêm cả 2 CÙNG LÚC trong 1 lần sửa, và đọc lại file sau khi sửa để xác nhận cả 2 đều có mặt — đừng chỉ thêm 1 rồi tin là xong.

## ⚠️ Cảnh báo #2: Disk space — luôn render qua ổ D

Ổ C máy này chỉ còn ~16GB trống (353GB tổng). Remotion bundler copy toàn bộ `public/` (16-17GB+, tăng dần mỗi video mới) vào Windows temp trước khi render → dễ ENOSPC giữa chừng.

**Không được xóa file trên ổ C mà không hỏi user trước** — kể cả log cũ, cache, hay file trông như rác. User đã từ chối cho tự động dọn ổ C; giải pháp đã chốt là dùng ổ D.

Fix bắt buộc: redirect `TEMP`/`TMP` sang `D:\remotion-temp` (306GB+ trống) CHỈ cho lệnh render, không set global:

Trong bash (Git Bash trên máy này, hoặc Codex chạy trong WSL/bash tương đương):
```bash
cd "/c/Users/Dell Precision 5560/.openclaw/remotion-video"
TEMP="D:\\remotion-temp" TMP="D:\\remotion-temp" npx remotion render OrchidLanHay44 out/lanhay44.mp4 --concurrency=2
```

Nếu Codex chạy native trên `cmd.exe`/PowerShell (không qua Git Bash):
```powershell
$env:TEMP = "D:\remotion-temp"; $env:TMP = "D:\remotion-temp"
npx remotion render OrchidLanHay44 out/lanhay44.mp4 --concurrency=2
```

Luôn dùng `--concurrency=2` — máy yếu, concurrency cao dễ crash giữa render. Thư mục `D:\remotion-temp` phải tồn tại trước (tạo bằng `mkdir` nếu chưa có).

## Môi trường lệnh trên máy này

- Có sẵn Git Bash — path Unix-style (`/c/Users/...`) hoạt động tốt cho ffmpeg/ffprobe/npx.
- Python: dùng lệnh `py` (Python 3.12). **KHÔNG dùng `python3`** — alias bị hỏng trên máy này.
- ffmpeg/ffprobe không có trong PATH, phải gọi full path:
  ```
  C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg
  C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffprobe
  ```
- Render chạy lâu (vài chục giây đến vài phút) — nên chạy nền (background) và poll log file bằng cách chờ marker `EXIT:$?` được ghi vào cuối, không polling liên tục tốn lệnh.

## Template composition (copy từ `src/OrchidLanHay44.tsx`)

Cấu trúc chuẩn mỗi video: 3 cảnh (title/hook → tip → outro), mỗi cảnh có video nền + voiceover riêng.

```tsx
import {
  AbsoluteFill, Audio, OffthreadVideo, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Series,
} from "remotion";

const SCENES = { title: <frames>, tip: <frames>, outro: <frames> };
const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

// Sub-components dùng lại nguyên văn giữa các video:
// - MotionBG: video nền full-bleed + gradient tối phía dưới
// - SceneFade: fade in/out toàn cảnh
// - CineCaption: chữ phụ đề (dùng cho cảnh tip)
// - HookScene: cảnh mở (câu hỏi/hook giật tít)
// - TwistScene: cảnh kết (giải pháp + CTA)

export const LANHAY<N>_TOTAL_FRAMES = TOTAL;

export const OrchidLanHay<N>: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#04060c" }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.title}>
        {/* HookScene + <Audio src={staticFile("audio_lanhay<N>_<slug>/vo_title.mp3")} /> */}
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

Asset convention, tất cả nằm trong `public/`:
- Video: `clips_lanhay<N>_<slug>/{title,tip,outro}.mp4`
- Audio: `audio_lanhay<N>_<slug>/vo_{title,tip,outro}.mp3`

## VBee TTS — sinh giọng đọc

Copy `gen_voiceover_lanhay44.py`, chỉ sửa `OUT_DIR` và dict `SCENES` (text tiếng Việt, 3 dòng: title/tip/outro). Credentials cố định (đã cấp phép dùng, không đổi):

```python
APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
```

Flow: POST tạo job → poll GET `{BASE}/{request_id}` tới `result.status == "SUCCESS"` (có `audio_link`) → tải mp3 (header `User-Agent: Mozilla/5.0` khi download, không cần khi post/poll). Chạy bằng `py <script>.py`.

**Không đổi giọng/tốc độ/pitch** — user yêu cầu giữ nguyên tone giọng Minh Niệm 2 xuyên suốt kênh.

## Copyright-evasion ffmpeg filter (bắt buộc cho MỌI clip lấy từ tulieu-video)

```bash
FFMPEG="C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg"
COMMON="-map_metadata -1 -metadata comment= -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -an -r 30 -movflags +faststart -y"

"$FFMPEG" -ss <start> -t <duration> -i "<source.mp4>" \
  -vf "hflip,crop=iw*0.92:ih*0.92:iw*0.04:ih*0.04,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.06:saturation=1.08:brightness=0.0" \
  $COMMON "public/clips_lanhay<N>_<slug>/<scene>.mp4"
```

Biến thiên `hflip` (bật/tắt), tỉ lệ crop (0.90-0.96), giá trị `eq` (contrast/saturation/brightness) khác nhau giữa các clip trong CÙNG 1 video — để không tạo pattern giống nhau lặp lại.

## Kho clip nguồn: `tulieu-video/`

Hai file CSV:

- **`classify.csv`**: cột `file, cat, scene, loai_lan, nguoi_nuocngoai, cay_khoemanh, chu_trong_hinh, canhbao, ghichu`. Category thật có: `chamsoc, mathoa, bo, thamkhao, vuongian` (KHÔNG có category "sailam" — clip cây bệnh/lỗi chăm sóc nằm TRONG `cat=chamsoc` với `cay_khoemanh=False`).
- **`manifest.csv`**: cột `taixong, cat, platform, id, uploader, title, duration_s, resolution, vcodec, tbr_kbps, size_mb, file, url`. Join classify.csv qua cột `file`.

**Không có cột nào track đã dùng clip nào cho video nào** — phải tự nhớ để tránh trùng clip giữa các video trong batch.

**Quan trọng — đừng hiểu nhầm clip "xấu" là phế phẩm**: clip có `cay_khoemanh=False` (lá vàng/thối/héo) là TƯ LIỆU HỢP LỆ cho video minh họa lỗi chăm sóc hoặc trị bệnh (nhóm `chamsoc`). Chỉ tránh dùng cho video giới thiệu/quảng cáo cần cây đẹp. Nếu filter theo `cay_khoemanh=True` mà không ra clip phù hợp cho 1 video kiểu "myth-busting sai lầm", đó là filter sai chứ không phải hết clip — filter đúng là `cay_khoemanh=False`.

Clip có `chu_trong_hinh=True` cần crop cẩn thận để né chữ/logo đã burn sẵn trong hình.

## Quy tắc nội dung bắt buộc (đã chốt với user, KHÔNG tự ý đổi)

- Người Việt/châu Á trong hình, **tuyệt đối không người nước ngoài** (Tây, da đen...).
- Voiceover mở đầu bằng HOOK (tò mò/bất ngờ/nỗi đau), KHÔNG chào "cả nhà".
- Nhịp nhanh: mỗi cảnh ≈ voiceover + 1.5s (không cộng 3s như bản cũ hơn).
- **Không nhạc nền** — user tự ghép nhạc trending TikTok sau khi có video. Không thêm bất kỳ `<Audio>` bgm nào ngoài voiceover.
- **Không hiện tên kênh** ở outro — kết bằng CTA (mời comment hoặc thả tim/like).
- Cây/lan trong hình phải trông khỏe mạnh xanh mướt, TRỪ khi đang minh họa lỗi chăm sóc (xem mục clip nguồn).
- Không dùng lớp phủ tối toàn khung hay hộp nền đen sau chữ — chỉ dùng `textShadow` quanh chữ (code hiện tại trong template đã đúng chuẩn này, giữ nguyên).
- Dòng lan chính: đa dạng loại (Cattleya, Dendrobium, Vanda...), không còn giới hạn chỉ Dendrobium như quy định cũ.

## Lệnh hữu ích (tóm tắt)

```bash
# Render 1 video (luôn redirect ổ D)
TEMP="D:\\remotion-temp" TMP="D:\\remotion-temp" npx remotion render OrchidLanHay<N> out/lanhay<N>.mp4 --concurrency=2

# Verify output
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -show_entries format=duration -of default=noprint_wrappers=1 out/lanhay<N>.mp4

# Sinh giọng đọc
py gen_voiceover_lanhay<N>.py
```

## Nhánh phụ: web app tự tạo video (đang phát triển riêng, KHÔNG phải batch chính)

Có 1 Express server ở `server/` (chạy `npm run web`, port 3200) + frontend Alpine.js ở `web/` cho phép user tự tạo video qua browser, không cần vào agent. Đây là dự án con riêng biệt khỏi batch `lanhay41-50`. Nếu Codex được giao việc trên nhánh này, hỏi user xem có plan/tài liệu riêng nào cần đọc trước không — đừng giả định context từ batch chính áp dụng ở đây.

## Nguyên tắc làm việc chung (áp dụng cho mọi agent, không riêng Claude)

- Thay đổi tối thiểu, đúng phạm vi yêu cầu — không "cải thiện" code xung quanh không liên quan.
- Khi sửa lỗi lặp lại (như lỗi Root.tsx ở trên): nếu 1 cách fix thất bại 2 lần, dừng lại tìm root cause thật, đừng lặp lại cùng 1 hướng fix.
- Verify bằng công cụ thật (ffprobe) sau mỗi render, không chỉ tin log "Encoded N/N" là đủ — luôn kiểm tra file output tồn tại + đúng codec/resolution/duration.
- Không xóa file trên ổ C, không dọn log cũ, không tự động "cleanup" thư mục project mà không hỏi trước — thư mục có rất nhiều file log/script cũ từ các batch trước, đó là lịch sử làm việc, không phải rác.
