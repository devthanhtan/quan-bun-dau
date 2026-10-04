/* ==========================================================================
   🎮 GAME STATE - TRẠNG THÁI TOÀN CỤC & HỆ THỐNG KINH TẾ QUÁN BÚN ĐẬU
   ========================================================================== */

import { ITEMS, SAUCES } from '../data/items.js';
import { UPGRADES } from '../data/upgrades.js';
import { STAFF, STAFF_MAX_PER_ROLE } from '../data/staff.js';
import { INITIAL_FEED_POSTS, INITIAL_REVIEWS } from '../data/reviews.js';
import { events } from './EventBus.js';

const SAVE_KEY = 'quan_bun_dau_save_v1';

function createEmptyStats() {
  return {
    revenue: 0,
    costs: 0,
    spoilage: 0,
    tips: 0,
    servedCount: 0,
    failedCount: 0,
    arrivedCount: 0,   // Tổng số khách đã ghé quán trong ngày
    lostCount: 0,      // Khách bỏ đi vì quán hết chỗ / chờ ngoài cửa quá lâu
    wages: 0,          // Lương nhân viên đã trả cuối ngày
    staffQuit: [],     // Nhân viên nghỉ việc vì không đủ tiền trả lương
    incidentLoss: 0,   // Tiền bị mất do sự cố (trộm cắp)
    incidentsBlocked: 0,
    incidentsHit: 0
  };
}

class GameStateManager {
  constructor() {
    this.resetToDefaults();
  }

  resetToDefaults() {
    this.shopName = 'Quán Bún Đậu Mơ Ước';
    this.day = 1;
    this.phase = 'prep'; // 'prep' | 'rush' | 'summary'
    this.money = 200000; // Vốn khởi nghiệp 200.000đ
    this.rating = 5.0;   // Đánh giá sao uy tín

    // Kho nguyên liệu: [ { id, qty, expireInDays } ]
    this.inventory = {
      bun_la: 6,
      dau_hu: 10,
      rau_song: 6,
      cha_com: 0,
      thit_luoc: 0,
      nem_ran: 0,
      doi_sun: 0,
      tra_tac: 0,
      nuoc_sau: 0
    };

    // Nâng cấp quán
    this.upgrades = {
      ban_ghe: 1,
      quat_gio: 1,
      chao_ran: 1,
      bang_hieu: 1
    };

    // Danh sách món ăn đã mở khóa
    this.unlockedItems = ['bun_la', 'dau_hu', 'rau_song'];

    // Nhân viên đang thuê
    this.staff = {
      waiter: 0,
      cook: 0,
      guard: 0,
      sous_chef: 0
    };

    // Thống kê ngày hôm nay
    this.todayStats = createEmptyStats();

    // Chú chó Vện canh quán
    this.dogBuffReady = true;

    // MXH & Reviews
    this.feed = [...INITIAL_FEED_POSTS];
    this.reviews = [...INITIAL_REVIEWS];
  }

  init() {
    this.load();
    this.checkUnlocksForDay();
  }

  checkUnlocksForDay() {
    let newlyUnlocked = [];
    Object.values(ITEMS).forEach(item => {
      if (this.day >= item.unlockDay && !this.unlockedItems.includes(item.id)) {
        this.unlockedItems.push(item.id);
        newlyUnlocked.push(item.name);
      }
    });
    return newlyUnlocked;
  }

