/* ==========================================================================
   🧑‍🍳 DANH MỤC NHÂN VIÊN - PHỤC VỤ, ĐẦU BẾP, BẢO VỆ
   ========================================================================== */

export const STAFF_MAX_PER_ROLE = 2;

export const STAFF = {
  waiter: {
    id: 'waiter',
    name: 'Nhân viên phục vụ',
    icon: '🛎️',
    hireCost: 120000,
    wage: 90000, // Lương mỗi ngày
    patienceBonus: 8, // +8s kiên nhẫn cho khách mỗi nhân viên
    desc: 'Rót trà đá, quạt mát cho khách: mỗi người +8s kiên nhẫn. Có từ 1 người trở lên sẽ tự bưng đồ uống ra bàn.'
  },
  cook: {
    id: 'cook',
    name: 'Đầu bếp',
    icon: '👨‍🍳',
    hireCost: 220000,
    wage: 150000,
    desc: 'Người 1: tự pha nước chấm (mắm tôm sủi bọt đúng yêu cầu). Người 2: tự chiên sẵn Bún lá & Đậu hũ cho mọi mẹt.'
  },
  guard: {
    id: 'guard',
    name: 'Bảo vệ',
    icon: '💂',
    hireCost: 160000,
    wage: 80000,
    blockChance: [0, 0.65, 0.95], // Xác suất chặn sự cố theo số bảo vệ
    desc: 'Chặn khách say quậy phá và kẻ gian trộm tiền. 1 bảo vệ chặn ~65%, 2 bảo vệ chặn ~95% sự cố.'
  },
  sous_chef: {
    id: 'sous_chef',
    name: 'Bếp phó trọn gói',
    icon: '👩‍🍳',
    hireCost: 280000,
    wage: 160000,
    desc: 'Chuyên làm đầy đủ cho khách sau: Tự động xếp đủ mẹt (bún, đậu, topping, nước chấm) và phục vụ các bàn tiếp theo, kèm nút bấm làm nhanh 1-chạm không lo quá tải!'
  }
};
