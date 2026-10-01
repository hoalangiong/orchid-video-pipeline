# -*- coding: utf-8 -*-
"""Voiceover Minh Niem 2 cho video haila08_doichau (myth-busting: doi chau sai thoi diem cay tan)."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio_haila08_doichau")

SCENES = {
    "vo_title": "Vừa đổi chậu xong, lan không những không phát triển mà còn vàng lá, rụng rễ, bạn nghĩ chắc do chậu mới không hợp?",
    "vo_tip": "Rất nhiều người thấy lan tàn sau khi đổi chậu liền nghĩ chậu mới có vấn đề hoặc giá thể không tốt. Nhưng thực ra nguyên nhân thường là đổi chậu sai thời điểm, đổi lúc cây đang ra hoa hoặc ra rễ non làm đứt rễ hàng loạt, hoặc tưới nước ngay sau khi đổi khiến rễ mới cắt bị úng thối. Chậu không sai, chỉ là thời điểm và cách làm chưa đúng.",
    "vo_outro": "Chỉ cần đổi chậu vào lúc cây vừa hết mùa hoa, cắt rễ hư nhẹ tay và để khô vết cắt một đến hai ngày trước khi tưới lại, cây sẽ hồi phục và bám rễ mới rất nhanh. Bạn từng đổi chậu làm lan tàn chưa? Comment cho tôi biết nhé.",
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
    print("=== ALL VOICEOVER DONE (haila08) ===", flush=True)


if __name__ == "__main__":
    main()
