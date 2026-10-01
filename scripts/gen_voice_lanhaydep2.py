# -*- coding: utf-8 -*-
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio_lanhaydep2")

VIDEOS = {
    "v1": {
        "title": "Một chùm hoa vàng cam mà hình dáng lạ như thế này, nhìn kỹ mới biết là hoa lan",
        "tip": "Vũ nữ Tề Thiên đây, cánh hoa xoắn lạ mắt, màu vàng cam nổi bật, càng nhìn càng thấy độc đáo.",
        "outro": "Bạn có thấy hình dáng hoa này giống con gì không, comment cho tôi biết nhé!",
    },
    "v2": {
        "title": "Hàng trăm chậu lan xếp thành dãy như thế này, không phải vườn nhà mà là hội thi đấy",
        "tip": "Đây là các chậu Dendro chớp đoạt giải tại hội hoa lan Cần Thơ, hoa nở đồng loạt cực kỳ rực rỡ.",
        "outro": "Bạn có muốn mang lan nhà mình đi thi thử một lần không?",
    },
    "v3": {
        "title": "Một giò lan mà đặt tên theo trái cây như thế này, chắc phải có lý do đặc biệt",
        "tip": "Hoàng thảo Long Nhãn đây, chùm hoa vàng rực nở dày, nhìn xa cứ như chùm nhãn chín treo trên cây.",
        "outro": "Bạn thấy tên gọi này có hợp với hoa không?",
    },
    "v4": {
        "title": "Một chùm hoa rũ xuống màu cam đất lạ mắt như thế này, chưa chắc bạn từng thấy",
        "tip": "Địa lan Cymbidium đây, hoa mọc thành chùm dài rũ xuống, màu cam đất ấm rất khác với lan thường thấy.",
        "outro": "Bạn thích dáng hoa rũ hay dáng hoa chùm thẳng hơn?",
    },
    "v5": {
        "title": "Một khu nhà giàn mà lan nở kín từ đầu đến cuối như thế này, đứng nhìn phát mê",
        "tip": "Dendro chớp Enobi đây, trồng hàng loạt trong nhà giàn, hoa nở đồng loạt phủ kín cả khu vườn.",
        "outro": "Bạn có muốn có một góc vườn lan như thế này không?",
    },
    "v6": {
        "title": "Một chùm hoa tím thẫm mà sai đến mức rợp cả chậu như vậy, xứng danh nữ hoàng",
        "tip": "Nữ hoàng Lilip đây, hoa tím thẫm nở chùm dày đặc, càng nhìn càng thấy sang trọng và quý phái.",
        "outro": "Bạn có đang tìm giống lan màu tím đậm như thế này không?",
    },
    "v7": {
        "title": "Một chậu lan mà màu cam rực như lửa thế này, tên gọi cũng nóng không kém",
        "tip": "Hỏa hoàng đây, hoa màu cam rực nở thành chùm, nhìn xa cứ như một đốm lửa nhỏ giữa vườn.",
        "outro": "Bạn thấy màu cam này có nổi bật hơn các màu lan khác không?",
    },
    "v8": {
        "title": "Một giò lan đỏ rực đặt trước hiên nhà như thế này, ai đi qua cũng phải ngoái nhìn",
        "tip": "Dendrobium Caesar Red đây, hoa đỏ rực nở sai bông, trồng trước hiên nhà là nổi bật nhất cả xóm.",
        "outro": "Bạn có định trồng một giò đỏ rực như vậy trước nhà không?",
    },
    "v9": {
        "title": "Một cây lan mà tên gọi theo con vật có nọc độc như thế này, hoa lại đẹp không ngờ",
        "tip": "Lan Bò Cạp đây, hoa đỏ rực nở chùm trong vườn, tên nghe dữ nhưng sắc hoa lại cực kỳ thu hút.",
        "outro": "Bạn có thấy tên lan nào lạ hơn Bò Cạp chưa, kể tôi nghe xem!",
    },
    "v10": {
        "title": "Một bụi lan khủng ghép thẳng lên gốc cây ngoài tự nhiên như thế này, quy mô hơn hẳn chậu thường",
        "tip": "Vũ nữ đây, được ghép trên gốc cây gỗ lớn ngoài tự nhiên, hoa vàng nở rực rỡ phủ kín cả gốc cây.",
        "outro": "Bạn có muốn thử ghép lan lên gốc cây lớn như thế này không?",
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
    for vid, scenes in VIDEOS.items():
        for scene_name, text in scenes.items():
            fname = f"{vid}_{scene_name}.mp3"
            path = os.path.join(OUT_DIR, fname)
            print("=== " + fname + " ===", flush=True)
            for attempt in range(3):
                try:
                    rid = post_tts(text)
                    link = poll(rid)
                    size = download(link, path)
                    print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
                    break
                except Exception as e:
                    print("  attempt " + str(attempt + 1) + " failed: " + str(e), flush=True)
                    time.sleep(3)
            else:
                print("  FAILED: " + fname, flush=True)
    print("=== ALL VOICEOVER DONE ===", flush=True)


if __name__ == "__main__":
    main()
