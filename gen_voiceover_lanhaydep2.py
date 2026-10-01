# -*- coding: utf-8 -*-
"""Voiceover Minh Niem 2 cho 5 video 'lan hay' - batch 2."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio_lanhaydep")

SCENES = {
    # Video 6: Dendro chop Burana Saphia
    "v6_title": "Cánh hoa viền trắng ôm màu tím ở giữa thế này, nhìn kỹ mới thấy đẹp cỡ nào.",
    "v6_tip": "Đây là Dendro chớp Burana Saphia, viền cánh trắng nổi bật, chùm hoa dày, càng nắng gắt màu lại càng rực.",
    "v6_outro": "Chớp viền trắng như vậy là dòng hiếm, ai chơi lan lâu mới để ý được. Bạn thấy dáng hoa này thế nào?",
    # Video 7: Korat Koki
    "v7_title": "Một chùm hoa tím mà xếp dày như vậy thì phải mất bao lâu mới ra được.",
    "v7_tip": "Korat Koki đây, cánh hoa tròn đều, màu tím đậm, chùm hoa nở đồng loạt nhìn cực kỳ sai.",
    "v7_outro": "Dáng hoa tròn đều thế này là dân chơi lan Thái rất chuộng. Bạn có đang tìm giống Korat không?",
    # Video 8: Ngoc Diem Koki
    "v8_title": "Một giò lan mà cả chùm hoa cong xuống như vậy, đứng gần là thơm nức mũi.",
    "v8_tip": "Đây là Ngọc Điểm Koki, hoa nở đúng dịp Tết, chùm dài, cánh dày, hương thơm bay xa cả một khoảng vườn.",
    "v8_outro": "Trồng một giò Ngọc Điểm để chơi Tết là chuẩn không cần chỉnh. Bạn có định trồng Ngọc Điểm năm nay không?",
    # Video 9: Hoang hau xanh
    "v9_title": "Một chùm hoa dài cả cánh tay mà vẫn đứng thẳng không gãy, quá đỉnh.",
    "v9_tip": "Hoàng hậu xanh đây, vòi hoa dài, hoa nở dày từ gốc tới ngọn, màu xanh vàng nhìn rất sang.",
    "v9_outro": "Chơi Hoàng hậu xanh mà ra vòi dài thế này là chăm đúng cách rồi. Bạn thích màu xanh vàng này chứ?",
    # Video 10: Son Thuy Tien
    "v10_title": "Một thân cây mà bám kín hoa vàng như thế này, tưởng cây phát sáng luôn.",
    "v10_tip": "Sơn Thủy Tiên đây, hoa mọc dày quanh thân cây gỗ, màu vàng chanh nổi bật, cứ đến mùa là bung nở rợp cả gốc.",
    "v10_outro": "Ghép Sơn Thủy Tiên lên thân cây lớn vậy quả là hoành tráng. Bạn có muốn thử ghép giống này không?",
}


def post_tts(text):
    body = json.dumps({
        "app_id": APP_ID, "input_text": text, "voice_code": VOICE,
        "audio_type": "mp3", "callback_url": "https://webhook.site/vbee-callback",
    }).encode("utf-8")
    req = urllib.request.Request(
        BASE, data=body,
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + TOKEN},
        method="POST")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))["result"]["request_id"]


def poll(request_id):
    req = urllib.request.Request(
        BASE + "/" + request_id,
        headers={"Authorization": "Bearer " + TOKEN}, method="GET")
    for _ in range(40):
        with urllib.request.urlopen(req, timeout=30) as r:
            res = json.loads(r.read().decode("utf-8"))["result"]
        if res.get("status") == "SUCCESS":
            return res["audio_link"]
        if res.get("status") == "FAILURE":
            raise RuntimeError("VBee failed for " + request_id)
        time.sleep(2)
    raise TimeoutError("poll timeout " + request_id)


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    with open(path, "wb") as f:
        f.write(data)
    return len(data)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, text in SCENES.items():
        print("=== " + name + " ===", flush=True)
        for attempt in range(3):
            try:
                rid = post_tts(text)
                link = poll(rid)
                path = os.path.join(OUT_DIR, name + ".mp3")
                size = download(link, path)
                print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
                break
            except Exception as e:
                print("  retry " + str(attempt) + ": " + str(e), flush=True)
                time.sleep(3)
    print("=== ALL VOICEOVER DONE (lanhaydep batch 2) ===", flush=True)


if __name__ == "__main__":
    main()
