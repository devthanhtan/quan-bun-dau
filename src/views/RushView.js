/* ==========================================================================
   ⚡ RUSH VIEW - GIAI ĐOẠN TRONG CA BÁN HÀNG (QUẦY CHẾ BIẾN & PHỤC VỤ TRỰC QUAN)
   ========================================================================== */

import { gameState } from '../core/GameState.js';
import { ITEMS, SAUCES } from '../data/items.js';
import { UPGRADES } from '../data/upgrades.js';
import { STAFF } from '../data/staff.js';
import { CUSTOMER_TYPES } from '../data/customers.js';
import { renderIcon } from '../renderers/SVGIcons.js';
import { sound } from '../audio/SoundManager.js';
import { events } from '../core/EventBus.js';

// ⏰ Thời gian trong game: 1 giờ game = 1 phút thực => 1 phút game = 1 giây thực
const OPEN_HOUR = 11;                                   // Mở cửa 11:00
const CLOSE_HOUR = 22;                                  // Đóng cửa 22:00
const SHIFT_MINUTES = (CLOSE_HOUR - OPEN_HOUR) * 60;    // 660 phút game = 11 phút thực
const OVERTIME_LIMIT = 45;                              // Tối đa 45s dọn nốt khách sau giờ đóng cửa

// Mật độ khách theo từng giờ (11h..21h): cao điểm trưa và cao điểm tối
const HOUR_WEIGHTS = [1.7, 2.3, 1.7, 0.8, 0.6, 0.7, 1.0, 1.9, 2.5, 2.0, 1.0];

const QUEUE_CAPACITY = 8;       // Số khách tối đa chờ ngoài cửa khi hết bàn (hỗ trợ nhóm 4 khách)
const QUEUE_WAIT_SECONDS = 32;  // Khách chờ ngoài cửa có thêm thời gian

const BASE_ITEM_IDS = ['bun_la', 'dau_hu'];
const SIZE_LABELS = { small: 'Nhỏ', large: 'Lớn' };

const INCIDENT_CHECK_EVERY = 30; // Mỗi 30 phút game xét một lần sự cố
const INCIDENT_CHANCE = 0.15;

export class RushView {
  constructor(container, onFinishRush) {
    this.container = container;
    this.onFinishRush = onFinishRush;

    this.elapsed = 0;          // Số phút game đã trôi qua kể từ 11:00
    this.overtime = 0;         // Số giây dọn nốt sau 22:00
    this.isClosing = false;    // Đã quá giờ đóng cửa / đóng cửa sớm
    this.isFinishing = false;
    this.timerInterval = null;
    this.sousChefTimer = 0;    // Bộ đếm nhịp làm việc của Bếp phó trọn gói

    // Lịch khách đến trong ngày
    this.totalCustomers = gameState.getExpectedCustomers();
    this.arrivalSchedule = this.generateArrivalSchedule(this.totalCustomers);
    this.arrivalIndex = 0;
    this.queue = []; // Khách chờ ngoài cửa khi hết bàn

    // Trạng thái bàn ăn
    this.tables = [];
    this.selectedTableIndex = 0;

    // Trạng thái quầy chuẩn bị mẹt hiện tại
    this.currentTrayItems = [];
    this.currentSauceType = 'mamtom'; // 'mamtom' | 'nuocmam'
    this.isSauceFoamed = false;
    this.currentDrink = null; // null | 'tra_tac' | 'nuoc_sau'
  }

  /* ---------- NHÂN VIÊN: HIỆU ỨNG TỰ ĐỘNG ---------- */

  get autoDrink() { return gameState.getStaffCount('waiter') >= 1; }
  get autoSauce() { return gameState.getStaffCount('cook') >= 1; }
  get autoBase() { return gameState.getStaffCount('cook') >= 2; }
  get autoFullOrder() { return gameState.getStaffCount('sous_chef') >= 1; }

  mount() {
    // Ca bán luôn bắt đầu lại từ 11:00 (kể cả khi tải lại trang giữa ca)
    gameState.todayStats.arrivedCount = 0;
    gameState.todayStats.lostCount = 0;

    this.initTables();
    this.render();
    this.startShiftTimer();

    // Lắng nghe sự kiện cún cưng
    this.unsubDog = events.on('dog:buff_triggered', () => {
      this.applyDogBuffToCustomers();
    });
  }

