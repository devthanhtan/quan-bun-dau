/* ==========================================================================
   💬 DANH MỤC FEED MẠNG XÃ HỘI & ĐÁNH GIÁ THỰC KHÁCH SIÊU BỰA & LẦY LỘI
   ========================================================================== */

export const INITIAL_FEED_POSTS = [
  {
    id: 'feed_1',
    author: 'Hội Những Người Thở Ra Mùi Mắm Tôm',
    avatar: '🥢',
    time: '2 phút trước',
    content: 'CẢNH BÁO: Trưa nay vừa ăn bún đậu ở quán về, người yêu thơm má một cái xỉu luôn 3 ngày chưa tỉnh =))) Cảm ơn chủ quán đã giúp em quay trở lại cuộc sống độc thân tự do muôn năm! 10/10 uy tín!',
    badge: '🔥 100k Shares',
    likes: 1520,
    comments: 489
  },
  {
    id: 'feed_2',
    author: 'Tổ Trưởng Tổ Dân Phố Số 8',
    avatar: '👓',
    time: '25 phút trước',
    content: 'Đề nghị chủ quán bún đậu xích chú chó Vện lại nhé! Vừa ngồi xuống bàn chưa kịp chấm miếng đậu nó đã chạy lại ngồi liếc mắt làm nũng, hại tôi phải cống nạp nửa đĩa chả cốm cho nó rồi! 🐶🥩',
    badge: '🚨 Cảnh báo cún cưng',
    likes: 890,
    comments: 134
  },
  {
    id: 'feed_3',
    author: 'Khoai Review Triệu View',
    avatar: '📱',
    time: '1 giờ trước',
    content: 'CHẤN ĐỘNG PHỐ CỔ: Phát hiện quán bún đậu mắm tôm đánh sủi bọt trắng bông mịn như bọt Capuccino nước Ý! Cắn miếng đậu rán giòn rụm phát cả phố nghe thấy tiếng rôm rốp. Chấm điểm 100/10 không có nhưng!',
    badge: '🌟 Trending Top 1',
    likes: 3410,
    comments: 872
  },
  {
    id: 'feed_4',
    author: 'Hội Sinh Viên Húp Trọn Mắm Tôm',
    avatar: '🎒',
    time: '3 giờ trước',
    content: 'Cuối tháng tài khoản còn đúng 30k nhưng vẫn quyết định tất tay vào mẹt bún đậu. Húp một ngụm trà tắc mát lạnh xong thấy đời tươi sáng hẳn, rớt môn cũng thấy yêu đời! 😂',
    badge: '🎓 Góc Gen Z',
    likes: 640,
    comments: 98
  }
];

export const DYNAMIC_FEED_TEMPLATES = [
  {
    author: 'Bé Mập Ăn Cả Thế Giới',
    avatar: '📱',
    content: 'Vừa đi ăn bún đậu với crush, mải tranh nhau miếng dồi sụn cuối cùng suýt nữa combat tại quán =))) Cơ mà miếng dồi giòn sần sật béo ngậy ngon quá không nhường được!',
    badge: '🥩 Đại chiến dồi sụn'
  },
  {
    author: 'Anh Tuấn IT Thức Trắng Đêm',
    avatar: '💼',
    content: 'Bug dí ngập đầu từ sáng, chạy qua quán làm mẹt bún đậu tá lả mắm tôm cay xè hít hà. Về văn phòng thở một hơi cả sếp lẫn đồng nghiệp né xa 2 mét, tha hồ yên tĩnh fix bug!',
    badge: '💻 Bí kíp dân IT'
  },
  {
    author: 'Cộng Đồng Hóng Biến Phố Cổ',
    avatar: '🏮',
    content: 'TIN ĐỒN CHẤN ĐỘNG: Chú chó Vện giữ xe của quán vừa tậu xe SH nhờ tiền tip lì xì của khách! Ai đến ăn nhớ xin vía làm giàu từ chú cún này nhé.',
    badge: '🐕 Thần tài giữ quán'
  },
  {
    author: 'Team Sợ Mắm Tôm Hoàn Lương',
    avatar: '🍯',
    content: '25 năm cuộc đời thề không bao giờ ăn mắm tôm. Hôm nay trót dại chấm thử một miếng đậu vào bát mắm tôm sủi bọt của quán... Giờ thì chính thức gia nhập đạo Bún Đậu!',
    badge: '✨ Giác ngộ chân lý'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Khoai Review',
    avatarKey: 'chibi_reviewer',
    stars: 5,
    comment: 'Đậu rán ngoài giòn trong mềm béo mọng nước, mắm tôm đánh sủi bọt đỉnh nóc kịch trần! Ăn xong muốn quỳ lạy cảm ơn tổ nghề bún đậu.',
    tag: 'Đỉnh nóc kịch trần',
    time: 'Hôm nay'
  },
  {
    id: 'rev_2',
    name: 'Phương HR',
    avatarKey: 'chibi_office',
    stars: 5,
    comment: 'Mẹt tá lả đầy đặn như tình cảm của em dành cho crush vậy! Nước trà tắc siêu to khổng lồ uống giải ngấy cực đã, 10 sao luôn chứ 5 sao ít quá.',
    tag: 'Mê mẩn',
    time: 'Hôm nay'
  }
];

