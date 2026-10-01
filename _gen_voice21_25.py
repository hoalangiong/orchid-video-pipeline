# -*- coding: utf-8 -*-
"""Voiceover VBee giong Minh Niem 2 cho 5 video LanHay21-25."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_ROOT = os.path.join("remotion-video", "public")

VIDEOS = {
    "audio_lanhay21_longtu": {
        "vo_title": "Một cây lan có thân dài hơn hai mét, buông thẳng xuống như thác nước như thế này, bạn đã từng thấy chưa?",
        "vo_tip": "Long Tu đây, thân dài buông xuống cả hai mét, hoa trắng tím nở khắp thân, nhìn như một bức tường hoa tự nhiên.",
        "vo_outro": "Bạn có muốn trồng một giò Long Tu buông dài như vậy trong nhà không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay22_cattleya": {
        "vo_title": "Một bông lan to gần bằng cả bàn tay, cánh hoa tím rực rỡ như thế này, bạn có biết là lan gì không?",
        "vo_tip": "Cattleya đây, cánh hoa to và dày, màu tím rực kèm viền cánh xoăn, một trong những dòng lan hoa to đẹp nhất.",
        "vo_outro": "Bạn thích màu tím này không? Thả tim nếu bạn cũng mê Cattleya như tôi nhé!",
    },
    "audio_lanhay23_vaysac": {
        "vo_title": "Một dây lan dài như con rắn, leo bò khắp giàn, nở hoa đỏ rực như thế này, bạn dám trồng không?",
        "vo_tip": "Vảy Rắn đây, thân dài leo bò như rắn, hoa đỏ cam nở thành từng chùm dày, càng để lâu dây càng dài và càng nhiều hoa.",
        "vo_outro": "Bạn thấy tên Vảy Rắn có hợp không? Comment ý kiến của bạn nhé!",
    },
    "audio_lanhay24_daichau": {
        "vo_title": "Chùm lan trắng hồng nở dày như chùm nho, thơm ngát khắp nhà vào đúng dịp Tết, đây là lan gì vậy?",
        "vo_tip": "Đai Châu đây, hay còn gọi Ngọc Điểm, hoa nở thành chùm dày đặc như nho, trắng pha hồng, thơm nồng đúng vào dịp Tết.",
        "vo_outro": "Nhà bạn có chưng Đai Châu ngày Tết không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay25_kieutim": {
        "vo_title": "Một khúc gỗ lũa to được ghép kín hoa tím rực như thế này, bạn có nghĩ đó là lan thật không?",
        "vo_tip": "Kiều Tím đây, ghép trực tiếp lên khúc gỗ lũa lớn, hoa tím nở dày kín thân, mô phỏng đúng cách lan mọc tự nhiên ngoài rừng.",
        "vo_outro": "Bạn có muốn thử ghép lan lên gỗ lũa như thế này không? Comment số của bạn nhé!",
    },
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
    for _ in range(60):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                res = json.loads(r.read().decode("utf-8"))["result"]
        except Exception as e:
            print("  poll retry: " + str(e), flush=True)
            time.sleep(3)
            continue
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
    for out_dir, scenes in VIDEOS.items():
        full_dir = os.path.join(OUT_ROOT, out_dir)
        os.makedirs(full_dir, exist_ok=True)
        for name, text in scenes.items():
            path = os.path.join(full_dir, name + ".mp3")
            if os.path.exists(path):
                print("  skip " + path + " (exists)", flush=True)
                continue
            print("=== %s / %s ===" % (out_dir, name), flush=True)
            rid = post_tts(text)
            link = poll(rid)
            size = download(link, path)
            print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
    print("=== ALL VOICEOVER DONE (batch 21-25) ===", flush=True)


if __name__ == "__main__":
    main()
