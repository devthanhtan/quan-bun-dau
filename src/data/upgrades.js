/* ==========================================================================
   🛠️ DANH MỤC TRANG THIẾT BỊ & NÂNG CẤP QUÁN BÚN ĐẬU
   ========================================================================== */

export const UPGRADES = {
  ban_ghe: {
    id: 'ban_ghe',
    name: 'Bàn ghế tre mộc',
    icon: '🪑',
    desc: 'Mở thêm chỗ ngồi cho thực khách đến quán thưởng thức mẹt bún đậu',
    levels: [
      { level: 1, cost: 0, tables: 2, desc: '2 bàn tre mộc cơ bản' },
      { level: 2, cost: 150000, tables: 3, desc: 'Mở rộng lên 3 bàn ăn thoáng mát' },
      { level: 3, cost: 350000, tables: 4, desc: '4 bàn tre bóng loáng phục vụ đông khách' },
      { level: 4, cost: 650000, tables: 5, desc: '5 bàn tre cao cấp mở rộng đón nhóm đông' },
      { level: 5, cost: 1200000, tables: 6, desc: '6 bàn ăn đại tiệc phục vụ đoàn khách phố cổ' }
    ]
  },
  quat_gio: {
    id: 'quat_gio',
    name: 'Hệ thống quạt làm mát',
    icon: '🎐',
    desc: 'Giúp quán luôn mát rượi, thực khách thoải mái và tăng thời gian kiên nhẫn',
    levels: [
      { level: 1, cost: 0, patienceBonus: 0, desc: 'Quạt nan phe phẩy' },
      { level: 2, cost: 80000, patienceBonus: 12, desc: 'Quạt trần cổ điển (+12s kiên nhẫn)' },
      { level: 3, cost: 220000, patienceBonus: 25, desc: 'Quạt hơi nước mát lạnh (+25s kiên nhẫn)' }
    ]
  },
  chao_ran: {
    id: 'chao_ran',
    name: 'Chảo rán đậu siêu tốc',
    icon: '🍳',
    desc: 'Chảo gang giữ nhiệt chiên đậu giòn rụm đều 4 mặt không bị cháy',
    levels: [
      { level: 1, cost: 0, desc: 'Chảo nhôm truyền thống' },
      { level: 2, cost: 120000, tipBonus: 0.15, desc: 'Chảo gang đúc vàng giòn (+15% tiền tip)' },
      { level: 3, cost: 280000, tipBonus: 0.35, desc: 'Bếp chiên nhúng đôi chuẩn nhà hàng (+35% tiền tip)' }
    ]
  },
  bang_hieu: {
    id: 'bang_hieu',
    name: 'Đèn lồng & Bảng hiệu phố cổ',
    icon: '🏮',
    desc: 'Bảng hiệu rực rỡ thu hút nhiều khách hàng cao cấp và reviewer ẩm thực',
    levels: [
      { level: 1, cost: 0, vipRate: 0.05, desc: 'Biển bạt đơn sơ' },
      { level: 2, cost: 180000, vipRate: 0.15, desc: 'Biển gỗ khắc chữ sơn son thếp vàng' },
      { level: 3, cost: 400000, vipRate: 0.30, desc: 'Đèn lồng đỏ treo cao rực rỡ (+30% khách VIP ghé quán)' }
    ]
  }
};
