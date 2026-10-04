/* ==========================================================================
   🌙 SUMMARY VIEW - BÁO CÁO TÀI CHÍNH & TỔNG KẾT CA BÁN HÀNG
   ========================================================================== */

import { gameState } from '../core/GameState.js';
import { sound } from '../audio/SoundManager.js';

export class SummaryView {
  constructor(container, onNextDay) {
    this.container = container;
    this.onNextDay = onNextDay;
  }

  mount() {
    this.render();
  }

  render() {
    const stats = gameState.todayStats;
    const netProfit = (stats.revenue + stats.tips) - stats.costs - stats.wages - stats.incidentLoss;
    const isProfitable = netProfit >= 0;

    this.container.innerHTML = `
      <div class="summary-container">
        
        <!-- Hóa Đơn Tổng Kết Doanh Thu -->
        <div class="receipt-card">
          <div class="receipt-header">
            <h3>🧾 TỔNG KẾT NGÀY ${gameState.day}</h3>
            <p>${gameState.shopName}</p>
          </div>

          <div class="receipt-rows">
            <div class="receipt-row">
              <span>Doanh thu bán món:</span>
              <b>+${stats.revenue.toLocaleString('vi-VN')}₫</b>
            </div>

            <div class="receipt-row">
              <span>Tiền Tip của khách:</span>
              <b style="color: #f39c12;">+${stats.tips.toLocaleString('vi-VN')}₫</b>
            </div>

            <div class="receipt-row">
              <span>Chi phí nguyên liệu & tuyển dụng:</span>
              <b style="color: #c0392b;">-${stats.costs.toLocaleString('vi-VN')}₫</b>
            </div>

            ${stats.wages > 0 ? `
              <div class="receipt-row">
                <span>Lương nhân viên:</span>
                <b style="color: #c0392b;">-${stats.wages.toLocaleString('vi-VN')}₫</b>
              </div>
            ` : ''}

            ${stats.incidentLoss > 0 ? `
              <div class="receipt-row negative">
                <span>Bị kẻ gian trộm tiền:</span>
                <b>-${stats.incidentLoss.toLocaleString('vi-VN')}₫</b>
              </div>
            ` : ''}

            <div class="receipt-row">
              <span>Khách ghé quán hôm nay:</span>
              <b>${stats.arrivedCount} / ${gameState.getExpectedCustomers()} khách</b>
            </div>

            <div class="receipt-row">
              <span>Khách phục vụ thành công:</span>
              <b>${stats.servedCount} khách</b>
            </div>

            ${stats.failedCount > 0 ? `
              <div class="receipt-row negative">
                <span>Khách giận bỏ về:</span>
                <b>${stats.failedCount} khách</b>
              </div>
            ` : ''}

            ${stats.lostCount > 0 ? `
              <div class="receipt-row negative">
                <span>Khách bỏ đi vì hết chỗ / chờ lâu:</span>
                <b>${stats.lostCount} khách</b>
              </div>
            ` : ''}

            ${stats.incidentsBlocked > 0 ? `
              <div class="receipt-row">
                <span>🛡️ Bảo vệ chặn sự cố:</span>
                <b style="color: #27ae60;">${stats.incidentsBlocked} lần</b>
              </div>
            ` : ''}

            ${stats.staffQuit && stats.staffQuit.length > 0 ? `
              <div class="receipt-row negative">
                <span>Không đủ tiền trả lương, nghỉ việc:</span>
                <b>${stats.staffQuit.join(', ')}</b>
              </div>
            ` : ''}

            <div class="receipt-row bold ${!isProfitable ? 'negative' : ''}">
              <span>LỢI NHUẬN RÒNG:</span>
              <span>${isProfitable ? '+' : ''}${netProfit.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          <div class="receipt-star-section">
            <span style="font-size: 11px; color: #7d685b;">UY TÍN QUÁN HIỆN TẠI</span>
            <div style="color: #f59e0b; font-size: 16px; letter-spacing: 2px;">
              ${'★'.repeat(Math.round(gameState.rating))}${'☆'.repeat(5 - Math.round(gameState.rating))}
            </div>
            <b style="font-size: 13px; color: #4a2818;">${gameState.rating.toFixed(1)} / 5.0 Sao</b>
          </div>
        </div>

        <!-- Nút Chuyển Sang Ngày Tiếp Theo -->
        <button class="btn-next-day" id="btnNextDay">
          <span>☀️</span> BẮT ĐẦU NGÀY MỚI (NGÀY ${gameState.day + 1})
        </button>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const btnNextDay = document.getElementById('btnNextDay');
    if (btnNextDay) {
      btnNextDay.addEventListener('click', () => {
        sound.playBell();
        if (this.onNextDay) this.onNextDay();
      });
    }
  }
}
