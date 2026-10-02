# -*- coding: utf-8 -*-
import json, os, time, urllib.request

APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0"
VOICE = "n_hn_male_ngankechuyen_ytstable_vc"
BASE = "https://vbee.vn/api/v1/tts"
PUBLIC = os.path.join(os.path.dirname(__file__), "public")

# slug -> {name: text}
VIDEOS = {
    "lanhiem11": {
        "vo_title": "Những giống lan này đẹp đến mức dân chơi lâu năm cũng phải xin một cây về trồng.",
        "vo_tip1": "Caesar Red, hoa đỏ tươi như nhung, cánh dày và bền, chơi được cả tuần không tàn.",
        "vo_tip2": "Cattleya, hoa to như bàn tay, màu sắc rực rỡ, mùi thơm ngọt lan khắp nhà.",
        "vo_tip3": "Sơn thủy tiên, hoa chùm trắng vàng, dáng rủ mềm mại, thơm dịu rất dễ chịu.",
        "vo_tip4": "Hoàng thảo, thân dài lá xanh mướt, hoa nở từng đợt suốt mấy tháng liền.",
        "vo_tip5": "Vũ nữ Thái Lan, hoa nhỏ nhưng nở thành chùm dày đặc, màu sắc sặc sỡ như bướm lượn.",
        "vo_outro": "Bạn ưng giống nào nhất? Comment số thứ tự cho tôi biết nhé!",
    },
    "landocdao12": {
        "vo_title": "Những cái tên lạ tai này lại là những giống lan độc đáo nhất trong giới chơi lan.",
        "vo_tip1": "Đuôi cáo vương, hoa mọc thành chùm dài cong như đuôi cáo, nhìn là nhớ ngay.",
        "vo_tip2": "Đuôi cáo tím, dáng hoa giống đuôi cáo vương nhưng màu tím huyền bí, rất lạ mắt.",
        "vo_tip3": "Sóc ta, thân nhỏ hoa chùm vàng nhạt, mọc bụi dày như đuôi sóc.",
        "vo_tip4": "Sóc lào, cánh hoa dày hơn sóc ta, màu vàng cam ấm, hương thơm nhẹ.",
        "vo_tip5": "Vảy rồng, thân có vảy xếp lớp như rồng, hoa nhỏ nhưng dáng cây cực kỳ ấn tượng.",
        "vo_outro": "Giống nào bạn thấy lạ nhất? Để lại số thứ tự dưới phần bình luận nhé!",
    },
    "lanquytoc13": {
        "vo_title": "Dân chơi lan gọi đây là dòng quý tộc, vì vẻ đẹp sang trọng hiếm cây nào sánh được.",
        "vo_tip1": "Nữ hoàng Lilip, hoa to màu tím hồng kiêu sa, cánh hoa như lụa mềm.",
        "vo_tip2": "Bò cạp, dáng hoa cong nhọn lạ mắt, màu nâu đỏ độc đáo không lẫn với giống nào khác.",
        "vo_tip3": "Diệc lan, hoa trắng mảnh như cánh chim diệc, bay bổng và thanh thoát.",
        "vo_tip4": "Hoàng hậu xanh, màu xanh ngọc hiếm gặp, chỉ nhìn thôi đã thấy quý phái.",
        "vo_tip5": "Giáng hương, hoa vàng chùm dài, thơm nồng đặc trưng, trồng một cây thơm cả vườn.",
        "vo_outro": "Bạn thích giống quý tộc nào nhất? Thả tim nếu bạn mê dòng lan sang trọng này nhé!",
    },
    "lantientrieu14": {
        "vo_title": "Mấy giống lan này ngày xưa chỉ nhà giàu mới chơi được, giờ vẫn khiến dân sành mê mẩn.",
        "vo_tip1": "Long nhãn, hoa chùm vàng nâu, dáng hoa tròn như hạt nhãn, mùi thơm đặc trưng.",
        "vo_tip2": "Kiếm hồng Đắk Nông, lá dài như kiếm, hoa hồng phấn nở rộ rất bắt mắt.",
        "vo_tip3": "Kim thoa, hoa vàng ánh kim, cánh hoa cứng cáp, chơi bền cả tháng.",
        "vo_tip4": "Bọ bẹ phấn, hoa nhỏ phủ lớp phấn mịn, màu sắc dịu nhẹ nhìn rất lạ.",
        "vo_tip5": "Chuối ngọc, thân mọc chùm như buồng chuối nhỏ, hoa trắng tinh khôi.",
        "vo_outro": "Bạn đã từng thấy giống nào trong 5 loại này chưa? Comment cho tôi biết nhé!",
    },
    "dotbien15": {
        "vo_title": "Một cây lan đột biến có thể đáng giá cả trăm triệu, nhưng làm sao để nhận biết?",
        "vo_tip1": "Dấu hiệu đầu tiên: màu hoa khác hoàn toàn so với cây mẹ, dù cùng một giò tách ra.",
        "vo_tip2": "Dấu hiệu thứ hai: cánh hoa có hình dáng lạ, dày hơn hoặc bo tròn khác thường.",
        "vo_tip3": "Dấu hiệu thứ ba: mắt lá hoặc thân cây xuất hiện vệt màu loang không đều.",
        "vo_tip4": "Dấu hiệu thứ tư: hoa nở sai mùa so với giống gốc, sớm hoặc muộn bất thường.",
        "vo_outro": "Nhà bạn có cây nào nghi đột biến không? Comment mô tả cho tôi xem thử nhé!",
    },
    "hoisinh16": {
        "vo_title": "Cây lan tưởng chết khô vẫn có thể cứu sống, nếu bạn làm đúng 4 bước sau.",
        "vo_tip1": "Bước một: cắt bỏ toàn bộ rễ thối đen, chỉ giữ lại phần rễ còn trắng cứng.",
        "vo_tip2": "Bước hai: ngâm gốc trong nước pha thuốc kích rễ khoảng mười lăm phút.",
        "vo_tip3": "Bước ba: để cây nơi thoáng mát, tránh nắng gắt cho đến khi ra rễ mới.",
        "vo_tip4": "Bước bốn: khi rễ mới dài khoảng hai đến ba phân mới ghép lại vào giá thể.",
        "vo_outro": "Lưu lại ngay để khi cần là có công thức cứu lan nhé!",
    },
    "khongnohoa17": {
        "vo_title": "Lan xanh tốt quanh năm mà mãi không ra hoa, chắc chắn bạn đang mắc một trong 4 lỗi này.",
        "vo_tip1": "Lỗi một: bón quá nhiều đạm, cây chỉ lo ra lá mà quên luôn việc ra hoa.",
        "vo_tip2": "Lỗi hai: thiếu sáng, lan cần ánh sáng đủ mạnh mới đủ năng lượng ra hoa.",
        "vo_tip3": "Lỗi ba: không có giai đoạn khô hạn xen giữa, cây không nhận được tín hiệu ra hoa.",
        "vo_tip4": "Lỗi bốn: chậu quá to so với cây, rễ cứ mải phát triển mà không chịu ra hoa.",
        "vo_outro": "Bạn đang mắc lỗi nào trong 4 lỗi này? Comment số thứ tự nhé!",
    },
    "dauhieucuu18": {
        "vo_title": "Thấy cây lan có 4 dấu hiệu này là phải cứu ngay, chậm một chút là mất cây.",
        "vo_tip1": "Dấu hiệu một: gốc cây mềm nhũn, bóp nhẹ thấy chảy nước đen.",
        "vo_tip2": "Dấu hiệu hai: lá vàng từ gốc lan dần lên ngọn trong vài ngày liên tục.",
        "vo_tip3": "Dấu hiệu ba: rễ chuyển màu nâu đen và teo rút lại thấy rõ.",
        "vo_tip4": "Dấu hiệu bốn: thân cây có mùi hôi lạ, dấu hiệu thối đã lan vào bên trong.",
        "vo_outro": "Cây bạn có dấu hiệu nào trong 4 cái này không? Comment ngay để được tư vấn nhé!",
    },
    "namtrang19": {
        "vo_title": "Giá thể xuất hiện nấm trắng, nhiều người hoảng sợ vội vứt bỏ cả giò lan, nhưng khoan đã.",
        "vo_tip1": "Trước tiên, phân biệt nấm trắng dạng bông tơ với lớp rêu trắng vô hại trên giá thể.",
        "vo_tip2": "Nếu là nấm tơ trắng, dùng cọ nhỏ gạt bỏ phần nấm, không rửa trôi làm nấm lan rộng.",
        "vo_tip3": "Sau đó phun dung dịch sát khuẩn gốc đồng, pha đúng liều theo hướng dẫn trên bao bì.",
        "vo_tip4": "Cuối cùng chuyển cây ra nơi thoáng gió hơn, nấm trắng rất thích môi trường ẩm bí.",
        "vo_outro": "Giò lan nhà bạn từng bị nấm trắng chưa? Comment cho tôi biết nhé!",
    },
    "nhinre20": {
        "vo_title": "Chỉ cần nhìn bộ rễ, dân chơi lan lâu năm đã đoán được cây đang khỏe hay đang bệnh.",
        "vo_tip1": "Rễ trắng xanh đầu rễ có màu lục nhạt là dấu hiệu cây đang phát triển rất tốt.",
        "vo_tip2": "Rễ tóp lại, màu xám nhạt, là dấu hiệu cây đang thiếu nước trầm trọng.",
        "vo_tip3": "Rễ nhớt đen và mềm nhũn khi sờ vào là dấu hiệu rễ đã bị thối.",
        "vo_tip4": "Rễ cứng khô giòn, dễ gãy vụn, là dấu hiệu cây đang thiếu ẩm kéo dài.",
        "vo_outro": "Rễ lan nhà bạn đang thuộc loại nào trong 4 loại này? Comment cho tôi biết nhé!",
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
    for slug, scenes in VIDEOS.items():
        out_dir = os.path.join(PUBLIC, "audio_" + slug)
        os.makedirs(out_dir, exist_ok=True)
        print("##### " + slug + " #####", flush=True)
        for name, text in scenes.items():
            print("=== " + name + " ===", flush=True)
            rid = post_tts(text)
            link = poll(rid)
            path = os.path.join(out_dir, name + ".mp3")
            size = download(link, path)
            print("  saved " + path + " (" + str(size) + " bytes)", flush=True)
    print("=== ALL VOICEOVER DONE ===", flush=True)


if __name__ == "__main__":
    main()
