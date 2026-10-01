# -*- coding: utf-8 -*-
"""Voiceover Minh Niem 2 cho 5 video 'lan hay lay tu kho tong hop'."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio_lanhaydep")

SCENES = {
    # Video 1: Dendro chop hong xac phao
    "v1_title": "Chậu lan này nở về đêm mà đẹp như pháo hoa... không tin thì xem kỹ lại.",
    "v1_tip": "Đây là Dendro chớp hồng xác pháo, nụ ra chùm dày, cứ tối là bung hoa rợp cả giàn.",
    "v1_outro": "Dáng lạ, màu sắc rực rỡ như vậy nên dân chơi lan rất mê. Bạn thích chớp hồng hay chớp màu khác? Comment cho tôi biết.",
    # Video 2: Dendro chop Chuon Thuan
    "v2_title": "Cùng là Dendro chớp nhưng con này màu khác hẳn, nhìn là biết dân sành chơi.",
    "v2_tip": "Chuồn Thuận đây, cánh dày, màu tím hồng đậm, chùm hoa xếp sát nhau nhìn rất đã mắt.",
    "v2_outro": "Chơi Dendro chớp mà gặp giống đẹp vậy là coi như trúng mánh. Bạn đã có chậu nào trong vườn chưa?",
    # Video 3: Vuon lan Hoang Thao Ken
    "v3_title": "Một góc vườn mà hoa hình cái kèn nở kín cả giàn... y như dàn nhạc thu nhỏ.",
    "v3_tip": "Đây là vườn Hoàng Thảo Kèn, mỗi năm cứ đến mùa là nở đồng loạt như thế này, ai đi qua cũng phải ngoái nhìn.",
    "v3_outro": "Trồng cả giàn như vậy tốn công lắm nhưng nhìn quả thật đáng. Bạn có muốn setup một góc vườn như vậy không?",
    # Video 4: Dendro chop Enobi
    "v4_title": "Cả nhà giàn nở cùng lúc thế này thì đúng là mùa hoa rộ nhất năm.",
    "v4_tip": "Dendro chớp Enobi đây, hoa dày, màu sắc đều, trồng theo nhà giàn nên chăm sóc cũng dễ hơn hẳn.",
    "v4_outro": "Nhìn cả giàn nở đồng loạt như này là biết chủ vườn chăm kỹ lắm. Bạn có đang trồng Dendro chớp không?",
    # Video 5: Phi diep vang
    "v5_title": "Một khúc gỗ mà vàng rực cả một khoảng vườn, hoa nhiều đến mức che hết thân cây.",
    "v5_tip": "Đây là phi điệp vàng ghép gỗ, cứ để tự nhiên ngoài trời như vậy, đủ nắng đủ gió là ra hoa sai như thế này.",
    "v5_outro": "Ghép gỗ để ngoài trời mà ra hoa sai vậy là quá chuẩn rồi. Bạn thích trồng chậu hay ghép gỗ hơn? Comment cho tôi biết.",
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
        rid = post_tts(text)
        link = poll(rid)
        path = os.path.join(OUT_DIR, name + ".mp3")
        size = download(link, path)
        print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
    print("=== ALL VOICEOVER DONE (lanhaydep) ===", flush=True)


if __name__ == "__main__":
    main()
