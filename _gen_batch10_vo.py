# -*- coding: utf-8 -*-
"""Voiceover cho batch 10 video (giong n_hn_male_ngankechuyen_ytstable_vc)."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "n_hn_male_ngankechuyen_ytstable_vc"
BASE = "https://vbee.vn/api/v1/tts"

ROOT = os.path.dirname(os.path.abspath(__file__))
SCRIPTS_PATH = os.path.join(ROOT, "_batch10_scripts.json")
PUBLIC = os.path.join(ROOT, "public")


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
        except Exception:
            time.sleep(2)
            continue
        if res.get("status") == "SUCCESS":
            return res["audio_link"]
        if res.get("status") == "FAILURE":
            raise RuntimeError("VBee failed for " + request_id)
        time.sleep(2)
    raise TimeoutError("poll timeout " + request_id)


def gen_scene_with_retry(text, path, tries=3):
    """post_tts+poll+download 1 cau, retry khi gap loi tam thoi (502/timeout)."""
    last_err = None
    for attempt in range(tries):
        try:
            rid = post_tts(text)
            link = poll(rid)
            return download(link, path)
        except Exception as e:
            last_err = e
            time.sleep(3)
    raise last_err


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    with open(path, "wb") as f:
        f.write(data)
    return len(data)


def gen_one(video_key, cfg):
    slug = cfg["slug"]
    out_dir = os.path.join(PUBLIC, "audio_" + slug)
    os.makedirs(out_dir, exist_ok=True)

    scenes = {"vo_title": cfg["vo_title"]}
    for i, tip in enumerate(cfg["tips"], 1):
        scenes["vo_tip%d" % i] = tip["text"]
    scenes["vo_outro"] = cfg["vo_outro"]

    print("### %s (%s) ###" % (video_key, slug), flush=True)
    for name, text in scenes.items():
        path = os.path.join(out_dir, name + ".mp3")
        if os.path.exists(path):
            print("  %s -> da co san, bo qua (%d bytes)" % (name, os.path.getsize(path)), flush=True)
            continue
        size = gen_scene_with_retry(text, path)
        print("  %s -> %s (%d bytes)" % (name, path, size), flush=True)


def main():
    with open(SCRIPTS_PATH, "r", encoding="utf-8") as f:
        scripts = json.load(f)
    for key, cfg in scripts.items():
        gen_one(key, cfg)
    print("=== ALL 10 VIDEOS VOICEOVER DONE ===", flush=True)


if __name__ == "__main__":
    main()
