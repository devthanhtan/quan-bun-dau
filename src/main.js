/* ==========================================================================
   🎮 MAIN ENGINE - QUÁN BÚN ĐẬU MƠ ƯỚC
   ========================================================================== */

import { gameState } from './core/GameState.js';
import { events } from './core/EventBus.js';
import { sound } from './audio/SoundManager.js';
import { ITEMS, SAUCES } from './data/items.js';
import { renderIcon } from './renderers/SVGIcons.js';
import { SidebarsRenderer } from './renderers/SidebarsRenderer.js';
import { TutorialGuide } from './components/TutorialGuide.js';
import { PrepView } from './views/PrepView.js';
import { RushView } from './views/RushView.js';
import { SummaryView } from './views/SummaryView.js';

class GameApp {
  constructor() {
    this.gameViewEl = document.getElementById('gameView');
    this.currentViewInstance = null;
    this.sidebars = new SidebarsRenderer();
    this.tutorial = null;
  }

  start() {
    gameState.init();
    this.sidebars.render();
    this.tutorial = new TutorialGuide();
    this.updateHUD();
    this.bindGlobalEvents();
    this.bindModals();
    this.routeView();

    // Khởi tạo audio khi người dùng chạm màn hình lần đầu
    const initAudioOnFirstGesture = () => {
      sound.init();
      sound.startBGM();
      window.removeEventListener('click', initAudioOnFirstGesture);
      window.removeEventListener('touchstart', initAudioOnFirstGesture);
    };
    window.addEventListener('click', initAudioOnFirstGesture, { once: true });
    window.addEventListener('touchstart', initAudioOnFirstGesture, { once: true });
  }

  updateHUD() {
    const hudDay = document.getElementById('hudDay');
    const hudPhase = document.getElementById('hudPhase');
    const hudShopName = document.getElementById('hudShopName');
    const hudMoney = document.getElementById('hudMoney');
    const hudRatingVal = document.getElementById('hudRatingVal');
    const hudStarIcons = document.getElementById('hudStarIcons');
    const dogBadge = document.getElementById('dogBuffStatus');

    if (hudDay) hudDay.textContent = gameState.day;
    if (hudPhase) {
      if (gameState.phase === 'prep') hudPhase.textContent = 'Chuẩn bị';
      else if (gameState.phase === 'rush') hudPhase.textContent = 'Đang bán';
      else hudPhase.textContent = 'Kết ca';
    }

    if (hudShopName) hudShopName.textContent = gameState.shopName;
    if (hudMoney) hudMoney.textContent = gameState.money.toLocaleString('vi-VN');
    if (hudRatingVal) hudRatingVal.textContent = gameState.rating.toFixed(1);
    if (hudStarIcons) {
      hudStarIcons.textContent = '★'.repeat(Math.round(gameState.rating)) + '☆'.repeat(5 - Math.round(gameState.rating));
    }

    if (dogBadge) {
      dogBadge.textContent = gameState.dogBuffReady ? 'Sẵn sàng' : 'Nghỉ ngơi';
      dogBadge.style.opacity = gameState.dogBuffReady ? '1' : '0.6';
    }
  }

  routeView() {
    if (this.currentViewInstance && typeof this.currentViewInstance.unmount === 'function') {
      this.currentViewInstance.unmount();
    }

    this.updateHUD();

    if (gameState.phase === 'prep') {
      this.currentViewInstance = new PrepView(this.gameViewEl, () => {
        gameState.startRush();
      });
      this.updateFooter('☀️ Buổi sáng chuẩn bị: Hãy nhập đủ nguyên liệu và nâng cấp trang thiết bị rồi mở cửa nhé!');
    } else if (gameState.phase === 'rush') {
      this.currentViewInstance = new RushView(this.gameViewEl, () => {
        gameState.finishRush();
      });
      this.updateFooter('🔥 Đang trong ca bán: Chú ý thời gian kiên nhẫn của khách và xếp đúng mẹt bún đậu!');
    } else if (gameState.phase === 'summary') {
      this.currentViewInstance = new SummaryView(this.gameViewEl, () => {
        gameState.advanceToNextDay();
      });
      this.updateFooter('🌙 Kết thúc ca bán: Kiểm tra bảng lợi nhuận và chuẩn bị cho ngày tiếp theo.');
    }

    if (this.currentViewInstance) {
      this.currentViewInstance.mount();
    }
  }

