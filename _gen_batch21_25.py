# -*- coding: utf-8 -*-
"""Sinh anh PlenX cho 5 video dau (LanHay21-25). Khong dung clip TikTok -> ne ban quyen tu goc."""
import json, os, sys, time, urllib.request, urllib.error

KEY = "pk_DTPwClXhmgqRD3ZPljm0ZXuMUlqQMIjBGZiLO3BBpDGfaBEo"
BASE = "https://plenxai.com/api/v1/developer"
MODEL = "nano-banana-pro"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

ROOT = "remotion-video/public"

VIDEOS = {
    "lanhay21_longtu": {
        "title": "A Vietnamese man standing in front of a massive Dendrobium Long Tu orchid trellis, extremely long hanging canes over two meters, wide grand garden shot, cinematic teal green color grade, 35mm lens f2.8 soft light.",
        "tip": "Close-up Vietnamese hand gently touching cascading Dendrobium Long Tu orchid canes covered in small white and purple flowers, dramatic long hanging stems, home garden, cinematic color grade, 85mm f1.8 soft light.",
        "outro": "A happy Vietnamese man admiring his giant Dendrobium Long Tu orchid wall full of long cascading canes and flowers, wide garden shot, cinematic vivid green color grade, 35mm f2.8 soft golden light.",
    },
    "lanhay22_cattleya": {
        "title": "Wide grand shot of a Vietnamese home garden trellis filled with huge purple Cattleya orchid blooms, dozens of large flowers, cinematic vivid color grade, 24mm lens f2.8 soft light.",
        "tip": "Close-up of a giant vivid purple Cattleya orchid flower with ruffled lip petals, dew drops on petals, Vietnamese home garden background, cinematic color grade, 100mm macro f2.8 soft light.",
        "outro": "A Vietnamese woman smiling while holding a large purple Cattleya orchid bloom in a lush home garden, cinematic vivid purple color grade, 35mm f2.8 soft golden light.",
    },
    "lanhay23_vaysac": {
        "title": "Wide dramatic shot of a Vietnamese garden trellis covered in Renanthera orchid vines with long snake-like stems and small red flowers, grand scale, cinematic red-orange color grade, 24mm lens f2.8 soft light.",
        "tip": "Close-up of Renanthera orchid long thin vine-like stems covered in clusters of small bright red flowers, unusual snake-skin pattern leaves, Vietnamese garden, cinematic color grade, 90mm macro f2.8 soft light.",
        "outro": "A Vietnamese man proudly standing next to a large Renanthera orchid vine full of red flowers cascading down a trellis, wide garden shot, cinematic vivid red color grade, 35mm f2.8 soft golden light.",
    },
    "lanhay24_daichau": {
        "title": "Wide grand shot of a Vietnamese home garden entrance decorated with many Rhynchostylis Dai Chau orchid pots blooming for Tet, thick hanging clusters of white pink flowers, cinematic warm color grade, 24mm lens f2.8 soft light.",
        "tip": "Close-up of a thick cluster of Rhynchostylis Dai Chau orchid flowers, white petals with pink speckles, hanging densely like grapes, Vietnamese garden, cinematic color grade, 100mm macro f2.8 soft light.",
        "outro": "A joyful Vietnamese family standing among many blooming Dai Chau orchid pots decorated for Tet holiday, wide garden shot, cinematic warm golden color grade, 35mm f2.8 soft light.",
    },
    "lanhay25_kieutim": {
        "title": "Wide grand shot of a large purple Dendrobium Kieu orchid clump mounted directly on a big natural driftwood trunk in a Vietnamese garden, dramatic scale, cinematic purple color grade, 24mm lens f2.8 soft light.",
        "tip": "Close-up of vivid purple Dendrobium Kieu orchid flowers blooming densely on a natural wood mount, dew drops on petals, Vietnamese garden background, cinematic color grade, 90mm macro f2.8 soft light.",
        "outro": "A Vietnamese woman happily touching a massive purple Dendrobium Kieu orchid mounted on driftwood, wide garden shot, cinematic vivid purple color grade, 35mm f2.8 soft golden light.",
    },
}


def http(method, path, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data,
        headers={"Content-Type": "application/json", "X-API-Key": KEY, "User-Agent": UA}, method=method)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def post_with_retry(path, body, tries=6):
    for a in range(tries):
        try:
            return http("POST", path, body)
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 500, 502, 503):
                wait = 3 * (a + 1)
                print("  retry %d (HTTP %d), wait %ds" % (a + 1, e.code, wait), flush=True)
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("post failed after retries: " + path)


def poll(task_id):
    for _ in range(120):
        time.sleep(5)
        try:
            d = http("GET", "/status/" + task_id)
        except urllib.error.HTTPError:
            continue
        st = d.get("status")
        if st in ("completed", "success"):
            return d.get("result_url") or d.get("output_url")
        if st in ("error", "failed"):
            raise RuntimeError(d.get("error_message") or json.dumps(d))
    raise TimeoutError("poll timeout")


def download(url, path, tries=5):
    for a in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            with open(path, "wb") as f:
                f.write(data)
            return len(data)
        except (urllib.error.HTTPError, urllib.error.URLError) as e:
            wait = 5 * (a + 1)
            print("  download retry %d (%s), wait %ds" % (a + 1, e, wait), flush=True)
            time.sleep(wait)
    raise RuntimeError("download failed after retries: " + url)


def gen_one(slug, prompts):
    dest = os.path.join(ROOT, "images_" + slug)
    os.makedirs(dest, exist_ok=True)
    for name, prompt in prompts.items():
        outpath = os.path.join(dest, name + ".jpg")
        if os.path.exists(outpath):
            print("  skip %s/%s.jpg (exists)" % (slug, name), flush=True)
            continue
        print("=== %s / %s ===" % (slug, name), flush=True)
        r = post_with_retry("/generate/image", {
            "prompt": prompt, "model": MODEL, "resolution": "2k", "aspect_ratio": "9:16"})
        tid = r.get("task_id")
        if not tid:
            print("  NO TASK: " + json.dumps(r), flush=True)
            continue
        url = poll(tid)
        size = download(url, outpath)
        print("  saved %s/%s.jpg (%d bytes)" % (slug, name, size), flush=True)


def main():
    for slug, prompts in VIDEOS.items():
        gen_one(slug, prompts)
    print("=== ALL DONE (batch 21-25) ===", flush=True)


if __name__ == "__main__":
    main()
