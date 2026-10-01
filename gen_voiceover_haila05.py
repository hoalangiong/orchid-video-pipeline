# -*- coding: utf-8 -*-
"""Voiceover Minh Niem 2 cho video haila05_rungla (myth-busting: lan moi mua rung la khong phai do yeu)."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio_haila05_rungla")

SCENES = {
    "vo_title": "Lan mới mua về, chưa đầy một tuần đã rụng lá vàng úa, bạn nghĩ chắc do vận chuyển làm cây bị sốc chết?",
    "vo_tip": "Rất nhiều người thấy lan rụng lá sau khi mua liền nghĩ cây yếu hoặc bị lừa bán cây bệnh. Nhưng thực ra phần lớn trường hợp là do cây đang trải qua giai đoạn sốc môi trường, khi chuyển từ vườn trồng qua điều kiện ánh sáng, độ ẩm, gió hoàn toàn khác ở nhà bạn. Rụng vài lá già trong lúc thích nghi là phản ứng tự nhiên, không đồng nghĩa cây sắp chết.",
    "vo_outro": "Chỉ cần đặt cây ở nơi sáng nhẹ, tránh nắng gắt và gió lùa trong hai đến ba tuần đầu, hạn chế xáo trộn giá thể, cây sẽ ổn định và ra lá mới trở lại. Lan nhà bạn từng rụng lá lúc mới mua chưa? Comment cho tôi biết nhé.",
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
    print("=== ALL VOICEOVER DONE (haila05) ===", flush=True)


if __name__ == "__main__":
    main()