  updateFooter(text) {
    const el = document.getElementById('footerStatusText');
    if (el) el.textContent = text;
  }

  showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2800);
  }

  bindGlobalEvents() {
    events.on('state:updated', () => {
      this.updateHUD();
      this.sidebars.render();
    });

    events.on('phase:changed', () => {
      this.routeView();
    });

    events.on('ui:toast', (msg) => {
      this.showToast(msg);
    });

    events.on('customer:served', ({ customer, stars, avatarKey }) => {
      this.sidebars.addCustomerReview(customer.name, stars, avatarKey || customer.avatarKey);
      if (Math.random() < 0.4) {
        this.sidebars.addRandomFeedPost();
      }
    });

    events.on('day:advanced', ({ day, newlyUnlocked, totalSpoilage }) => {
      if (newlyUnlocked && newlyUnlocked.length > 0) {
        this.showToast(`🎉 Mở khóa món mới cho ngày ${day}: ${newlyUnlocked.join(', ')}!`);
      }
      if (totalSpoilage > 0) {
        this.showToast(`⚠️ Hao hụt nguyên liệu cũ qua đêm: -${totalSpoilage.toLocaleString('vi-VN')}₫`);
      }
    });

    // Nút Âm thanh
    const btnSoundToggle = document.getElementById('btnSoundToggle');
    const soundIcon = document.getElementById('soundIcon');
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        const isSoundOn = sound.toggleSound();
        if (soundIcon) soundIcon.textContent = isSoundOn ? '🔊' : '🔇';
        this.showToast(isSoundOn ? 'Đã bật hiệu ứng âm thanh ASMR' : 'Đã tắt âm thanh');
      });
    }

    // Nút Chú Chó Vện
    const btnPetDog = document.getElementById('btnPetDog');
    if (btnPetDog) {
      btnPetDog.addEventListener('click', () => {
        if (!gameState.dogBuffReady) {
          this.showToast('🐾 Chú chó Vện đang nghỉ ngơi, vui lòng đợi lát nhé!');
          return;
        }
        gameState.triggerDogBuff();
      });
    }
  }

  bindModals() {
    // 1. Cài Đặt (Settings Modal)
    const modalSettings = document.getElementById('modalSettings');
    const btnSettings = document.getElementById('btnSettings');
    const btnCloseSettings = document.getElementById('btnCloseSettings');
    const inputShopName = document.getElementById('inputShopName');
    const btnSaveShopName = document.getElementById('btnSaveShopName');
    const btnToggleSoundFX = document.getElementById('btnToggleSoundFX');
    const btnToggleBGM = document.getElementById('btnToggleBGM');
    const btnExportSave = document.getElementById('btnExportSave');
    const btnImportSave = document.getElementById('btnImportSave');
    const saveCodeArea = document.getElementById('saveCodeArea');
    const btnResetGame = document.getElementById('btnResetGame');

    if (btnSettings && modalSettings) {
      btnSettings.addEventListener('click', () => {
        sound.playPop();
        modalSettings.hidden = false;
        if (inputShopName) inputShopName.value = gameState.shopName;
      });
    }

    if (btnCloseSettings && modalSettings) {
      btnCloseSettings.addEventListener('click', () => {
        modalSettings.hidden = true;
      });
    }

    if (btnSaveShopName && inputShopName) {
      btnSaveShopName.addEventListener('click', () => {
        const val = inputShopName.value.trim();
        if (val) {
          gameState.setShopName(val);
          sound.playCoin();
          this.showToast(`Đã đổi tên quán thành: ${val}`);
          modalSettings.hidden = true;
        }
      });
    }

    if (btnToggleSoundFX) {
      btnToggleSoundFX.addEventListener('click', () => {
        const on = sound.toggleSound();
        btnToggleSoundFX.classList.toggle('active', on);
        btnToggleSoundFX.textContent = on ? '🔊 Hiệu ứng ASMR: Bật' : '🔇 Hiệu ứng ASMR: Tắt';
      });
    }

    if (btnToggleBGM) {
      btnToggleBGM.addEventListener('click', () => {
        const on = sound.toggleBGM();
        btnToggleBGM.classList.toggle('active', on);
        btnToggleBGM.textContent = on ? '🎵 Nhạc Lofi: Bật' : '🎵 Nhạc Lofi: Tắt';
      });
    }

    if (btnExportSave && saveCodeArea) {
      btnExportSave.addEventListener('click', () => {
        const code = gameState.exportSaveCode();
        saveCodeArea.value = code;
        saveCodeArea.removeAttribute('readonly');
        saveCodeArea.select();
        try {
          navigator.clipboard.writeText(code);
          this.showToast('📋 Đã sao chép mã save vào bộ nhớ tạm!');
        } catch (e) {}
      });
    }

    if (btnImportSave && saveCodeArea) {
      btnImportSave.addEventListener('click', () => {
        const code = prompt('Dán mã sao lưu tiến trình của bạn vào đây:');
        if (code) {
          const ok = gameState.importSaveCode(code);
          if (ok) {
            sound.playBell();
            this.showToast('✅ Khôi phục tiến trình thành công!');
            modalSettings.hidden = true;
            this.routeView();
          } else {
            this.showToast('❌ Mã sao lưu không hợp lệ!');
          }
        }
      });
    }

    if (btnResetGame) {
      btnResetGame.addEventListener('click', () => {
        if (confirm('⚠️ Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và chơi lại từ Ngày 1 không?')) {
          gameState.resetGame();
          sound.playChop();
          this.showToast('Đã xóa dữ liệu. Bắt đầu lại quán bún đậu mới!');
          modalSettings.hidden = true;
          this.routeView();
        }
      });
    }

    // 2. Sổ Tay Công Thức (Recipe Modal)
    const modalRecipe = document.getElementById('modalRecipe');
    const btnRecipeBook = document.getElementById('btnRecipeBook');
    const btnCloseRecipe = document.getElementById('btnCloseRecipe');
    const recipeContent = document.getElementById('recipeBookContent');

    if (btnRecipeBook && modalRecipe) {
      btnRecipeBook.addEventListener('click', () => {
        sound.playPop();
        modalRecipe.hidden = false;
        if (recipeContent) {
          recipeContent.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <h4 style="color:#c0392b; margin-bottom:4px;">🥣 Bí quyết Pha Nước Chấm:</h4>
                <p style="font-size:12px; color:#5c3e2e; line-height:1.4;">
                  • <b>Mắm tôm:</b> Cho mắm tôm Thanh Hóa, thêm đường, vắt quất, lát ớt cay rồi bấm <i>Đánh Bọt</i> để sủi bọt trắng bông mịn chuẩn chỉ.<br>
                  • <b>Nước mắm:</b> Dành cho khách không ăn được mắm tôm, pha tỏi ớt chua ngọt thanh mát.
                </p>
              </div>

              <div>
                <h4 style="color:#27ae60; margin-bottom:4px;">🥢 Các Món Bún Đậu Đã Mở Khóa:</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                  ${gameState.unlockedItems.map(id => {
                    const item = ITEMS[id];
                    return `
                      <div style="background:#f7eee4; padding:6px 8px; border-radius:6px; border:1px solid #e1cfbe; display:flex; align-items:center; gap:6px;">
                        <span style="width:24px; height:24px;">${renderIcon(item.icon)}</span>
                        <div>
                          <b style="font-size:11.5px; color:#3b2014; display:block;">${item.name}</b>
                          <span style="font-size:10px; color:#7d685b;">Bán: ${item.sell.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `;
        }
      });
    }

    if (btnCloseRecipe && modalRecipe) {
      btnCloseRecipe.addEventListener('click', () => {
        modalRecipe.hidden = true;
      });
    }
  }
}

// Khởi chạy game khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  const app = new GameApp();
  app.start();
});
