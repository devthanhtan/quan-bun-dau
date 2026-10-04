/* ==========================================================================
   🌅 PREP VIEW - GIAI ĐOẠN CHUẨN BỊ BUỔI SÁNG (NHẬP KHO & NÂNG CẤP)
   ========================================================================== */

import { gameState } from '../core/GameState.js';
import { ITEMS } from '../data/items.js';
import { UPGRADES } from '../data/upgrades.js';
import { STAFF, STAFF_MAX_PER_ROLE } from '../data/staff.js';
import { renderIcon } from '../renderers/SVGIcons.js';
import { sound } from '../audio/SoundManager.js';
import { events } from '../core/EventBus.js';

export class PrepView {
  constructor(container, onStartRush) {
    this.container = container;
    this.onStartRush = onStartRush;
    this.activeTab = 'market'; // 'market' | 'upgrades' | 'staff'
  }

  mount() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="prep-container">
        
        <!-- Header Banner Buổi Sáng -->
        <div class="prep-hero-card">
          <div class="prep-hero-info">
            <h2>☀️ Chuẩn Bị Ngày ${gameState.day}</h2>
            <p>Kiểm tra kho, nhập nguyên liệu tươi ngon và nâng cấp quán để đón khách!</p>
            <p class="prep-forecast">🕚 Mở cửa 11:00 – 22:00 · 👥 Dự kiến ~${gameState.getExpectedCustomers()} khách · 💸 Lương NV: ${gameState.getDailyWages().toLocaleString('vi-VN')}₫/ngày</p>
          </div>
          <div class="prep-hero-badge" style="font-size: 32px;">🏮</div>
        </div>

        <!-- Thanh Chuyển Tab -->
        <div class="prep-tabs">
          <button class="prep-tab-btn ${this.activeTab === 'market' ? 'active' : ''}" id="tabMarket">
            <span>🛒</span> Chợ
          </button>
          <button class="prep-tab-btn ${this.activeTab === 'upgrades' ? 'active' : ''}" id="tabUpgrades">
            <span>🔨</span> Nâng Cấp
          </button>
          <button class="prep-tab-btn ${this.activeTab === 'staff' ? 'active' : ''}" id="tabStaff">
            <span>👥</span> Nhân Viên
          </button>
        </div>

        <!-- Nội Dung Scroll -->
        <div class="prep-scroll-body" id="prepBody">
          ${this.renderActiveTab()}
        </div>

        <!-- Nút Mở Cửa Ca Bán -->
        <button class="btn-open-shop" id="btnOpenShop">
          <span>🥢</span> MỞ CỬA BÁN HÀNG NGAY!
        </button>

