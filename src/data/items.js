/* ==========================================================================
   🥩 DANH MỤC NGUYÊN LIỆU & CÔNG THỨC MÓN ĂN - QUÁN BÚN ĐẬU MƠ ƯỚC
   ========================================================================== */

export const ITEMS = {
  bun_la: {
    id: 'bun_la',
    name: 'Bún lá tươi',
    shortName: 'Bún lá',
    category: 'base',
    unlockDay: 1,
    cost: 2000,
    sell: 10000,
    shelfLife: 2, // Hạn dùng 2 ngày
    desc: 'Bún con cắt vuông vức trắng phau, dẻo dai mát lành',
    icon: 'bun'
  },
  dau_hu: {
    id: 'dau_hu',
    name: 'Đậu hũ chiên',
    shortName: 'Đậu giòn',
    category: 'topping',
    unlockDay: 1,
    cost: 3000,
    sell: 15000,
    shelfLife: 3,
    desc: 'Đậu mơ rán vàng giòn rụm bên ngoài, mềm béo ngậy bên trong',
    icon: 'dau'
  },
  rau_song: {
    id: 'rau_song',
    name: 'Dưa & Kinh giới',
    shortName: 'Rau dưa',
    category: 'topping',
    unlockDay: 1,
    cost: 1000,
    sell: 5000,
    shelfLife: 2,
    desc: 'Rau kinh giới, tía tô tươi thơm ngát cùng dưa leo thái lát giòn ngọt',
    icon: 'rau'
  },
  cha_com: {
    id: 'cha_com',
    name: 'Chả cốm Hà Nội',
    shortName: 'Chả cốm',
    category: 'topping',
    unlockDay: 2,
    cost: 5000,
    sell: 22000,
    shelfLife: 4,
    desc: 'Chả cốm thơm dẻo bùi bùi chiên vàng ươm chuẩn vị phố cổ',
    icon: 'chacom'
  },
  thit_luoc: {
    id: 'thit_luoc',
    name: 'Thịt chân giò luộc',
    shortName: 'Thịt luộc',
    category: 'topping',
    unlockDay: 3,
    cost: 8000,
    sell: 32000,
    shelfLife: 3,
    desc: 'Thịt bắp chân giò luộc mỏng dính, viền giòn thịt ngọt ngào',
    icon: 'thit'
  },
  nem_ran: {
    id: 'nem_ran',
    name: 'Nem rán giòn',
    shortName: 'Nem rán',
    category: 'topping',
    unlockDay: 4,
    cost: 7000,
    sell: 28000,
    shelfLife: 4,
    desc: 'Nem rán vỏ ram giòn rụm bọc nhân thịt mộc nhĩ nấm hương béo ngọt',
    icon: 'nem'
  },
  doi_sun: {
    id: 'doi_sun',
    name: 'Dồi sụn chiên',
    shortName: 'Dồi sụn',
    category: 'topping',
    unlockDay: 5,
    cost: 9000,
    sell: 36000,
    shelfLife: 3,
    desc: 'Dồi sụn nướng/chiên sần sật thơm nức mũi mùi húng quế và tiêu sọ',
    icon: 'doi'
  },
  tra_tac: {
    id: 'tra_tac',
    name: 'Trà tắc mát lạnh',
    shortName: 'Trà tắc',
    category: 'drink',
    unlockDay: 2,
    cost: 2500,
    sell: 12000,
    shelfLife: 5,
    desc: 'Trà nhài thơm lừng hòa quyện nước cốt quất chua thanh giải ngấy tức thì',
    icon: 'tratac'
  },
  nuoc_sau: {
    id: 'nuoc_sau',
    name: 'Nước sấu ngâm',
    shortName: 'Nước sấu',
    category: 'drink',
    unlockDay: 6,
    cost: 4000,
    sell: 18000,
    shelfLife: 7,
    desc: 'Nước sấu ngâm đường phèn gừng tươi chua ngọt giòn tan đặc sản Hà Thành',
    icon: 'nuocsau'
  }
};

/* Nước Chấm Mắm Tôm & Nước Mắm */
export const SAUCES = {
  mamtom: {
    id: 'mamtom',
    name: 'Mắm tôm bọt trắng',
    shortName: 'Mắm tôm',
    cost: 1500,
    desc: 'Mắm tôm Thanh Hóa đánh bông cùng đường, quất tươi, ớt cay và dầu sôi'
  },
  nuocmam: {
    id: 'nuocmam',
    name: 'Nước mắm chua ngọt',
    shortName: 'Nước mắm',
    cost: 1500,
    desc: 'Nước mắm cá cơm pha tỏi ớt chua ngọt dành cho thực khách không ăn mắm tôm'
  }
};
