/* ==========================================================================
   📖 TUTORIAL GUIDE & ONBOARDING - HƯỚNG DẪN CHƠI DỄ HIỂU 100%
   ========================================================================== */

import { renderIcon } from '../renderers/SVGIcons.js';
import { sound } from '../audio/SoundManager.js';

export class TutorialGuide {
  constructor() {
    this.modalEl = document.getElementById('modalTutorial');
    this.btnOpenEl = document.getElementById('btnOpenTutorial');
    this.btnCloseEl = document.getElementById('btnCloseTutorial');
    this.currentStep = 1;

    this.init();
  }

  init() {
    if (this.btnOpenEl) {
      this.btnOpenEl.addEventListener('click', () => {
        sound.playPop();
        this.open();
      });
    }

    if (this.btnCloseEl) {
      this.btnCloseEl.addEventListener('click', () => {
        this.close();
      });
    }

    // Đóng khi click ra ngoài backdrop
    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.close();
        }
      });
    }

    // Kiểm tra xem người chơi mới đã từng xem hướng dẫn chưa
    const hasSeen = localStorage.getItem('quan_bun_dau_tutorial_seen');
    if (!hasSeen) {
      setTimeout(() => {
        this.open();
        localStorage.setItem('quan_bun_dau_tutorial_seen', 'true');
      }, 600);
    }
  }

  open() {
    if (!this.modalEl) return;
    this.currentStep = 1;
    this.renderStep();
    this.modalEl.hidden = false;
  }

  close() {
    if (!this.modalEl) return;
    this.modalEl.hidden = true;
    sound.playPop();
  }

  renderStep() {
    const contentBox = document.getElementById('tutorialContentBody');
    if (!contentBox) return;

    if (this.currentStep === 1) {
      contentBox.innerHTML = `
        <div class="tutorial-card-body">
          <div class="tutorial-step-tag">BƯỚC 1 / 3 · BUỔI SÁNG CHUẨN BỊ</div>
          <h3 class="tutorial-title">🛒 Nhập Kho & Nâng Cấp Quán</h3>
          
          <div class="tutorial-visual-row">
            <div class="tutorial-food-box">
              <span class="t-icon">${renderIcon('bun')}</span>
              <b>Bún lá</b>
            </div>
            <div class="tutorial-plus">+</div>
            <div class="tutorial-food-box">
              <span class="t-icon">${renderIcon('dau')}</span>
              <b>Đậu chiên</b>
            </div>
            <div class="tutorial-arrow">➜</div>
            <div class="tutorial-food-box glow">
              <span class="t-icon" style="font-size:26px;">🥢</span>
              <b>Mở cửa bán</b>
            </div>
          </div>

          <p class="tutorial-desc">
            • Mỗi sáng thức dậy, hãy vào <b>Chợ Đầu Mối</b> bấm <b>+1</b> hoặc <b>+5</b> để nhập nguyên liệu tươi.<br>
            • Quán cần ít nhất <b>Bún lá</b> và <b>Đậu hũ</b> trong kho để có thể mở ca bán.<br>
            • Đừng quên vào tab <b>Nâng Cấp</b> để mua thêm bàn ghế đón nhiều khách hơn và quạt mát giúp khách kiên nhẫn chờ lâu hơn!<br>
            • Vào tab <b>Nhân Viên</b> để thuê <b>phục vụ, đầu bếp, bảo vệ, bếp phó trọn gói</b> (bếp phó sẽ tự động làm đầy đủ cho các khách sau, tránh quá tải khi khách đi theo nhóm đông!).<br>
            • Quán mở cửa từ <b>11:00 đến 22:00</b>: 1 giờ trong game = 1 phút ngoài đời. Khách có thể đi theo nhóm tối đa <b>4 người cùng lúc</b>!
          </p>

          <div class="tutorial-nav-row">
            <div></div>
            <button class="btn-tutorial-next" id="btnTutoNext">Tiếp Theo (Bước 2) ➜</button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 2) {
      contentBox.innerHTML = `
        <div class="tutorial-card-body">
          <div class="tutorial-step-tag">BƯỚC 2 / 3 · TRONG CA BÁN HÀNG</div>
          <h3 class="tutorial-title">⚡ Xếp Mẹt & Pha Chế Chuẩn Vị</h3>

          <div class="tutorial-steps-grid">
            <div class="step-mini-item">
              <span class="step-num">1</span>
              <div><b>Xem Order:</b> Nhìn bong bóng trên đầu khách ở bàn ăn.</div>
            </div>
            <div class="step-mini-item">
              <span class="step-num">2</span>
              <div><b>Gắp Lên Mẹt:</b> Bấm các món đậu, bún, chả tương ứng khay dưới. Mẹt <b>Lớn</b> cần gắp <b>2 phần</b> Bún lá & Đậu, mẹt <b>Nhỏ</b> chỉ 1 phần.</div>
            </div>
            <div class="step-mini-item">
              <span class="step-num">3</span>
              <div><b>Nước Chấm:</b> Chọn Mắm tôm / Nước mắm, bấm <i>Đánh Bọt</i> nếu khách yêu cầu.</div>
            </div>
            <div class="step-mini-item">
              <span class="step-num">4</span>
              <div><b>Bưng Món:</b> Bấm nút xanh <i>BƯNG RA BÀN</i> để nhận tiền!</div>
            </div>
          </div>

          <div class="tutorial-tip-box">
            💡 <b>Mẹo Nhìn Nhanh:</b> Món ăn khách đang muốn gọi sẽ <b>phát sáng viền vàng lung linh</b> trên khay để bạn gắp nhanh chuẩn xác không lo nhầm!
          </div>

          <div class="tutorial-nav-row">
            <button class="btn-tutorial-prev" id="btnTutoPrev">⬅ Quay lại</button>
            <button class="btn-tutorial-next" id="btnTutoNext">Tiếp Theo (Bước 3) ➜</button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 3) {
      contentBox.innerHTML = `
        <div class="tutorial-card-body">
          <div class="tutorial-step-tag">BƯỚC 3 / 3 · BÍ QUYẾT LÀM GIÀU</div>
          <h3 class="tutorial-title">🐕 Chó Vện Giữ Xe & Bão Sao Review</h3>

          <div class="tutorial-visual-row">
            <div class="tutorial-food-box" style="width: 70px;">
              <span class="t-icon" style="width:38px;height:38px;">${renderIcon('dog_ven')}</span>
              <b>Chó Vện</b>
            </div>
            <div class="tutorial-arrow">➜</div>
            <div class="tutorial-food-box" style="flex:1;">
              <b style="color:#27ae60;font-size:14px;">+20s Kiên Nhẫn</b>
              <small style="color:#7d685b;">Bấm vào Chó Vện góc phải để sủa xua tan hàng đợi!</small>
            </div>
          </div>

          <p class="tutorial-desc">
            • <b>Tiền Tip hào phóng:</b> Phục vụ khi thanh kiên nhẫn của khách còn trên 50% sẽ được tip thêm từ 15% đến 50% tiền món!<br>
            • <b>Khách VIP TikToker:</b> Phục vụ chuẩn món sẽ mang lại bão review 5 sao trên <i>Bún Đậu Feed</i> và kéo khách đông gấp bội ngày hôm sau!<br>
            • <b>Đừng để khách giận:</b> Nếu khách đợi quá lâu bỏ về, quán sẽ bị trừ sao uy tín và dính review 1 sao.
          </p>

          <div class="tutorial-nav-row">
            <button class="btn-tutorial-prev" id="btnTutoPrev">⬅ Quay lại</button>
            <button class="btn-tutorial-start" id="btnTutoFinish">ĐÃ HIỂU! VÀO NẤU NGAY 🥢</button>
          </div>
        </div>
      `;
    }

    this.bindStepButtons();
  }

  bindStepButtons() {
    const btnNext = document.getElementById('btnTutoNext');
    const btnPrev = document.getElementById('btnTutoPrev');
    const btnFinish = document.getElementById('btnTutoFinish');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        sound.playPop();
        this.currentStep++;
        this.renderStep();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        sound.playPop();
        this.currentStep--;
        this.renderStep();
      });
    }

    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        sound.playBell();
        this.close();
      });
    }
  }
}