  save() {
    try {
      const data = {
        shopName: this.shopName,
        day: this.day,
        phase: this.phase,
        money: this.money,
        rating: this.rating,
        inventory: this.inventory,
        upgrades: this.upgrades,
        staff: this.staff,
        unlockedItems: this.unlockedItems,
        todayStats: this.todayStats,
        feed: this.feed,
        reviews: this.reviews
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      events.emit('state:saved');
    } catch (e) {
      console.error('Lỗi khi lưu game:', e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        this.shopName = data.shopName || this.shopName;
        this.day = data.day || 1;
        this.phase = data.phase || 'prep';
        this.money = typeof data.money === 'number' ? data.money : this.money;
        this.rating = typeof data.rating === 'number' ? data.rating : this.rating;
        this.inventory = { ...this.inventory, ...(data.inventory || {}) };
        this.upgrades = { ...this.upgrades, ...(data.upgrades || {}) };
        this.staff = { ...this.staff, ...(data.staff || {}) };
        this.unlockedItems = Array.isArray(data.unlockedItems) ? data.unlockedItems : this.unlockedItems;
        this.todayStats = { ...createEmptyStats(), ...(data.todayStats || {}) };
        this.feed = Array.isArray(data.feed) ? data.feed : this.feed;
        this.reviews = Array.isArray(data.reviews) ? data.reviews : this.reviews;
        events.emit('state:loaded');
        return true;
      }
    } catch (e) {
      console.error('Lỗi khi tải save:', e);
    }
    return false;
  }

  exportSaveCode() {
    const jsonStr = JSON.stringify({
      shopName: this.shopName,
      day: this.day,
      money: this.money,
      rating: this.rating,
      inventory: this.inventory,
      upgrades: this.upgrades,
      staff: this.staff,
      unlockedItems: this.unlockedItems
    });
    return btoa(encodeURIComponent(jsonStr));
  }

  importSaveCode(code) {
    try {
      const jsonStr = decodeURIComponent(atob(code.trim()));
      const data = JSON.parse(jsonStr);
      if (data && data.money !== undefined) {
        this.shopName = data.shopName || this.shopName;
        this.day = data.day || 1;
        this.money = data.money;
        this.rating = data.rating || 5.0;
        this.inventory = { ...this.inventory, ...(data.inventory || {}) };
        this.upgrades = { ...this.upgrades, ...(data.upgrades || {}) };
        this.staff = { ...this.staff, ...(data.staff || {}) };
        this.unlockedItems = data.unlockedItems || this.unlockedItems;
        this.phase = 'prep';
        this.save();
        events.emit('state:updated');
        return true;
      }
    } catch (e) {
      console.error('Mã save không hợp lệ:', e);
    }
    return false;
  }

  resetGame() {
    localStorage.removeItem(SAVE_KEY);
    this.resetToDefaults();
    this.save();
    events.emit('state:updated');
  }

  setShopName(name) {
    if (!name || !name.trim()) return;
    this.shopName = name.trim();
    this.save();
    events.emit('state:updated');
  }

  buyItem(itemId, qty = 1) {
    const item = ITEMS[itemId];
    if (!item) return { success: false, msg: 'Nguyên liệu không tồn tại' };

    const totalCost = item.cost * qty;
    if (this.money < totalCost) {
      return { success: false, msg: 'Không đủ tiền nhập hàng!' };
    }

    this.money -= totalCost;
    this.inventory[itemId] = (this.inventory[itemId] || 0) + qty;
    this.todayStats.costs += totalCost;

    this.save();
    events.emit('state:updated');
    return { success: true, msg: `Đã nhập ${qty} ${item.name} (-${totalCost.toLocaleString('vi-VN')}₫)` };
  }

  upgradeItem(upgradeId) {
    const upg = UPGRADES[upgradeId];
    if (!upg) return { success: false, msg: 'Trang thiết bị không tồn tại' };

    const currentLvl = this.upgrades[upgradeId] || 1;
    const nextLvl = currentLvl + 1;
    const nextInfo = upg.levels.find(l => l.level === nextLvl);

    if (!nextInfo) {
      return { success: false, msg: 'Đã nâng cấp tối đa!' };
    }

    if (this.money < nextInfo.cost) {
      return { success: false, msg: 'Không đủ tiền nâng cấp!' };
    }

    this.money -= nextInfo.cost;
    this.upgrades[upgradeId] = nextLvl;

    this.save();
    events.emit('state:updated');
    return { success: true, msg: `Nâng cấp thành công ${upg.name} lên Cấp ${nextLvl}!` };
  }

  triggerDogBuff() {
    if (!this.dogBuffReady) return false;
    this.dogBuffReady = false;
    events.emit('dog:buff_triggered');
    setTimeout(() => {
      this.dogBuffReady = true;
      events.emit('state:updated');
    }, 25000); // 25s hồi lại
    events.emit('state:updated');
    return true;
  }

  /* ---------- NHÂN VIÊN ---------- */

  getStaffCount(role) {
    return this.staff[role] || 0;
  }

  hireStaff(role) {
    const info = STAFF[role];
    if (!info) return { success: false, msg: 'Vị trí nhân viên không tồn tại' };
    if (this.getStaffCount(role) >= STAFF_MAX_PER_ROLE) {
      return { success: false, msg: `Quán chỉ cần tối đa ${STAFF_MAX_PER_ROLE} ${info.name.toLowerCase()}!` };
    }
    if (this.money < info.hireCost) {
      return { success: false, msg: 'Không đủ tiền tuyển nhân viên!' };
    }

    this.money -= info.hireCost;
    this.todayStats.costs += info.hireCost;
    this.staff[role] = this.getStaffCount(role) + 1;
    this.save();
    events.emit('state:updated');
    return { success: true, msg: `Đã tuyển ${info.name} (-${info.hireCost.toLocaleString('vi-VN')}₫)` };
  }

  fireStaff(role) {
    const info = STAFF[role];
    if (!info || this.getStaffCount(role) <= 0) {
      return { success: false, msg: 'Không có nhân viên để cho nghỉ' };
    }
    this.staff[role] = this.getStaffCount(role) - 1;
    this.save();
    events.emit('state:updated');
    return { success: true, msg: `Đã cho ${info.name} nghỉ việc` };
  }

  getDailyWages() {
    return Object.keys(STAFF).reduce((sum, role) => sum + STAFF[role].wage * this.getStaffCount(role), 0);
  }

  // Trả lương cuối ngày. Không đủ tiền thì nhân viên đó nghỉ việc.
  payWages() {
    let paid = 0;
    const quit = [];
    Object.keys(STAFF).forEach(role => {
      const info = STAFF[role];
      const count = this.getStaffCount(role);
      for (let i = 0; i < count; i++) {
        if (this.money >= info.wage) {
          this.money -= info.wage;
          paid += info.wage;
        } else {
          this.staff[role]--;
          quit.push(info.name);
        }
      }
    });
    this.todayStats.wages = paid;
    this.todayStats.staffQuit = quit;
    return { paid, quit };
  }

  /* ---------- SỐ KHÁCH TRONG NGÀY ---------- */

  // Số lượt khách dự kiến ghé quán trong ngày: tăng nhiều hơn theo ngày, uy tín và bảng hiệu
  getExpectedCustomers() {
    const signLvl = this.upgrades.bang_hieu || 1;
    const base = 50 + this.day * 15; // Ngày 1: ~65 khách, Ngày 2: ~80 khách, Ngày 3: ~95 khách...
    const ratingFactor = 0.8 + this.rating * 0.04; // 5 sao = x1.0
    const signBonus = (signLvl - 1) * 12;
    return Math.min(250, Math.round(base * ratingFactor) + signBonus);
  }

  adjustRating(delta) {
    this.rating = Math.min(5.0, Math.max(1.0, parseFloat((this.rating + delta).toFixed(1))));
    this.save();
    events.emit('state:updated');
  }

  loseMoney(amount) {
    const lost = Math.min(this.money, Math.max(0, Math.round(amount)));
    this.money -= lost;
    this.todayStats.incidentLoss += lost;
    this.save();
    events.emit('state:updated');
    return lost;
  }

  startRush() {
    this.phase = 'rush';
    // Giữ lại chi phí nhập hàng đã phát sinh ở giai đoạn chuẩn bị
    const costs = this.todayStats.costs;
    this.todayStats = createEmptyStats();
    this.todayStats.costs = costs;
    this.save();
    events.emit('phase:changed', 'rush');
  }

  recordSale(revenue, tip = 0) {
    this.money += (revenue + tip);
    this.todayStats.revenue += revenue;
    this.todayStats.tips += tip;
    this.todayStats.servedCount++;
    this.save();
    events.emit('state:updated');
  }

  recordCustomerWalkout() {
    this.todayStats.failedCount++;
    // Giảm nhẹ uy tín khi để khách giận bỏ đi
    this.rating = Math.max(1.0, parseFloat((this.rating - 0.15).toFixed(1)));
    this.save();
    events.emit('state:updated');
  }

  // Khách ghé quán nhưng hết chỗ / chờ ngoài cửa quá lâu nên bỏ đi (không bị trừ sao)
  recordCustomerLost() {
    this.todayStats.lostCount++;
    this.save();
  }

  finishRush() {
    this.phase = 'summary';
    this.payWages();
    // Tính điểm đánh giá sao sau ca bán
    if (this.todayStats.servedCount > 0) {
      const bonus = (this.todayStats.servedCount / (this.todayStats.servedCount + this.todayStats.failedCount * 2)) * 0.2;
      this.rating = Math.min(5.0, parseFloat((this.rating + bonus).toFixed(1)));
    }
    this.save();
    events.emit('phase:changed', 'summary');
  }

  advanceToNextDay() {
    this.day++;
    this.phase = 'prep';
    this.dogBuffReady = true;
    this.todayStats = createEmptyStats();

    // Hao hụt nguyên liệu theo ngày (mô phỏng độ tươi)
    let totalSpoilage = 0;
    Object.keys(this.inventory).forEach(k => {
      if (this.inventory[k] > 0 && Math.random() < 0.25) {
        const lost = Math.min(this.inventory[k], 1);
        this.inventory[k] -= lost;
        const itemInfo = ITEMS[k];
        if (itemInfo) totalSpoilage += lost * itemInfo.cost;
      }
    });

    const newlyUnlocked = this.checkUnlocksForDay();
    this.save();
    events.emit('day:advanced', { day: this.day, newlyUnlocked, totalSpoilage });
    events.emit('phase:changed', 'prep');
  }
}

export const gameState = new GameStateManager();
