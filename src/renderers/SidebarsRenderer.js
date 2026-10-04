/* ==========================================================================
   📱 SIDEBARS RENDERER - BẢNG TIN BÚN ĐẬU FEED & ĐÁNH GIÁ THỰC KHÁCH
   ========================================================================== */

import { gameState } from '../core/GameState.js';
import { DYNAMIC_FEED_TEMPLATES, REVIEW_TEMPLATES_5_STAR, REVIEW_TEMPLATES_1_STAR } from '../data/reviews.js';
import { renderIcon } from './SVGIcons.js';
import { sound } from '../audio/SoundManager.js';

export class SidebarsRenderer {
  constructor() {
    this.feedContainer = document.getElementById('socialFeedList');
    this.reviewsContainer = document.getElementById('reviewsList');
    this.reviewCountBadge = document.getElementById('sidebarReviewCount');
    this.btnRefreshFeed = document.getElementById('btnRefreshFeed');

    if (this.btnRefreshFeed) {
      this.btnRefreshFeed.addEventListener('click', () => {
        sound.playPop();
        this.addRandomFeedPost();
      });
    }
  }

  render() {
    this.renderFeed();
    this.renderReviews();
  }

  renderFeed() {
    if (!this.feedContainer) return;
    this.feedContainer.innerHTML = gameState.feed.map(item => `
      <div class="feed-card" id="${item.id}">
        <div class="feed-author-row">
          <div class="feed-avatar">${item.avatar || '🥢'}</div>
          <div class="feed-meta">
            <span class="feed-name">${item.author}</span>
            <span class="feed-time">${item.time}</span>
          </div>
        </div>
        <p class="feed-body">${item.content}</p>
        ${item.badge ? `<div class="feed-img-badge"><span>✨</span> ${item.badge}</div>` : ''}
        <div class="feed-reactions">
          <div class="feed-reaction-item">❤️ <span>${item.likes || 12}</span></div>
          <div class="feed-reaction-item">💬 <span>${item.comments || 3}</span></div>
          <div class="feed-reaction-item">📤 Chia sẻ</div>
        </div>
      </div>
    `).join('');
  }

  renderReviews() {
    if (!this.reviewsContainer) return;
    if (this.reviewCountBadge) {
      this.reviewCountBadge.textContent = `${gameState.reviews.length} đánh giá`;
    }

    this.reviewsContainer.innerHTML = gameState.reviews.map(item => {
      const isOneStar = item.stars <= 2;
      const isFiveStar = item.stars >= 4;
      const starStr = '★'.repeat(item.stars) + '☆'.repeat(5 - item.stars);

      return `
        <div class="review-card ${isOneStar ? 'one-star' : ''} ${isFiveStar ? 'five-star' : ''}">
          <div class="review-top-row">
            <div class="review-customer">
              <span class="review-avatar-svg" style="width:30px;height:30px;display:grid;place-items:center;flex-shrink:0;">
                ${item.avatarKey ? renderIcon(item.avatarKey) : (item.avatar || '🥢')}
              </span>
              <span class="review-author-name">${item.name}</span>
            </div>
            <div class="review-stars">${starStr}</div>
          </div>
          <p class="review-comment">"${item.comment}"</p>
          <div class="review-bottom-meta">
            <span class="review-tag">${item.tag || 'Khách ăn tại quán'}</span>
            <span>${item.time || 'Hôm nay'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  addRandomFeedPost() {
    const template = DYNAMIC_FEED_TEMPLATES[Math.floor(Math.random() * DYNAMIC_FEED_TEMPLATES.length)];
    const newPost = {
      id: 'feed_' + Date.now(),
      author: template.author,
      avatar: template.avatar,
      time: 'Vừa xong',
      content: template.content,
      badge: template.badge,
      likes: Math.floor(Math.random() * 80) + 15,
      comments: Math.floor(Math.random() * 20) + 2
    };

    gameState.feed.unshift(newPost);
    if (gameState.feed.length > 20) gameState.feed.pop();
    gameState.save();
    this.renderFeed();
  }

  addCustomerReview(customerName, stars, avatarKey = 'chibi_student') {
    let comment = '';
    if (stars >= 4) {
      comment = REVIEW_TEMPLATES_5_STAR[Math.floor(Math.random() * REVIEW_TEMPLATES_5_STAR.length)];
    } else {
      comment = REVIEW_TEMPLATES_1_STAR[Math.floor(Math.random() * REVIEW_TEMPLATES_1_STAR.length)];
    }

    const newRev = {
      id: 'rev_' + Date.now(),
      name: customerName,
      avatarKey: avatarKey,
      stars: stars,
      comment: comment,
      tag: stars >= 4 ? 'Hài lòng nhức nách' : 'Bóc phốt tấu hài',
      time: `Ngày ${gameState.day}`
    };

    gameState.reviews.unshift(newRev);
    if (gameState.reviews.length > 25) gameState.reviews.pop();
    gameState.save();
    this.renderReviews();
  }
}
