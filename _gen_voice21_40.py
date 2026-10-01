# -*- coding: utf-8 -*-
"""Voiceover VBee giong Minh Niem 2 cho 20 video LanHay21-40 (clip thuc, da loai lan)."""
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc"
BASE = "https://vbee.vn/api/v1/tts"
OUT_ROOT = os.path.join("remotion-video", "public")

VIDEOS = {
    "audio_lanhay21_caesarred": {
        "vo_title": "Một chậu lan để trước hiên nhà mà nở đỏ rực như lửa thế này, bạn có nhận ra đây là lan gì không?",
        "vo_tip": "Dendrobium Caesar Red đây, hoa đỏ tươi rực rỡ, nở sai chùm và giữ màu rất lâu, một trong những dòng Dendro cho hoa đẹp và bền nhất.",
        "vo_outro": "Bạn có muốn trồng một chậu đỏ rực như vậy trước hiên nhà không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay22_cattleya": {
        "vo_title": "Một bông lan to gần bằng cả bàn tay, cánh trắng họng vàng thế này, bạn có biết là lan gì không?",
        "vo_tip": "Cattleya đây, cánh hoa to dày, họng vàng nổi bật trên nền trắng, mùi hương rất thơm, xứng danh nữ hoàng của các loài lan.",
        "vo_outro": "Bạn thích kiểu hoa họng vàng này không? Thả tim nếu bạn cũng mê Cattleya như tôi nhé!",
    },
    "audio_lanhay23_sonthuytien": {
        "vo_title": "Một gốc cây lớn được phủ kín hoa vàng hoành tráng như thế này, bạn có nghĩ đó là lan không?",
        "vo_tip": "Sơn Thủy Tiên đây, ghép trực tiếp lên gốc cây lớn ngoài tự nhiên, hoa vàng nở dày quanh thân, quy mô lớn hơn hẳn chậu thường.",
        "vo_outro": "Bạn có muốn thử ghép lan lên gốc cây lớn như vậy không? Comment ý kiến của bạn nhé!",
    },
    "audio_lanhay24_hoangthao": {
        "vo_title": "Một giò lan nở kín hoa trắng họng vàng sai đến mức che hết cả lá, bạn có tin không?",
        "vo_tip": "Hoàng thảo đây, hoa trắng họng vàng nở dày đặc thành từng chùm, cây khỏe thì mỗi năm nở sai hơn năm trước.",
        "vo_outro": "Nhà bạn có giò hoàng thảo nào nở sai như vậy chưa? Comment cho tôi biết nhé!",
    },
    "audio_lanhay25_vunutethien": {
        "vo_title": "Một chùm lan vàng cam với hình dáng kỳ lạ như thế này, bạn có đoán được tên không?",
        "vo_tip": "Vũ nữ Tề Thiên đây, hoa vàng cam với cánh môi xoăn độc đáo như mặt khỉ, cực hiếm và cực được giới chơi lan săn lùng.",
        "vo_outro": "Bạn thấy cái tên Tề Thiên có hợp không? Thả tim nếu bạn thích dáng hoa lạ này nhé!",
    },
    "audio_lanhay26_duoicaovuongian": {
        "vo_title": "Một chùm hoa dài rủ xuống như đuôi cáo thế này, bạn có biết đây là lan gì không?",
        "vo_tip": "Lan đuôi cáo đây, chùm hoa dài rủ mềm mại đúng như tên gọi, càng để già cây chùm hoa càng dài và càng rực rỡ.",
        "vo_outro": "Bạn thấy tên đuôi cáo có đúng với dáng hoa này không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay27_giahacdo": {
        "vo_title": "Một giò lan nở hoa hồng đỏ xum xuê phủ kín cả thân như thế này, bạn đã từng thấy chưa?",
        "vo_tip": "Giả hạc hoa hồng đỏ đây, màu hồng đỏ đậm rất bắt mắt, nở xum xuê khắp thân, một trong những giả hạc đẹp và hiếm.",
        "vo_outro": "Bạn thích màu hồng đỏ này không? Thả tim nếu bạn cũng mê giả hạc như tôi nhé!",
    },
    "audio_lanhay28_hoangnhan": {
        "vo_title": "Một giò lan với cái tên nghe rất sang, nở đầy vòi hoa vàng như thế này, bạn có biết không?",
        "vo_tip": "Hoàng Nhạn đây, lá xanh tốt tươi tốt, ra rất nhiều vòi hoa vàng nở rộ cùng lúc, đúng chất một giò lan quý.",
        "vo_outro": "Bạn có muốn sở hữu một giò Hoàng Nhạn như vậy không? Comment số của bạn nhé!",
    },
    "audio_lanhay29_gianghuong": {
        "vo_title": "Một giò lan nở nhiều chùm hoa hồng tím thơm ngát khắp nhà thế này, bạn có biết là lan gì không?",
        "vo_tip": "Giáng Hương đây, hoa hồng tím nở thành từng chùm, hương thơm dịu nhẹ lan tỏa khắp nhà, ai đi qua cũng phải ngoái nhìn.",
        "vo_outro": "Nhà bạn có chưng Giáng Hương chưa? Comment cho tôi biết nhé!",
    },
    "audio_lanhay30_kimdiep": {
        "vo_title": "Một bụi lan vàng rực bám chặt trên thân cây như thế này, bạn có biết đây là lan gì không?",
        "vo_tip": "Kim Điệp đây, hoa vàng nhỏ nhưng nở rất dày, bám trực tiếp trên thân cây ngoài tự nhiên, càng nắng hoa càng lên màu đẹp.",
        "vo_outro": "Bạn có thích màu vàng rực này không? Thả tim nếu bạn mê Kim Điệp như tôi nhé!",
    },
    "audio_lanhay31_duoicaotim": {
        "vo_title": "Một chùm hoa tím hồng rủ dài xuống như thế này, bạn đã từng thấy chưa?",
        "vo_tip": "Đây cũng là một biến thể lan đuôi cáo, chùm hoa tím hồng rủ dài mềm mại, nở càng lâu chùm hoa lại càng sai và đẹp hơn.",
        "vo_outro": "Bạn thấy màu tím hồng này đẹp không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay32_socta": {
        "vo_title": "Một giò lan hoa trắng xanh nở rộ với cái tên rất dân dã như thế này, bạn có biết không?",
        "vo_tip": "Sóc ta đây, hoa trắng pha xanh nhẹ, form hoa tròn đều rất đẹp, cái tên nghe dân dã nhưng hoa lại cực kỳ tinh tế.",
        "vo_outro": "Bạn thấy tên Sóc ta có hợp với giò lan này không? Thả tim nếu bạn thích nhé!",
    },
    "audio_lanhay33_soclao": {
        "vo_title": "Một giò lan tím rực nở sai đến mức rủ hẳn xuống như thế này, bạn có biết là lan gì không?",
        "vo_tip": "Sóc Lào đây, hoa tím rất sai và rực rỡ, chùm hoa nặng đến mức rủ cả xuống, nhìn xa như một chùm nho tím khổng lồ.",
        "vo_outro": "Bạn có muốn trồng một giò Sóc Lào sai hoa như vậy không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay34_vayrong": {
        "vo_title": "Một bụi lan vàng bám trên thân cây gỗ lớn với cái tên rất oách như thế này, bạn có biết không?",
        "vo_tip": "Vảy rồng đây, hoa vàng nở rực rỡ bám chặt trên thân cây gỗ lớn, thân lá xếp lớp như vảy rồng thật, cái tên rất đúng với hình dáng.",
        "vo_outro": "Bạn thấy tên vảy rồng có hợp không? Thả tim nếu bạn thích dáng lan độc đáo này nhé!",
    },
    "audio_lanhay35_nuhoanglilip": {
        "vo_title": "Một giò lan tím thẫm với cái tên sang trọng như hoàng gia thế này, bạn có biết không?",
        "vo_tip": "Nữ hoàng lilip đây, hoa tím thẫm sang trọng, nở rất sai thành từng chùm dày, xứng đáng với cái tên nữ hoàng của mình.",
        "vo_outro": "Bạn có thích màu tím thẫm sang trọng này không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay36_bocap": {
        "vo_title": "Một cây lan nở chùm hoa đỏ rực với cái tên rất dữ dằn thế này, bạn có biết là lan gì không?",
        "vo_tip": "Lan Bò Cạp đây, hoa đỏ rực nở thành chùm tươi tốt trong vườn, cái tên nghe có vẻ dữ nhưng hoa lại cực kỳ rực rỡ và bắt mắt.",
        "vo_outro": "Bạn thấy tên Bò Cạp có hợp với giò lan đỏ rực này không? Thả tim nếu bạn thích nhé!",
    },
    "audio_lanhay37_diachlan": {
        "vo_title": "Một chùm hoa màu cam đất nở rộ với hình dáng rất khác lạ thế này, bạn có biết đây là lan gì không?",
        "vo_tip": "Địa lan Cymbidium đây, hoa màu cam đất độc đáo, chùm hoa dài rủ xuống, một trong những dòng địa lan được ưa chuộng nhất hiện nay.",
        "vo_outro": "Bạn có thích màu cam đất lạ mắt này không? Comment cho tôi biết nhé!",
    },
    "audio_lanhay38_hoanghauxanh": {
        "vo_title": "Một giò lan với cái tên hoàng hậu, nở chùm hoa dài sai bông như thế này, bạn có biết không?",
        "vo_tip": "Hoàng hậu xanh đây, chùm hoa dài rực rỡ nở sai bông, xứng danh với cái tên hoàng hậu trong làng lan.",
        "vo_outro": "Bạn có muốn sở hữu một giò hoàng hậu xanh như vậy không? Comment số của bạn nhé!",
    },
    "audio_lanhay39_phidiepvang": {
        "vo_title": "Một cụm lan vàng rực bám trên thân cây với vô số chùm hoa như thế này, bạn có tin không?",
        "vo_tip": "Phi điệp vàng đây, hoa vàng nở chùm rực rỡ và rất sai hoa, cây khỏe thì mỗi năm hoa lại nở nhiều hơn năm trước.",
        "vo_outro": "Bạn thấy cụm phi điệp vàng này có hoành tráng không? Thả tim nếu bạn thích nhé!",
    },
    "audio_lanhay40_kimthoa": {
        "vo_title": "Một giò lan nở hoa màu cam vàng rực rỡ và rất sai hoa như thế này, bạn có biết là lan gì không?",
        "vo_tip": "Hoàng thảo kim thoa đây, hoa cam vàng rực rỡ nở dày đặc, cái tên kim thoa nghe rất sang mà hoa cũng đẹp không kém.",
        "vo_outro": "Bạn có thích màu cam vàng rực rỡ này không? Comment cho tôi biết nhé!",
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
            try:
                rid = post_tts(text)
                link = poll(rid)
                size = download(link, path)
                print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
            except Exception as e:
                print("  FAILED %s/%s: %s" % (out_dir, name, e), flush=True)
    print("=== ALL VOICEOVER DONE (batch 21-40) ===", flush=True)


if __name__ == "__main__":
    main()