export const REVIEW_TEMPLATES_5_STAR = [
  'Đậu rán giòn rụm cắn một phát cả phố Hàng Bông nghe tiếng! Mắm tôm đánh bọt trắng mịn như bọt tuyết bồng bềnh, ăn miếng nào giác ngộ chân lý miếng đó!',
  'Húp trọn bát mắm tôm sủi bọt xong ra đường thở một hơi cảm nhận rõ uy quyền và sự tôn trọng của mọi người xung quanh dạt ra hai bên! 100/10!',
  'Bún lá tươi mát dẻo thơm, chả cốm bùi bùi hạt ngọc xanh, thịt chân giò luộc mỏng dính viền giòn béo ngậy. Ăn xong quên luôn lối về nhà!',
  'Trà tắc chua thanh giải ngấy thần sầu, chú chó Vện giữ xe ngoáy đuôi cưng xỉu vừa ăn vừa ngắm cún xua tan mọi áp lực deadline công việc!',
  'Tôi tuyên bố đây là quán bún đậu ngon nhất dải ngân hà! Ăn xong về người yêu khen thơm mùi đặc sản dân tộc luôn!'
];

export const REVIEW_TEMPLATES_4_STAR = [
  'Món ăn ngon nhức nách sạch sẽ, giá sinh viên hạt dẻ, mỗi tội trưa đông khách quá phải giành giật nhau cái bàn cuối cùng!',
  'Đậu rán giòn, mắm tôm thơm phức, nếu quán cho thêm đĩa quất ớt nữa để em vắt bét nhè thì cho 10 sao luôn!'
];

export const REVIEW_TEMPLATES_1_STAR = [
  'Tôi gọi bún đậu KHÔNG mắm tôm mà bê ra bát mắm tôm sủi bọt! Tôi lỡ chấm thử một miếng... ai ngờ nghiện luôn giờ ngày nào cũng phải ăn tốn tiền quá, bắt đền quán đấy! Đánh giá 1 sao nhưng trong lòng 100 sao!',
  'Đợi lâu đến mức em kịp tốt nghiệp đại học, lấy vợ sinh con xong mới thấy mẹt bún đậu bưng ra! May mà miếng dồi sụn ngon quá cứu mạng chủ quán đấy nhé!',
  'Quán đông quá hết sạch chỗ ngồi, làm em phải đứng ăn vỉa hè mà vẫn thấy ngon rơi nước mắt, tức cái lồng ngực cho 1 sao bắt quán mở rộng gấp đôi!',
  'Đang ăn say sưa thì chó Vện chạy qua quẫy đuôi làm rơi mất miếng đậu cuối cùng... Quán ngon đỉnh cao nhưng đề nghị trừ 50% lương của chó Vện!'
];