  unmount() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.unsubDog) this.unsubDog();
  }

  initTables() {
    const tableLevel = gameState.upgrades.ban_ghe || 1;
    const tableUpgradeInfo = UPGRADES.ban_ghe.levels.find(l => l.level === tableLevel);
    const tableCount = tableUpgradeInfo ? tableUpgradeInfo.tables : 2;

    this.tables = [];
    for (let i = 0; i < tableCount; i++) {
      this.tables.push({
        id: i + 1,
        customer: null,
        patience: 100,
        maxPatience: 100,
        order: null
      });
    }

    // Đưa các khách đến lúc 11:00 vào ngay
    this.processArrivals();
  }

  /* ---------- ĐỒNG HỒ & LỊCH KHÁCH ĐẾN ---------- */

  // Sinh lịch khách đến theo nhóm từ 1 đến tối đa 4 khách 1 lần
  generateArrivalSchedule(total) {
    const weightSum = HOUR_WEIGHTS.reduce((a, b) => a + b, 0);
    const schedule = [];
    let currentTotal = 0;

    // Nhóm khách đầu tiên lúc 11:00 mở cửa (nhóm 1 đến 2 người)
    const firstCount = Math.min(total, Math.floor(Math.random() * 2) + 1);
    schedule.push({ time: 0, count: firstCount });
    currentTotal += firstCount;

    while (currentTotal < total) {
      let r = Math.random() * weightSum;
      let hour = 0;
      while (hour < HOUR_WEIGHTS.length - 1 && r > HOUR_WEIGHTS[hour]) {
        r -= HOUR_WEIGHTS[hour];
        hour++;
      }
      const time = Math.min(SHIFT_MINUTES - 1, hour * 60 + Math.floor(Math.random() * 60));

      // Giờ cao điểm (trưa 11-13h, tối 18-20h) thường đi nhóm đông (2, 3, 4 khách)
      const isPeakHour = (hour <= 2) || (hour >= 7 && hour <= 9);
      let count;
      const remaining = total - currentTotal;
      if (isPeakHour) {
        // Tỉ lệ đi nhóm 2-4 khách cao hơn
        const rand = Math.random();
        if (rand < 0.35) count = 4;
        else if (rand < 0.65) count = 3;
        else if (rand < 0.88) count = 2;
        else count = 1;
      } else {
        const rand = Math.random();
        if (rand < 0.40) count = 1;
        else if (rand < 0.70) count = 2;
        else if (rand < 0.88) count = 3;
        else count = 4;
      }
      count = Math.min(count, remaining);
      schedule.push({ time, count });
      currentTotal += count;
    }

    return schedule.sort((a, b) => a.time - b.time);
  }

  getClockText() {
    const totalMinutes = OPEN_HOUR * 60 + Math.min(this.elapsed, SHIFT_MINUTES);
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const mm = String(totalMinutes % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  getClockPhaseLabel() {
    if (this.isClosing) return 'Đã đóng cửa';
    const hour = OPEN_HOUR + Math.floor(this.elapsed / 60);
    if (hour <= 12) return 'Cao điểm trưa';
    if (hour === 13) return 'Hết giờ trưa';
    if (hour <= 16) return 'Buổi chiều vắng';
    if (hour === 17) return 'Giờ tan tầm';
    if (hour <= 20) return 'Cao điểm tối';
    return 'Sắp đóng cửa';
  }

  startShiftTimer() {
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.isFinishing) return;

    if (!this.isClosing) {
      this.elapsed++;
      this.processArrivals();
      this.rollIncident();

      // Bếp phó trọn gói tự động chuẩn bị & phục vụ các bàn khách sau
      if (this.autoFullOrder) {
        this.sousChefTimer++;
        const interval = gameState.getStaffCount('sous_chef') >= 2 ? 4 : 7;
        if (this.sousChefTimer >= interval) {
          this.sousChefTimer = 0;
          this.performSousChefAutoServe();
        }
      }

      if (this.elapsed >= SHIFT_MINUTES) {
        this.closeShop(false);
      }
    } else {
      this.overtime++;
      // Trong giờ overtime dọn nốt, bếp phó tiếp tục làm nốt cho các bàn còn lại
      if (this.autoFullOrder && this.overtime % 3 === 0) {
        this.performSousChefAutoServe();
      }
    }

    // Giảm độ kiên nhẫn của khách tại các bàn & hàng chờ
    this.tickPatience();
    this.tickQueue();
    this.seatFromQueue();
    this.updateStatusUI();

    if (this.isClosing) {
      const noCustomers = this.tables.every(t => !t.customer);
      if (noCustomers || this.overtime >= OVERTIME_LIMIT) {
        this.finishShift();
      }
    }
  }

  closeShop(isEarly) {
    if (this.isClosing) return;
    this.isClosing = true;

    // Khách đang xếp hàng ngoài cửa phải ra về
    if (this.queue.length > 0) {
      this.queue.forEach(() => gameState.recordCustomerLost());
      this.queue = [];
    }

    events.emit('ui:toast', isEarly
      ? '🔒 Bạn đã đóng cửa sớm! Hãy phục vụ nốt các bàn còn lại.'
      : `🔔 ${CLOSE_HOUR}:00 - Quán đóng cửa! Hãy phục vụ nốt các bàn còn lại.`);
    this.updateStatusUI();
  }

  finishShift() {
    if (this.isFinishing) return;
    this.isFinishing = true;
    clearInterval(this.timerInterval);
    this.updateStatusUI();
    setTimeout(() => {
      this.unmount();
      if (this.onFinishRush) this.onFinishRush();
    }, 1200);
  }

  processArrivals() {
    while (this.arrivalIndex < this.arrivalSchedule.length &&
           this.arrivalSchedule[this.arrivalIndex].time <= this.elapsed) {
      const group = this.arrivalSchedule[this.arrivalIndex];
      this.arrivalIndex++;
      this.handleGroupArrival(group.count);
    }
  }

  handleGroupArrival(count) {
    if (count > 1) {
      events.emit('ui:toast', `👥 Nhóm ${count} khách vừa ghé quán!`);
      sound.playBell();
    }
    for (let i = 0; i < count; i++) {
      this.handleArrival();
    }
  }

  handleArrival() {
    gameState.todayStats.arrivedCount++;
    const pending = this.createPendingCustomer();

    const emptyIndex = this.tables.findIndex(t => t.customer === null);
    if (emptyIndex !== -1) {
      this.seatCustomerAtTable(emptyIndex, pending);
      this.refreshTableUI();
    } else if (this.queue.length < QUEUE_CAPACITY) {
      pending.waitLeft = QUEUE_WAIT_SECONDS;
      this.queue.push(pending);
    } else {
      gameState.recordCustomerLost();
      events.emit('ui:toast', `🚪 Quán hết chỗ, ${pending.customer.name} đành bỏ đi chỗ khác...`);
    }
  }

  tickQueue() {
    if (this.queue.length === 0) return;
    this.queue.forEach(p => { p.waitLeft--; });

    const leaving = this.queue.filter(p => p.waitLeft <= 0);
    if (leaving.length > 0) {
      leaving.forEach(p => {
        gameState.recordCustomerLost();
        events.emit('ui:toast', `🚶 ${p.customer.name} chờ ngoài cửa quá lâu nên bỏ đi...`);
      });
      this.queue = this.queue.filter(p => p.waitLeft > 0);
    }
  }

  seatFromQueue() {
    let seated = false;
    while (this.queue.length > 0) {
      const emptyIndex = this.tables.findIndex(t => t.customer === null);
      if (emptyIndex === -1) break;
      this.seatCustomerAtTable(emptyIndex, this.queue.shift());
      seated = true;
    }
    if (seated) this.refreshTableUI();
  }

  /* ---------- KHÁCH HÀNG & ĐƠN HÀNG ---------- */

  createPendingCustomer() {
    const archetypes = Object.values(CUSTOMER_TYPES);
    // Tỉ lệ khách VIP tăng theo bảng hiệu
    const signLvl = gameState.upgrades.bang_hieu || 1;
    const vipBonus = UPGRADES.bang_hieu.levels.find(l => l.level === signLvl)?.vipRate || 0.05;

    let selectedType;
    if (Math.random() < vipBonus) {
      selectedType = Math.random() < 0.5 ? CUSTOMER_TYPES.reviewer : CUSTOMER_TYPES.vip_rich;
    } else {
      selectedType = archetypes[Math.floor(Math.random() * archetypes.length)];
    }

    const randomName = selectedType.names[Math.floor(Math.random() * selectedType.names.length)];

    // Thưởng kiên nhẫn từ quạt mát
    const fanLvl = gameState.upgrades.quat_gio || 1;
    const fanBonus = UPGRADES.quat_gio.levels.find(l => l.level === fanLvl)?.patienceBonus || 0;

    return {
      customer: {
        type: selectedType.type,
        name: randomName,
        avatarKey: selectedType.avatarKey || 'chibi_student',
        tipMultiplier: selectedType.tipMultiplier,
        isVIP: selectedType.isVIP || false
      },
      basePatience: selectedType.basePatience + fanBonus,
      order: this.generateOrder(selectedType),
      waitLeft: QUEUE_WAIT_SECONDS
    };
  }

  seatCustomerAtTable(tableIndex, pending) {
    // Nhân viên phục vụ rót trà, quạt mát giúp khách kiên nhẫn hơn
    const waiterBonus = gameState.getStaffCount('waiter') * STAFF.waiter.patienceBonus;
    const totalPatience = pending.basePatience + waiterBonus;

    this.tables[tableIndex] = {
      id: tableIndex + 1,
      customer: pending.customer,
      patience: totalPatience,
      maxPatience: totalPatience,
      order: pending.order
    };

    sound.playBell();
  }

  generateOrder(customerType) {
    // Size mẹt: Lớn = 2 phần Bún lá & Đậu rán, Nhỏ = 1 phần. Khách VIP thích mẹt lớn hơn.
    const largeChance = customerType.isVIP ? 0.8 : 0.45;
    const size = Math.random() < largeChance ? 'large' : 'small';
    const baseQty = size === 'large' ? 2 : 1;

    // Luôn cần bún lá và đậu rán
    const items = [...BASE_ITEM_IDS];
    const qty = { bun_la: baseQty, dau_hu: baseQty };

    // Ngẫu nhiên chọn thêm các món đã mở khóa
    const optionalToppings = ['cha_com', 'thit_luoc', 'nem_ran', 'doi_sun', 'rau_song'].filter(id =>
      gameState.unlockedItems.includes(id)
    );

    // Mẹt nhỏ ít topping hơn, mẹt lớn nhiều topping hơn (VIP gọi tối đa 3 món)
    let countToAdd;
    if (size === 'small') {
      countToAdd = Math.random() < 0.7 ? 1 : 0;
    } else {
      countToAdd = customerType.isVIP ? 3 : 2;
    }
    countToAdd = Math.min(optionalToppings.length, countToAdd);

    for (let i = 0; i < countToAdd; i++) {
      const randIndex = Math.floor(Math.random() * optionalToppings.length);
      const chosen = optionalToppings.splice(randIndex, 1)[0];
      if (!items.includes(chosen)) {
        items.push(chosen);
        qty[chosen] = 1;
      }
    }

    // Nước chấm: 80% mắm tôm, 20% nước mắm
    const sauce = Math.random() < 0.8 ? 'mamtom' : 'nuocmam';
    const requireFoam = sauce === 'mamtom' ? (Math.random() < 0.75) : false;

    // Đồ uống nếu đã mở khóa
    let drink = null;
    const unlockedDrinks = ['tra_tac', 'nuoc_sau'].filter(id => gameState.unlockedItems.includes(id));
    if (unlockedDrinks.length > 0 && Math.random() < 0.6) {
      drink = unlockedDrinks[Math.floor(Math.random() * unlockedDrinks.length)];
    }

    return {
      size,
      items,
      qty,
      sauce,
      requireFoam,
      drink
    };
  }

  tickPatience() {
    let changed = false;
    this.tables.forEach((table, idx) => {
      if (table.customer) {
        table.patience--;
        if (table.patience <= 0) {
          // Khách hết kiên nhẫn bỏ về!
          events.emit('ui:toast', `😡 ${table.customer.name} tức giận bỏ về vì đợi quá lâu!`);
          sound.playChop();
          gameState.recordCustomerWalkout();
          table.customer = null;
          table.order = null;
          changed = true;
        }
      }
    });

    this.updateDiningFloor();
    if (changed) {
      this.updateChecklistView();
      this.updateHintGlow();
    }
  }

  applyDogBuffToCustomers() {
    sound.playBark();
    this.tables.forEach(table => {
      if (table.customer) {
        table.patience = Math.min(table.maxPatience, table.patience + 20);
      }
    });
    events.emit('ui:toast', '🐕 Chó Vện mừng rỡ vẫy đuôi! Khách hàng cảm thấy vui vẻ (+20s kiên nhẫn)');
    this.updateDiningFloor();
  }

  /* ---------- SỰ CỐ: KHÁCH SAY QUẬY PHÁ & KẺ GIAN (BẢO VỆ CHẶN) ---------- */

  rollIncident() {
    if (gameState.day < 2) return; // Ngày đầu chưa có sự cố
    if (this.elapsed <= 0 || this.elapsed % INCIDENT_CHECK_EVERY !== 0) return;
    if (Math.random() >= INCIDENT_CHANCE) return;

    const isDrunk = Math.random() < 0.5;
    const incidentName = isDrunk ? 'khách say rượu vào quán quậy phá' : 'kẻ gian định trộm tiền ở quầy thu ngân';

    // Bảo vệ có cơ hội chặn đứng sự cố
    const guardCount = Math.min(gameState.getStaffCount('guard'), STAFF.guard.blockChance.length - 1);
    const blockChance = STAFF.guard.blockChance[guardCount];
    if (Math.random() < blockChance) {
      gameState.todayStats.incidentsBlocked++;
      events.emit('ui:toast', `🛡️ Bảo vệ đã kịp thời xử lý ${incidentName}!`);
      sound.playBell();
      return;
    }

    gameState.todayStats.incidentsHit++;
    sound.playChop();
    if (isDrunk) {
      this.tables.forEach(table => {
        if (table.customer) table.patience = Math.max(1, table.patience - 12);
      });
      gameState.adjustRating(-0.1);
      events.emit('ui:toast', '🍺 Một vị khách say rượu quậy phá làm mọi người khó chịu! (-12s kiên nhẫn, -0.1 sao)');
      this.updateDiningFloor();
    } else {
      const stolen = Math.min(120000, Math.max(15000, Math.round(gameState.money * 0.06)));
      const lost = gameState.loseMoney(stolen);
      events.emit('ui:toast', `🥷 Kẻ gian trộm tiền ở quầy thu ngân! (-${lost.toLocaleString('vi-VN')}₫). Hãy thuê bảo vệ!`);
    }
  }

  /* ---------- BẾP PHÓ TRỌN GÓI: LÀM ĐẦY ĐỦ CHO KHÁCH SAU ---------- */

  performSousChefAutoServe() {
    // Tìm các bàn đang có khách chờ phục vụ
    const busyTables = this.tables.filter(t => t.customer && t.order);
    if (busyTables.length === 0) return;

    // Ưu tiên phục vụ bàn khác với bàn người chơi đang thao tác (phục vụ khách sau)
    let target = busyTables.find(t => (t.id - 1) !== this.selectedTableIndex);
    if (!target) {
      // Nếu chỉ có 1 bàn và người chơi chưa gắp mẹt thì bếp phó hỗ trợ luôn
      if (this.currentTrayItems.length === 0) {
        target = busyTables[0];
      } else {
        return;
      }
    }

    if (!target || !target.customer || !target.order) return;

    const order = target.order;

    // Kiểm tra kho nguyên liệu có đủ làm trọn gói không
    let hasAll = true;
    let missingId = null;
    for (const id of order.items) {
      const need = order.qty?.[id] || 1;
      if ((gameState.inventory[id] || 0) < need) {
        hasAll = false;
        missingId = id;
        break;
      }
    }

    if (!hasAll) {
      events.emit('ui:toast', `⚠️ Bếp phó không thể làm đủ cho ${target.customer.name} vì hết ${ITEMS[missingId]?.name || missingId}!`);
      return;
    }

    // Trừ kho nguyên liệu
    for (const id of order.items) {
      const need = order.qty?.[id] || 1;
      gameState.inventory[id] -= need;
    }

    // Tính tiền
    let totalBill = 0;
    for (const id of order.items) {
      const need = order.qty?.[id] || 1;
      totalBill += (ITEMS[id]?.sell || 10000) * need;
    }
    if (order.drink) {
      totalBill += (ITEMS[order.drink]?.sell || 12000);
    }

    const patienceRatio = target.patience / target.maxPatience;
    const chaoLvl = gameState.upgrades.chao_ran || 1;
    const chaoTipBonus = UPGRADES.chao_ran.levels.find(l => l.level === chaoLvl)?.tipBonus || 0;
    let tip = 0;
    if (patienceRatio > 0.4) {
      tip = Math.round(totalBill * 0.15 * target.customer.tipMultiplier * (1 + chaoTipBonus));
    }

    // Ghi nhận bán hàng
    gameState.recordSale(totalBill, tip);
    sound.playCoin();
    this.spawnFloatingCoin(totalBill + tip);

    events.emit('ui:toast', `👩‍🍳 Bếp phó đã làm đầy đủ và phục vụ cho ${target.customer.name} (Bàn ${target.id})! (+${(totalBill + tip).toLocaleString('vi-VN')}₫)`);
    events.emit('customer:served', { customer: target.customer, stars: 5, avatarKey: target.customer.avatarKey });

    // Nếu vừa phục vụ bàn người chơi đang chọn thì dọn sạch mẹt
    if ((target.id - 1) === this.selectedTableIndex) {
      this.currentTrayItems = [];
      this.isSauceFoamed = false;
      this.currentDrink = null;
    }

    target.customer = null;
    target.order = null;

    // Đưa khách tiếp theo từ hàng chờ vào bàn vừa trống
    this.seatFromQueue();

    this.updateDiningFloor();
    this.updateTrayItemsView();
    this.updateChecklistView();
    this.updateHintGlow();
    this.updateStatusUI();
  }

  handleSousChefAutoFill() {
    const targetTable = this.tables[this.selectedTableIndex];
    if (!targetTable || !targetTable.customer) {
      events.emit('ui:toast', `Bàn số ${this.selectedTableIndex + 1} hiện đang trống!`);
      return;
    }

    const order = targetTable.order;

    // Hoàn lại nguyên liệu đang có trên mẹt nếu có
    this.currentTrayItems.forEach(id => {
      gameState.inventory[id] = (gameState.inventory[id] || 0) + 1;
    });
    this.currentTrayItems = [];

    // Kiểm tra kho
    let hasAll = true;
    let missingId = null;
    for (const id of order.items) {
      const need = this.getManualQty(order, id);
      if ((gameState.inventory[id] || 0) < need) {
        hasAll = false;
        missingId = id;
        break;
      }
    }

    if (!hasAll) {
      events.emit('ui:toast', `⚠️ Thiếu ${ITEMS[missingId]?.name || missingId} trong kho để làm đầy đủ!`);
      sound.playChop();
      return;
    }

    // Gắp đầy đủ các món cần thiết lên mẹt
    for (const id of order.items) {
      const need = this.getManualQty(order, id);
      for (let i = 0; i < need; i++) {
        gameState.inventory[id]--;
        this.currentTrayItems.push(id);
      }
    }

    // Pha nước chấm chuẩn vị
    this.currentSauceType = order.sauce;
    this.isSauceFoamed = order.requireFoam;

    // Chuẩn bị đồ uống nếu có
    if (!this.autoDrink && order.drink) {
      this.currentDrink = order.drink;
    }

    sound.playSizzle();
    events.emit('ui:toast', '👩‍🍳 Bếp phó đã gắp đầy đủ mẹt chuẩn vị 100%!');

    this.render();
  }

  /* ---------- GIAO DIỆN ---------- */

  render() {
    this.container.innerHTML = `
      <div class="rush-container">

        <!-- Đồng hồ trong game & số lượng khách trong ngày -->
        <div class="rush-status-row">
          <div class="rush-stat-box">
            <span class="rush-stat-icon">🕚</span>
            <div class="rush-stat-text">
              <b id="rushClock">11:00</b>
              <small id="rushClockPhase"></small>
            </div>
          </div>
          <div class="rush-stat-box">
            <span class="rush-stat-icon">👥</span>
            <div class="rush-stat-text">
              <b id="rushCustomerCount">0/${this.totalCustomers}</b>
              <small id="rushCustomerDetail"></small>
            </div>
          </div>
          <button type="button" class="btn-close-early" id="btnCloseEarly" title="Đóng cửa sớm, kết thúc ca bán">🔒 Đóng cửa</button>
        </div>

        <!-- Thanh Thời Gian Ca Bán -->
        <div class="rush-time-bar-wrap">
          <div class="rush-time-progress" id="rushProgressBar" style="width: 100%;"></div>
        </div>

        <!-- Hàng chờ ngoài cửa & nhân viên đang làm việc -->
        <div class="rush-info-strip" id="rushInfoStrip"></div>

        <!-- Khu vực Bàn Ăn Khách Hàng -->
        <div class="dining-floor" id="diningFloor">
          <!-- Rendered by updateDiningFloor() -->
        </div>

        <!-- Quầy Bếp & Xếp Mẹt -->
        <div class="kitchen-workstation">
          
          <!-- Banner Bếp Chiên Đậu Sôi Xèo Xèo -->
          <div class="kitchen-cooker-banner">
            <span class="cooker-sizzle-status">
              <span class="cooker-fire-icon">🔥</span> Bếp Chảo Rán Vàng Rụm · Dầu Sôi Xèo Xèo
            </span>
            <span style="font-size:10px; color:#ffd8a8;">Chạm món để gắp lên mẹt</span>
          </div>

          <div class="tray-assembly-row">
            <!-- Mẹt Tre Lớn -->
            <div class="bamboo-tray-active" id="activeBambooTray" title="Bấm vào để dọn mẹt làm lại">
              <div class="tray-leaf-pattern"></div>
              <div class="tray-items-container" id="trayItemsWrap">
                <!-- Placed items rendered here -->
              </div>
            </div>

            <!-- Trạm Nước Chấm, Đồ Uống & Checklist Kiểm Tra -->
            <div class="sauce-and-drink-col">
              
              <!-- Checklist Kiểm Tra Tiến Độ Làm Mẹt -->
              <div class="tray-checklist-box" id="trayChecklistBox">
                <div class="checklist-header">
                  <span>📋 Cần làm bàn <b id="chkTableNum">${this.selectedTableIndex + 1}</b>:</span>
                  <span id="chkStatusText" style="color:#27ae60;font-size:10px;"></span>
                </div>
                <div class="checklist-items-row" id="checklistItemsRow">
                  <!-- Injected by updateChecklistView() -->
                </div>
              </div>

              ${this.renderAutoNotes()}

              ${this.autoSauce ? '' : `
              <!-- Trộn Nước Chấm -->
              <div class="sauce-mixer-box">
                <div class="sauce-bowl-preview ${this.currentSauceType === 'nuocmam' ? 'nuoc-mam' : ''}" id="sauceBowlPreview">
                  <div class="sauce-foam-bubble ${this.isSauceFoamed ? 'active' : ''}"></div>
                  <span class="sauce-garnish-icon">🌶️</span>
                </div>

                <div class="sauce-control-btns">
                  <div class="sauce-switch-row">
                    <button class="btn-sauce-type ${this.currentSauceType === 'mamtom' ? 'active' : ''}" id="btnSelectMamTom">
                      Mắm tôm
                    </button>
                    <button class="btn-sauce-type nuocmam ${this.currentSauceType === 'nuocmam' ? 'active' : ''}" id="btnSelectNuocMam">
                      Nước mắm
                    </button>
                  </div>
                  <button class="btn-whisk-foam" id="btnWhiskFoam">
                    🥄 Đánh Bọt Sủi (${this.isSauceFoamed ? 'Đã sủi' : 'Chưa'})
                  </button>
                </div>
              </div>
              `}

              ${this.autoDrink ? '' : `
              <!-- Chọn Đồ Uống Kèm -->
              <div class="drink-selection-row">
                <button class="drink-btn ${this.currentDrink === 'tra_tac' ? 'selected' : ''}" id="btnDrinkTac" ${!gameState.unlockedItems.includes('tra_tac') ? 'style="display:none;"' : ''}>
                  🥤 Trà tắc
                </button>
                <button class="drink-btn ${this.currentDrink === 'nuoc_sau' ? 'selected' : ''}" id="btnDrinkSau" ${!gameState.unlockedItems.includes('nuoc_sau') ? 'style="display:none;"' : ''}>
                  🧃 Nước sấu
                </button>
              </div>
              `}
            </div>
          </div>

          <!-- Khay Nguyên Liệu Gắp Món -->
          <div class="kitchen-toppings-grid" id="toppingsGrid">
            ${this.renderToppingsGrid()}
          </div>

          <!-- Thanh Thao Tác Cuối -->
          <div class="kitchen-action-bar">
            <button class="btn-clear-tray" id="btnClearTray">Xóa mẹt</button>
            ${this.autoFullOrder ? `
              <button class="btn-chef-autofill" id="btnChefAutoFill" title="Bếp phó tự động gắp đủ món cho mẹt này">
                <span>👩‍🍳</span> Bếp Làm Đầy Đủ
              </button>
            ` : ''}
            <button class="btn-serve-dish" id="btnServeDish">
              <span>🥢</span> BƯNG RA BÀN SỐ <span id="serveTableNum">${this.selectedTableIndex + 1}</span>
            </button>
          </div>

        </div>

      </div>
    `;

    this.updateDiningFloor();
    this.updateTrayItemsView();
    this.updateChecklistView();
    this.updateHintGlow();
    this.updateStatusUI();
    this.bindEvents();
  }

  // Ghi chú các công việc đã có nhân viên lo giúp
  renderAutoNotes() {
    const notes = [];
    if (this.autoFullOrder) notes.push('👩‍🍳 Bếp phó làm đầy đủ cho khách sau');
    if (this.autoSauce) notes.push('👨‍🍳 Đầu bếp pha nước chấm');
    if (this.autoBase) notes.push('👨‍🍳 Bếp phụ chiên Bún lá & Đậu');
    if (this.autoDrink) notes.push('🛎️ Phục vụ bưng đồ uống');
    if (notes.length === 0) return '';
    return `
      <div class="staff-auto-note">
        ${notes.map(n => `<span>${n}</span>`).join('')}
      </div>
    `;
  }

  // Cập nhật đồng hồ, số lượng khách, thanh thời gian & hàng chờ
  updateStatusUI() {
    const clockEl = document.getElementById('rushClock');
    const phaseEl = document.getElementById('rushClockPhase');
    const countEl = document.getElementById('rushCustomerCount');
    const detailEl = document.getElementById('rushCustomerDetail');
    const progressEl = document.getElementById('rushProgressBar');
    const stripEl = document.getElementById('rushInfoStrip');
    const btnCloseEarly = document.getElementById('btnCloseEarly');

    const stats = gameState.todayStats;

    if (clockEl) clockEl.textContent = this.getClockText();
    if (phaseEl) phaseEl.textContent = this.getClockPhaseLabel();
    if (countEl) countEl.textContent = `${stats.arrivedCount}/${this.totalCustomers}`;
    if (detailEl) {
      const lostText = stats.lostCount > 0 ? ` · Mất ${stats.lostCount}` : '';
      detailEl.textContent = `Phục vụ ${stats.servedCount}${lostText}`;
    }

    if (progressEl) {
      const pct = (1 - Math.min(this.elapsed, SHIFT_MINUTES) / SHIFT_MINUTES) * 100;
      progressEl.style.width = `${pct}%`;
    }

    if (btnCloseEarly) btnCloseEarly.disabled = this.isClosing;

    if (stripEl) {
      const queueText = this.queue.length > 0
        ? `🚶 Hàng chờ: ${'🧍'.repeat(this.queue.length)} (${this.queue.length})`
        : '🚪 Không có khách chờ';
      const staffText = Object.keys(STAFF)
        .filter(role => gameState.getStaffCount(role) > 0)
        .map(role => `${STAFF[role].icon}×${gameState.getStaffCount(role)}`)
        .join(' ') || 'Chưa thuê nhân viên';
      stripEl.innerHTML = `<span>${queueText}</span><span>${staffText}</span>`;
    }
  }

  // Làm mới bàn ăn kèm checklist khi có khách vào/ra
  refreshTableUI() {
    this.updateDiningFloor();
    this.updateChecklistView();
    this.updateHintGlow();
  }

  updateDiningFloor() {
    const floorEl = document.getElementById('diningFloor');
    if (!floorEl) return;

    floorEl.innerHTML = this.tables.map((table, idx) => {
      const isSelected = idx === this.selectedTableIndex;
      if (!table.customer) {
        return `
          <div class="dining-table empty ${isSelected ? 'selected' : ''}" data-index="${idx}">
            <span class="table-num">Bàn ${table.id}</span>
            <span>Bàn trống</span>
          </div>
        `;
      }

      const pct = (table.patience / table.maxPatience) * 100;
      let barClass = '';
      if (pct < 30) barClass = 'critical';
      else if (pct < 60) barClass = 'warning';

      const sauceIsMamTom = table.order.sauce === 'mamtom';
      const sauceLabel = sauceIsMamTom ? (table.order.requireFoam ? 'Mắm tôm bọt' : 'Mắm tôm') : 'Nước mắm';
      const drinkName = table.order.drink ? ITEMS[table.order.drink]?.shortName : '';
      const sizeKey = table.order.size || 'small';

      return `
        <div class="dining-table ${isSelected ? 'selected' : ''}" data-index="${idx}">
          <span class="table-num">Bàn ${table.id}</span>
          
          <div class="customer-avatar-box">
            <div class="customer-avatar-chibi">
              ${renderIcon(table.customer.avatarKey || 'chibi_student')}
            </div>
            <span class="customer-name">${table.customer.name}</span>
          </div>

          <div class="patience-bar-wrap">
            <div class="patience-bar ${barClass}" style="width: ${pct}%;"></div>
          </div>

          <!-- Bong bóng Order với icon món trực quan -->
          <div class="order-bubble">
            <div class="order-title">
              🥢 Gọi mẹt bún đậu
              <span class="order-size-tag ${sizeKey}">${SIZE_LABELS[sizeKey]}</span>
            </div>
            <div class="order-items-mini">
              ${table.order.items.map(itemId => {
                const q = table.order.qty?.[itemId] || 1;
                return `
                <div class="order-mini-icon-badge" title="${ITEMS[itemId]?.name || itemId} ×${q}">
                  ${renderIcon(ITEMS[itemId]?.icon || 'bun')}
                  ${q > 1 ? `<span class="order-qty-badge">×${q}</span>` : ''}
                </div>
              `;
              }).join('')}
              <span class="order-mini-tag ${sauceIsMamTom ? 'sauce-mam-tom' : 'sauce-nuoc-mam'}">
                ${sauceIsMamTom ? '🥣' : '🍯'} ${sauceLabel}
              </span>
              ${drinkName ? `<span class="order-mini-tag drink-tag">🥤 ${drinkName}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const serveTableNumEl = document.getElementById('serveTableNum');
    if (serveTableNumEl) {
      serveTableNumEl.textContent = this.selectedTableIndex + 1;
    }

    const chkTableNumEl = document.getElementById('chkTableNum');
    if (chkTableNumEl) {
      chkTableNumEl.textContent = this.selectedTableIndex + 1;
    }
  }

  renderToppingsGrid() {
    const availableToppingIds = ['bun_la', 'dau_hu', 'cha_com', 'thit_luoc', 'nem_ran', 'doi_sun', 'rau_song'].filter(id =>
      gameState.unlockedItems.includes(id) && !(this.autoBase && BASE_ITEM_IDS.includes(id))
    );

    return availableToppingIds.map(id => {
      const item = ITEMS[id];
      const stock = gameState.inventory[id] || 0;
      const isEmpty = stock <= 0;

      return `
        <button class="topping-card-btn ${isEmpty ? 'empty-stock' : ''}" data-topping="${id}" ${isEmpty ? 'disabled' : ''}>
          <div class="topping-icon-render">${renderIcon(item.icon)}</div>
          <span class="topping-card-name">${item.shortName}</span>
          <span class="topping-card-stock">Còn: ${stock}</span>
        </button>
      `;
    }).join('');
  }

  updateTrayItemsView() {
    const wrap = document.getElementById('trayItemsWrap');
    if (!wrap) return;

    wrap.innerHTML = this.currentTrayItems.map(id => {
      const item = ITEMS[id];
      return `
        <div class="tray-placed-item" title="${item?.name || id}">
          ${renderIcon(item?.icon || 'bun')}
        </div>
      `;
    }).join('');
  }

  /* ---------- KIỂM TRA MẸT ---------- */

  countOnTray(itemId) {
    return this.currentTrayItems.filter(id => id === itemId).length;
  }

  // Số phần người chơi phải tự gắp lên mẹt (Bún lá & Đậu do đầu bếp phụ lo nếu có)
  getManualQty(order, itemId) {
    if (this.autoBase && BASE_ITEM_IDS.includes(itemId)) return 0;
    return order.qty?.[itemId] || 1;
  }

  // Đánh giá mẹt hiện tại so với order của bàn
  evaluateTray(order) {
    const problems = [];

    const missing = [];
    order.items.forEach(id => {
      const need = this.getManualQty(order, id);
      if (this.countOnTray(id) < need) missing.push(`${ITEMS[id]?.name || id}${need > 1 ? ` ×${need}` : ''}`);
    });
    if (missing.length > 0) {
      problems.push(`❌ Thiếu món: ${missing.join(', ')}! Hãy gắp đủ vào mẹt.`);
    }

    const extra = [...new Set(this.currentTrayItems)].filter(id => {
      const need = order.items.includes(id) ? this.getManualQty(order, id) : 0;
      return this.countOnTray(id) > need;
    });
    if (extra.length > 0) {
      const extraNames = extra.map(id => ITEMS[id]?.name || id).join(', ');
      problems.push(`❌ Mẹt thừa món: ${extraNames}! Khách gọi mẹt size ${SIZE_LABELS[order.size || 'small']}, hãy xóa mẹt làm lại.`);
    }

    // Bún lá & Đậu do đầu bếp phụ chiên cần đủ hàng trong kho
    if (this.autoBase) {
      const lacking = BASE_ITEM_IDS.filter(id => (gameState.inventory[id] || 0) < (order.qty?.[id] || 1));
      if (lacking.length > 0) {
        problems.push(`❌ Kho không đủ ${lacking.map(id => ITEMS[id]?.name).join(', ')} để đầu bếp chiên!`);
      }
    }

    if (!this.autoSauce) {
      if (order.sauce !== this.currentSauceType) {
        const expected = order.sauce === 'mamtom' ? 'Mắm tôm' : 'Nước mắm';
        problems.push(`❌ Khách yêu cầu ${expected}! Bạn đang dùng sai nước chấm.`);
      } else if (order.requireFoam && !this.isSauceFoamed) {
        problems.push('❌ Khách yêu cầu Mắm tôm phải đánh sủi bọt trắng! Hãy bấm nút Đánh Bọt.');
      }
    }

    if (!this.autoDrink && order.drink && order.drink !== this.currentDrink) {
      problems.push(`❌ Khách có gọi thêm ${ITEMS[order.drink]?.name}! Hãy chọn đồ uống.`);
    }

    return { ready: problems.length === 0, problems };
  }

  // Cập nhật Checklist trực quan theo thời gian thực
  updateChecklistView() {
    const checklistRow = document.getElementById('checklistItemsRow');
    const chkStatusText = document.getElementById('chkStatusText');
    const btnServeDish = document.getElementById('btnServeDish');
    if (!checklistRow) return;

    const targetTable = this.tables[this.selectedTableIndex];
    if (!targetTable || !targetTable.customer) {
      checklistRow.innerHTML = `<span style="font-size:11px;color:#8c7362;">Bàn trống, hãy chọn bàn có khách.</span>`;
      if (chkStatusText) chkStatusText.textContent = '';
      return;
    }

    const order = targetTable.order;
    const sizeLabel = SIZE_LABELS[order.size || 'small'];

    let chipsHtml = `<span class="check-item-chip size-chip">🥢 Mẹt ${sizeLabel}</span>`;

    chipsHtml += order.items.map(itemId => {
      const need = order.qty?.[itemId] || 1;
      const name = ITEMS[itemId]?.shortName || itemId;

      // Món do đầu bếp phụ lo
      if (this.autoBase && BASE_ITEM_IDS.includes(itemId)) {
        const enough = (gameState.inventory[itemId] || 0) >= need;
        return `
          <span class="check-item-chip ${enough ? 'done' : 'missing'}">
            ${enough ? '👨‍🍳' : '⭕'} ${name} ×${need}
          </span>
        `;
      }

      const have = this.countOnTray(itemId);
      const isExact = have === need;
      const mark = isExact ? '✓' : (have > need ? '⚠️' : '⭕');
      return `
        <span class="check-item-chip ${isExact ? 'done' : 'missing'}">
          ${mark} ${name} ${have}/${need}
        </span>
      `;
    }).join('');

    // Nước chấm
    const sauceName = order.sauce === 'mamtom' ? (order.requireFoam ? 'Mắm tôm bọt' : 'Mắm tôm') : 'Nước mắm';
    if (this.autoSauce) {
      chipsHtml += `<span class="check-item-chip done">👨‍🍳 ${sauceName}</span>`;
    } else {
      const sauceMatched = (order.sauce === this.currentSauceType) && (!order.requireFoam || this.isSauceFoamed);
      chipsHtml += `
        <span class="check-item-chip ${sauceMatched ? 'done' : 'missing'}">
          ${sauceMatched ? '✓' : '⭕'} ${sauceName}
        </span>
      `;
    }

    // Đồ uống
    if (order.drink) {
      if (this.autoDrink) {
        chipsHtml += `<span class="check-item-chip done">🛎️ ${ITEMS[order.drink]?.shortName}</span>`;
      } else {
        const drinkMatched = this.currentDrink === order.drink;
        chipsHtml += `
          <span class="check-item-chip ${drinkMatched ? 'done' : 'missing'}">
            ${drinkMatched ? '✓' : '⭕'} ${ITEMS[order.drink]?.shortName}
          </span>
        `;
      }
    }

    checklistRow.innerHTML = chipsHtml;

    const allReady = this.evaluateTray(order).ready;

    if (chkStatusText) {
      chkStatusText.textContent = allReady ? '✨ Đủ món rồi!' : '';
    }

    if (btnServeDish) {
      if (allReady) {
        btnServeDish.style.boxShadow = '0 0 16px rgba(46, 204, 113, 0.8)';
        btnServeDish.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      } else {
        btnServeDish.style.boxShadow = '';
        btnServeDish.style.background = '';
      }
    }
  }

  // Viền vàng phát sáng gợi ý món cần chọn
  updateHintGlow() {
    const targetTable = this.tables[this.selectedTableIndex];
    const toppingButtons = document.querySelectorAll('.topping-card-btn[data-topping]');

    toppingButtons.forEach(btn => {
      const toppingId = btn.dataset.topping;
      if (targetTable && targetTable.customer && targetTable.order) {
        const need = targetTable.order.items.includes(toppingId)
          ? this.getManualQty(targetTable.order, toppingId)
          : 0;
        const isNeeded = this.countOnTray(toppingId) < need;
        if (isNeeded) {
          btn.classList.add('order-hint-glow');
        } else {
          btn.classList.remove('order-hint-glow');
        }
      } else {
        btn.classList.remove('order-hint-glow');
      }
    });
  }

  bindEvents() {
    // 0. Đóng cửa sớm
    const btnCloseEarly = document.getElementById('btnCloseEarly');
    if (btnCloseEarly) {
      btnCloseEarly.addEventListener('click', () => {
        if (this.isClosing) return;
        const remainingCustomers = this.arrivalSchedule.length - this.arrivalIndex;
        const msg = remainingCustomers > 0
          ? `Đóng cửa sớm? Còn ${remainingCustomers} lượt khách chưa ghé quán sẽ bị bỏ lỡ.`
          : 'Đóng cửa sớm và kết thúc ca bán?';
        if (confirm(msg)) {
          this.closeShop(true);
        }
      });
    }

    // 1. Chọn bàn ăn
    const diningFloor = document.getElementById('diningFloor');
    if (diningFloor) {
      diningFloor.addEventListener('click', (e) => {
        const tableCard = e.target.closest('.dining-table');
        if (tableCard) {
          this.selectedTableIndex = parseInt(tableCard.dataset.index, 10) || 0;
          this.updateDiningFloor();
          this.updateChecklistView();
          this.updateHintGlow();
          sound.playPop();
        }
      });
    }

    // 2. Gắp nguyên liệu vào mẹt
    const toppingsGrid = document.getElementById('toppingsGrid');
    if (toppingsGrid) {
      toppingsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-topping]');
        if (!btn || btn.disabled) return;

        const toppingId = btn.dataset.topping;
        const currentStock = gameState.inventory[toppingId] || 0;

        if (currentStock <= 0) {
          events.emit('ui:toast', `⚠️ Hết ${ITEMS[toppingId]?.name} trong kho rồi!`);
          return;
        }

        // Trừ kho & thêm vào mẹt
        gameState.inventory[toppingId]--;
        this.currentTrayItems.push(toppingId);

        // Hiệu ứng âm thanh chân thực
        if (toppingId === 'dau_hu') sound.playSizzle();
        else if (toppingId === 'thit_luoc') sound.playChop();
        else sound.playPop();

        this.updateTrayItemsView();
        this.updateChecklistView();
        this.updateHintGlow();

        // Cập nhật lại số lượng hiển thị trên nút
        btn.querySelector('.topping-card-stock').textContent = `Còn: ${gameState.inventory[toppingId]}`;
        if (gameState.inventory[toppingId] <= 0) {
          btn.classList.add('empty-stock');
          btn.disabled = true;
        }
      });
    }

    // 3. Đổi nước chấm
    const btnMamTom = document.getElementById('btnSelectMamTom');
    const btnNuocMam = document.getElementById('btnSelectNuocMam');
    const sauceBowlPreview = document.getElementById('sauceBowlPreview');

    if (btnMamTom && btnNuocMam) {
      btnMamTom.addEventListener('click', () => {
        sound.playPop();
        this.currentSauceType = 'mamtom';
        btnMamTom.classList.add('active');
        btnNuocMam.classList.remove('active');
        if (sauceBowlPreview) sauceBowlPreview.classList.remove('nuoc-mam');
        this.updateChecklistView();
      });

      btnNuocMam.addEventListener('click', () => {
        sound.playPop();
        this.currentSauceType = 'nuocmam';
        btnNuocMam.classList.add('active');
        btnMamTom.classList.remove('active');
        if (sauceBowlPreview) sauceBowlPreview.classList.add('nuoc-mam');
        this.updateChecklistView();
      });
    }

    // 4. Đánh bọt sủi mắm tôm
    const btnWhiskFoam = document.getElementById('btnWhiskFoam');
    if (btnWhiskFoam) {
      btnWhiskFoam.addEventListener('click', () => {
        sound.playWhisk();
        this.isSauceFoamed = !this.isSauceFoamed;
        btnWhiskFoam.textContent = `🥄 Đánh Bọt Sủi (${this.isSauceFoamed ? 'Đã sủi' : 'Chưa'})`;
        const foamBubble = document.querySelector('.sauce-foam-bubble');
        if (foamBubble) {
          foamBubble.classList.toggle('active', this.isSauceFoamed);
        }
        this.updateChecklistView();
      });
    }

    // 5. Chọn đồ uống kèm
    const btnDrinkTac = document.getElementById('btnDrinkTac');
    const btnDrinkSau = document.getElementById('btnDrinkSau');

    if (btnDrinkTac) {
      btnDrinkTac.addEventListener('click', () => {
        sound.playPop();
        this.currentDrink = this.currentDrink === 'tra_tac' ? null : 'tra_tac';
        btnDrinkTac.classList.toggle('selected', this.currentDrink === 'tra_tac');
        if (btnDrinkSau) btnDrinkSau.classList.remove('selected');
        this.updateChecklistView();
      });
    }

    if (btnDrinkSau) {
      btnDrinkSau.addEventListener('click', () => {
        sound.playPop();
        this.currentDrink = this.currentDrink === 'nuoc_sau' ? null : 'nuoc_sau';
        btnDrinkSau.classList.toggle('selected', this.currentDrink === 'nuoc_sau');
        if (btnDrinkTac) btnDrinkTac.classList.remove('selected');
        this.updateChecklistView();
      });
    }

    // 6. Xóa làm lại mẹt
    const btnClearTray = document.getElementById('btnClearTray');
    if (btnClearTray) {
      btnClearTray.addEventListener('click', () => {
        // Hoàn lại nguyên liệu vào kho
        this.currentTrayItems.forEach(id => {
          gameState.inventory[id] = (gameState.inventory[id] || 0) + 1;
        });
        this.currentTrayItems = [];
        this.isSauceFoamed = false;
        this.currentDrink = null;
        sound.playPop();
        events.emit('ui:toast', 'Đã dọn sạch mẹt để gắp lại');
        this.render();
      });
    }

    // 6.5 Bếp phó làm đầy đủ mẹt này
    const btnChefAutoFill = document.getElementById('btnChefAutoFill');
    if (btnChefAutoFill) {
      btnChefAutoFill.addEventListener('click', () => {
        this.handleSousChefAutoFill();
      });
    }

    // 7. BƯNG MÓN PHỤC VỤ (SERVE)
    const btnServeDish = document.getElementById('btnServeDish');
    if (btnServeDish) {
      btnServeDish.addEventListener('click', () => {
        this.handleServeOrder();
      });
    }
  }

  handleServeOrder() {
    const targetTable = this.tables[this.selectedTableIndex];
    if (!targetTable || !targetTable.customer) {
      events.emit('ui:toast', `Bàn số ${this.selectedTableIndex + 1} hiện đang trống!`);
      return;
    }

    const order = targetTable.order;

    // Kiểm tra món, size, nước chấm & đồ uống
    const result = this.evaluateTray(order);
    if (!result.ready) {
      events.emit('ui:toast', result.problems[0]);
      sound.playChop();
      return;
    }

    // PHỤC VỤ THÀNH CÔNG!
    let totalBill = 0;
    this.currentTrayItems.forEach(id => {
      totalBill += (ITEMS[id]?.sell || 10000);
    });

    // Đầu bếp phụ tự chiên Bún lá & Đậu rán (trừ kho tại đây)
    if (this.autoBase) {
      BASE_ITEM_IDS.forEach(id => {
        const q = order.qty?.[id] || 1;
        gameState.inventory[id] = Math.max(0, (gameState.inventory[id] || 0) - q);
        totalBill += (ITEMS[id]?.sell || 10000) * q;
      });
    }

    const drinkServed = this.autoDrink ? order.drink : this.currentDrink;
    if (drinkServed) {
      totalBill += (ITEMS[drinkServed]?.sell || 12000);
    }

    // Tiền tip phụ thuộc vào độ kiên nhẫn còn lại và nâng cấp
    const patienceRatio = targetTable.patience / targetTable.maxPatience;
    const chaoLvl = gameState.upgrades.chao_ran || 1;
    const chaoTipBonus = UPGRADES.chao_ran.levels.find(l => l.level === chaoLvl)?.tipBonus || 0;
    
    let tip = 0;
    if (patienceRatio > 0.5) {
      tip = Math.round(totalBill * 0.15 * targetTable.customer.tipMultiplier * (1 + chaoTipBonus));
    }

    // Ghi nhận bán hàng
    gameState.recordSale(totalBill, tip);
    sound.playCoin();

    // Hiệu ứng tiền bay
    this.spawnFloatingCoin(totalBill + tip);

    events.emit('ui:toast', `🎉 ${targetTable.customer.name} rất hài lòng! (+${(totalBill + tip).toLocaleString('vi-VN')}₫)`);
    events.emit('customer:served', { customer: targetTable.customer, stars: 5, avatarKey: targetTable.customer.avatarKey });

    // Giải phóng bàn và reset mẹt
    targetTable.customer = null;
    targetTable.order = null;
    this.currentTrayItems = [];
    this.isSauceFoamed = false;
    this.currentDrink = null;

    // Khách đang xếp hàng ngoài cửa vào ngồi bàn vừa trống
    this.seatFromQueue();

    this.render();
  }

  spawnFloatingCoin(amount) {
    const el = document.createElement('div');
    el.className = 'floating-coin-effect';
    el.textContent = `+${amount.toLocaleString('vi-VN')}₫`;
    el.style.left = '50%';
    el.style.top = '40%';
    this.container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1200);
  }
}
