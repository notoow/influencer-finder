/**
 * Notoow Influencer Finder - Modal Controller Module (SSOT)
 * 
 * Manages opening, populating, and closing influencer detail analysis dialogs.
 */

import { store } from '../store.js';
import { refreshLucideIcons } from './render.js';

export function openModal(id) {
  const item = store.currentData.find(x => x.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const tags = Array.isArray(item.tags) ? item.tags : [];
  const feed = Array.isArray(item.feed) ? item.feed : [];

  body.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
      <img src="${item.avatar}" style="width: 72px; height: 72px; border-radius: 50%; border: 2px solid var(--brand-primary);" />
      <div>
        <h2 style="margin: 0 0 4px; font-size: 22px; color: var(--text-primary);">${item.name}</h2>
        <p style="margin: 0; color: var(--brand-dark); font-size: 14px;">@${item.handle} • ${item.countryName || item.country}</p>
        <div style="margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap;">
          ${tags.map(t => `<span class="mini-tag">#${t}</span>`).join('')}
        </div>
      </div>
      <div style="margin-left: auto;">
        <button class="action-btn-brand" onclick="window.open('${item.profileUrl}', '_blank')">
          인스타그램 열기 <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
        </button>
      </div>
    </div>

    <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: var(--radius-md); margin-bottom: 20px;">
      "${item.bio}"
    </p>

    <div class="metrics-grid-3" style="margin-bottom: 20px; padding: 14px;">
      <div class="metric-item-col">
        <span>총 팔로워</span>
        <strong style="font-size: 16px;">${new Intl.NumberFormat('ko-KR').format(item.followers)}명</strong>
      </div>
      <div class="metric-item-col">
        <span>평균 참여율</span>
        <strong style="font-size: 16px;">${item.engagement}%</strong>
      </div>
      <div class="metric-item-col">
        <span>Notoow 스코어</span>
        <strong style="font-size: 16px; color: var(--brand-dark);">${item.score} / 100</strong>
      </div>
    </div>

    <h4 style="color: var(--brand-dark); margin: 0 0 12px; display: flex; align-items: center; gap: 6px;">
      <i data-lucide="image" style="width: 16px; height: 16px;"></i> 최근 피드 포스트 피드백
    </h4>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
      ${feed.map(post => `
        <div style="background: #FFFFFF; border-radius: var(--radius-md); overflow: hidden; border: 1px solid #E2E8F0;">
          <img src="${post.image}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover;" />
          <div style="padding: 10px;">
            <p style="font-size: 12px; margin: 0 0 6px; color: var(--text-secondary);">${post.caption}</p>
            <div style="font-size: 11px; color: var(--text-muted); display: flex; gap: 8px;">
              <span><i data-lucide="heart" style="width: 12px; height: 12px;"></i> ${(post.likes || 0).toLocaleString()}</span>
              <span><i data-lucide="message-square" style="width: 12px; height: 12px;"></i> ${(post.comments || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add('active');
  refreshLucideIcons();
}

export function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.remove('active');
}
