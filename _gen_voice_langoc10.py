# -*- coding: utf-8 -*-
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "n_hn_male_ngankechuyen_ytstable_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio_langoc10")

SCENES = {
    "vo_title": "Những giống lan này giá cả triệu một cây, mà nhiều người chơi lan lâu năm vẫn chưa từng thấy.",
    "vo_tip1": "Giả hạc đỏ, hoa to màu đỏ rượu, cánh dày, nở là rực cả giàn.",
    "vo_tip2": "Hoàng nhạn, hoa vàng chanh thơm nhẹ, dáng thân đứng rất sang.",
    "vo_tip3": "Kim điệp, hoa vàng chùm dài, chơi được cả cây để nguyên bụi.",
    "vo_tip4": "Phi điệp vàng, hoa to cánh dày, mùi thơm bay xa cả khu vườn.",
    "vo_tip5": "Ngọc điểm, hoa trắng tím nở đúng Tết, mùi thơm đậm nhất trong các dòng lan.",
    "vo_outro": "Bạn đang trồng giống nào trong số này? Comment số thứ tự cho tôi biết nhé!",
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
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                res = json.loads(r.read().decode("utf-8"))["result"]
        except Exception as e:
            print("  poll error, retrying:", e, flush=True)
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
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, text in SCENES.items():
        print("=== " + name + " ===", flush=True)
        rid = post_tts(text)
        link = poll(rid)
        path = os.path.join(OUT_DIR, name + ".mp3")
        size = download(link, path)
        print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
    print("=== ALL VOICEOVER DONE ===", flush=True)


if __name__ == "__main__":
    main()
