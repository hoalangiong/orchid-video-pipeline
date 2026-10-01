# -*- coding: utf-8 -*-
"""Voiceover Minh Niem 2 cho video lanhay45_chuoingoc (myth-busting cham soc)."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio_lanhay45_chuoingoc")

SCENES = {
    "vo_title": "Nhìn chậu lan này, bạn có nghĩ chỉ cần tưới thật nhiều là chuỗi ngọc sẽ lớn nhanh không?",
    "vo_tip": "Chuỗi ngọc thích ẩm vừa phải nhưng cực sợ úng. Hãy để giá thể se mặt, tưới đẫm một lần rồi chờ khô thoáng; như vậy rễ mới khỏe và thân mới căng mọng.",
    "vo_outro": "Khi rễ khỏe, chuỗi ngọc sẽ bật mầm và treo rủ rất đẹp. Bạn đang trồng chuỗi ngọc ở chỗ nắng hay chỗ râm? Bình luận cho tôi biết nhé!",
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
    if not os.path.isdir(OUT_DIR): os.makedirs(OUT_DIR)
    for name, text in SCENES.items():
        print("=== " + name + " ===")
        for attempt in range(3):
            try:
                rid = post_tts(text)
                link = poll(rid)
                path = os.path.join(OUT_DIR, name + ".mp3")
                size = download(link, path)
                print("  saved " + path + " (" + str(size) + " bytes)")
                break
            except Exception as e:
                print("  retry " + str(attempt) + ": " + str(e))
                time.sleep(3)
    print("=== ALL VOICEOVER DONE (lanhay45) ===")


if __name__ == "__main__":
    main()



