/* ==========================================================================
   👥 DANH MỤC KHÁCH HÀNG & TÍNH CÁCH CHIBI - QUÁN BÚN ĐẬU MƠ ƯỚC
   ========================================================================== */

export const CUSTOMER_TYPES = {
  student: {
    type: 'student',
    title: 'Bé Sinh Viên Năng Động',
    avatarKey: 'chibi_student',
    names: ['Linh GenZ', 'Huy Bách Khoa', 'Tú Ngoại Thương', 'Mai Kinh Tế', 'Minh Xây Dựng'],
    basePatience: 45,
    tipMultiplier: 1.0,
    quote: 'Mẹt bún đậu giòn ngon hạt dẻ là cứu tinh cuối tháng của em ạ!'
  },
  office: {
    type: 'office',
    title: 'Dân Văn Phòng Trưa Vội',
    avatarKey: 'chibi_office',
    names: ['Tuấn Marketing', 'Trang Kế Toán', 'Sếp Hùng', 'Hoàng Coder', 'Phương HR'],
    basePatience: 32,
    tipMultiplier: 1.35,
    quote: 'Chủ quán làm nhanh giúp em nhé, 1h trưa sếp họp dí deadline rồi!'
  },
  reviewer: {
    type: 'reviewer',
    title: 'TikToker Reviewer Triệu View',
    avatarKey: 'chibi_reviewer',
    names: ['Khoai Review', 'Mỏ Nhọn Phố Cổ', 'Ăn Sạch Hà Nội', 'Thánh Bún Đậu', 'Bé Mập Foodie'],
    basePatience: 38,
    tipMultiplier: 2.0,
    isVIP: true,
    quote: 'Hello cả nhà yêu! Nay cùng mình ghé thẩm quán bún đậu hot hòn họt xem mắm tôm có đỉnh như lời đồn không nha!'
  },
  neighbor: {
    type: 'neighbor',
    title: 'Bác Tổ Trưởng Khó Tính',
    avatarKey: 'chibi_neighbor',
    names: ['Bác Ba Tổ Trưởng', 'Bác Tư Cựu Chiến Binh', 'Cô Bảy Tạp Hóa', 'Bà Năm Hàng Cót'],
    basePatience: 42,
    tipMultiplier: 1.15,
    quote: 'Đậu phải rán giòn 4 mặt không được cháy khét, mắm tôm phải sủi bọt trắng xóa mới chuẩn vị nghe!'
  },
  vip_rich: {
    type: 'vip_rich',
    title: 'Đại Gia Sành Ăn Đi Mẹc',
    avatarKey: 'chibi_rich',
    names: ['Chú Bảy Đất Nền', 'Chị Hột Xoàn', 'Cường Đôla', 'Bác Năm Đại Gia'],
    basePatience: 35,
    tipMultiplier: 2.5,
    isVIP: true,
    quote: 'Cho một mẹt tá lả đầy đủ nhất quán ngập tràn topping, phục vụ nhanh anh bo thêm tiền triệu!'
  }
};