      </div>
    `;

    this.bindEvents();
  }

  renderActiveTab() {
    if (this.activeTab === 'upgrades') return this.renderUpgradesList();
    if (this.activeTab === 'staff') return this.renderStaffList();
    return this.renderMarketList();
  }

  renderMarketList() {
    return gameState.unlockedItems.map(itemId => {
      const item = ITEMS[itemId];
      if (!item) return '';
      const stock = gameState.inventory[itemId] || 0;
      const canAfford1 = gameState.money >= item.cost;
      const canAfford5 = gameState.money >= item.cost * 5;

      return `
        <div class="market-item-card" data-item="${item.id}">
          <div class="market-item-icon">
            ${renderIcon(item.icon)}
          </div>
          <div class="market-item-info">
            <span class="market-item-title">${item.name}</span>
            <div class="market-item-meta">
              <span>Giá: <b class="market-item-price">${item.cost.toLocaleString('vi-VN')}₫</b></span>
              <span>Kho: <b class="market-item-stock">${stock}</b></span>
            </div>
          </div>
          <div class="market-item-actions">
            <button class="btn-buy" data-action="buy" data-id="${item.id}" data-qty="1" ${!canAfford1 ? 'disabled' : ''}>
              +1
            </button>
            <button class="btn-buy" data-action="buy" data-id="${item.id}" data-qty="5" ${!canAfford5 ? 'disabled' : ''}>
              +5
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderUpgradesList() {
    return Object.values(UPGRADES).map(upg => {
      const currentLevel = gameState.upgrades[upg.id] || 1;
      const nextLevel = currentLevel + 1;
      const nextInfo = upg.levels.find(l => l.level === nextLevel);
      const isMaxed = !nextInfo;
      const canAfford = nextInfo ? gameState.money >= nextInfo.cost : false;

      return `
        <div class="upgrade-item-card">
          <div class="upgrade-icon">${upg.icon}</div>
          <div class="upgrade-details">
            <div class="upgrade-name">${upg.name} (Cấp ${currentLevel})</div>
            <div class="upgrade-desc">${isMaxed ? 'Đã đạt cấp tối đa!' : nextInfo.desc}</div>
          </div>
          <div>
            ${isMaxed ? `
              <button class="upgrade-btn maxed" disabled>Tối Đa</button>
            ` : `
              <button class="upgrade-btn" data-action="upgrade" data-id="${upg.id}" ${!canAfford ? 'disabled' : ''}>
                ${nextInfo.cost.toLocaleString('vi-VN')}₫
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  renderStaffList() {
    return Object.values(STAFF).map(role => {
      const count = gameState.getStaffCount(role.id);
      const isFull = count >= STAFF_MAX_PER_ROLE;
      const canAfford = gameState.money >= role.hireCost;

      return `
        <div class="upgrade-item-card staff-card">
          <div class="upgrade-icon">${role.icon}</div>
          <div class="upgrade-details">
            <div class="upgrade-name">${role.name} (${count}/${STAFF_MAX_PER_ROLE})</div>
            <div class="upgrade-desc">${role.desc}</div>
            <div class="staff-meta">
              <span>Tuyển: <b>${role.hireCost.toLocaleString('vi-VN')}₫</b></span>
              <span>Lương: <b>${role.wage.toLocaleString('vi-VN')}₫/ngày</b></span>
            </div>
          </div>
          <div class="staff-actions">
            ${isFull ? `
              <button class="upgrade-btn maxed" disabled>Đủ người</button>
            ` : `
              <button class="upgrade-btn" data-action="hire" data-id="${role.id}" ${!canAfford ? 'disabled' : ''}>
                Thuê
              </button>
            `}
            ${count > 0 ? `
              <button class="staff-fire-btn" data-action="fire" data-id="${role.id}">Cho nghỉ</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('') + `
      <div class="staff-footnote">
        💡 Lương được trả vào cuối mỗi ca bán. Không đủ tiền trả lương thì nhân viên sẽ nghỉ việc.
      </div>
    `;
  }

  bindEvents() {
    const tabMarket = document.getElementById('tabMarket');
    const tabUpgrades = document.getElementById('tabUpgrades');
    const tabStaff = document.getElementById('tabStaff');
    const btnOpenShop = document.getElementById('btnOpenShop');

    if (tabMarket) {
      tabMarket.addEventListener('click', () => {
        sound.playPop();
        this.activeTab = 'market';
        this.render();
      });
    }

    if (tabUpgrades) {
      tabUpgrades.addEventListener('click', () => {
        sound.playPop();
        this.activeTab = 'upgrades';
        this.render();
      });
    }

    if (tabStaff) {
      tabStaff.addEventListener('click', () => {
        sound.playPop();
        this.activeTab = 'staff';
        this.render();
      });
    }

    if (btnOpenShop) {
      btnOpenShop.addEventListener('click', () => {
        // Kiểm tra nguyên liệu cơ bản
        if ((gameState.inventory.bun_la || 0) <= 0 || (gameState.inventory.dau_hu || 0) <= 0) {
          events.emit('ui:toast', '⚠️ Bạn cần ít nhất 1 Bún lá và 1 Đậu hũ để mở cửa bán hàng!');
          sound.playChop();
          return;
        }

        sound.playBell();
        if (this.onStartRush) this.onStartRush();
      });
    }

    // Xử lý mua hàng & nâng cấp
    const prepBody = document.getElementById('prepBody');
    if (prepBody) {
      prepBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn || btn.disabled) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'buy') {
          const qty = parseInt(btn.dataset.qty, 10) || 1;
          const res = gameState.buyItem(id, qty);
          if (res.success) {
            sound.playCoin();
            events.emit('ui:toast', res.msg);
            this.render();
          } else {
            events.emit('ui:toast', res.msg);
          }
        } else if (action === 'upgrade') {
          const res = gameState.upgradeItem(id);
          if (res.success) {
            sound.playBell();
            events.emit('ui:toast', res.msg);
            this.render();
          } else {
            events.emit('ui:toast', res.msg);
          }
        } else if (action === 'hire') {
          const res = gameState.hireStaff(id);
          if (res.success) {
            sound.playBell();
            this.render();
          } else {
            sound.playChop();
          }
          events.emit('ui:toast', res.msg);
        } else if (action === 'fire') {
          const res = gameState.fireStaff(id);
          if (res.success) {
            sound.playPop();
            this.render();
          }
          events.emit('ui:toast', res.msg);
        }
      });
    }
  }
}
