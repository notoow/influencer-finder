/**
 * Notoow Influencer Finder - UI Rendering Module (SSOT & Hardened)
 * 
 * Generates Feed, Profile, Table view cards & Skeleton loading overlay.
 * Hardened with HTML escaping for XSS prevention and noopener/noreferrer for link safety.
 */

import { store } from '../store.js';

// XSS Prevention: Sanitizes user strings before rendering inside innerHTML
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function refreshLucideIcons() {
  setTimeout(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }, 10);
}

export function updateBookmarkCountsUI() {
  const count = store.bookmarkedIds.size;
  const countNav = document.getElementById('bookmarkCountNav');
  const countFilter = document.getElementById('bookmarkFilterCount');

  if (countNav) countNav.textContent = count;
  if (countFilter) countFilter.textContent = count;
}

export function renderLoadingSkeleton() {
  const container = document.getElementById('resultsContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div class="loading-spinner" style="width: 44px; height: 44px; border: 3px solid #E2E8F0; border-top-color: var(--brand-primary); border-radius: 50%; animation: spinLoader 0.8s linear infinite;"></div>
        <p style="font-size: 14px; font-weight: 600; color: var(--text-secondary); margin: 0;">
          Notoow AI 가 Supabase 데이터베이스에서 타겟 인플루언서를 정밀 추출하는 중입니다...
        </p>
      </div>
      <style>
        @keyframes spinLoader { to { transform: rotate(360deg); } }
      </style>
    </div>
  `;
}

export function renderResults() {
  const list = store.getFilteredData();
  const container = document.getElementById('resultsContainer');
  const totalCountEl = document.getElementById('resultTotalCount');

  if (totalCountEl) {
    totalCountEl.textContent = new Intl.NumberFormat('ko-KR').format(list.length);
  }

  updateBookmarkCountsUI();

  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <i data-lucide="search-x" style="width: 40px; height: 40px; margin-bottom: 12px; stroke-width: 1.5;"></i>
        <h3 style="color: var(--text-primary); margin: 0 0 8px;">조건에 일치하는 인플루언서가 없습니다.</h3>
        <p style="font-size: 13px; margin: 0;">팔로워 범위 또는 국가/키워드 조건을 조정해 보세요.</p>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  const mode = store.currentViewMode;

  if (mode === 'feed') {
    container.className = 'influencer-grid feed-mode';
    container.innerHTML = list.map(item => {
      const isBookmarked = store.isBookmarked(item.id);
      const safeName = escapeHTML(item.name);
      const safeHandle = escapeHTML(item.handle);
      const safeBio = escapeHTML(item.bio);
      const safeCover = escapeHTML(item.cover);
      const safeAvatar = escapeHTML(item.avatar);
      const safeUrl = escapeHTML(item.profileUrl);

      return `
        <article class="whotag-card" data-id="${escapeHTML(item.id)}">
          <div class="card-media-wrapper">
            <img class="card-media-img" src="${safeCover}" alt="${safeName}" />
            <div class="media-top-badge">
              <span>${item.country === 'KR' ? '🇰🇷 Korea' : '🇺🇸 US'}</span>
              ${item.is_live ? '<span style="background: var(--brand-gradient); color: #FFF; margin-left: 4px; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 10px;">LIVE REELS</span>' : ''}
            </div>
            <button class="media-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    data-bookmark-id="${escapeHTML(item.id)}" title="북마크 토글">
              <i data-lucide="bookmark" style="width: 14px; height: 14px; fill: ${isBookmarked ? 'currentColor' : 'none'};"></i>
            </button>
            <div class="media-bottom-stats">
              <span><i data-lucide="user" style="width: 12px; height: 12px;"></i> ${(item.followers / 1000).toFixed(1)}K</span>
              <span>•</span>
              <span><i data-lucide="message-square" style="width: 12px; height: 12px;"></i> ${Number(item.engagement)}%</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-user-row">
              <img class="card-avatar" src="${safeAvatar}" alt="${safeName}" />
              <a href="${safeUrl}" class="card-handle" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">@${safeHandle}</a>
            </div>
            <p class="card-bio-text">${safeBio}</p>
            <div class="card-metrics-row">
              <span class="metric-pill">Score: <strong>${Number(item.score)}</strong></span>
              <span class="metric-pill" style="color: var(--brand-dark);">상세보기 <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i></span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  } else if (mode === 'profile') {
    container.className = 'influencer-grid profile-mode';
    container.innerHTML = list.map(item => {
      const isBookmarked = store.isBookmarked(item.id);
      const safeName = escapeHTML(item.name);
      const safeHandle = escapeHTML(item.handle);
      const safeBio = escapeHTML(item.bio);
      const safeAvatar = escapeHTML(item.avatar);
      const tags = Array.isArray(item.tags) ? item.tags : [];

      return `
        <article class="profile-card-full" data-id="${escapeHTML(item.id)}">
          <div class="profile-header-row">
            <img class="profile-avatar-lg" src="${safeAvatar}" alt="${safeName}" />
            <div class="profile-title-area">
              <h4>${safeName}</h4>
              <p>@${safeHandle}</p>
            </div>
            <button class="media-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    style="position: static; margin-left: auto;"
                    data-bookmark-id="${escapeHTML(item.id)}">
              <i data-lucide="bookmark" style="width: 14px; height: 14px; fill: ${isBookmarked ? 'currentColor' : 'none'};"></i>
            </button>
          </div>
          <p class="card-bio-text" style="height: auto; -webkit-line-clamp: 3;">${safeBio}</p>
          <div class="tags-wrap">
            ${tags.map(t => `<span class="mini-tag">#${escapeHTML(t)}</span>`).join('')}
          </div>
          <div class="metrics-grid-3">
            <div class="metric-item-col">
              <span>팔로워</span>
              <strong>${(item.followers / 1000).toFixed(1)}K</strong>
            </div>
            <div class="metric-item-col">
              <span>참여율</span>
              <strong>${Number(item.engagement)}%</strong>
            </div>
            <div class="metric-item-col">
              <span>Notoow 스코어</span>
              <strong style="color: var(--brand-dark);">${Number(item.score)}</strong>
            </div>
          </div>
        </article>
      `;
    }).join('');
  } else if (mode === 'list') {
    container.className = 'influencer-grid list-mode';
    container.innerHTML = `
      <div class="list-table-container">
        <table class="whotag-table">
          <thead>
            <tr>
              <th>북마크</th>
              <th>프로필 / 계정</th>
              <th>국가</th>
              <th>팔로워</th>
              <th>참여율</th>
              <th>태그</th>
              <th>AI 스코어</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(item => {
              const isBookmarked = store.isBookmarked(item.id);
              const safeName = escapeHTML(item.name);
              const safeHandle = escapeHTML(item.handle);
              const safeAvatar = escapeHTML(item.avatar);
              const tags = Array.isArray(item.tags) ? item.tags : [];

              return `
                <tr data-id="${escapeHTML(item.id)}" style="cursor: pointer;">
                  <td onclick="event.stopPropagation()">
                    <button class="media-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                            style="position: static; width: 28px; height: 28px;"
                            data-bookmark-id="${escapeHTML(item.id)}">
                      <i data-lucide="bookmark" style="width: 13px; height: 13px; fill: ${isBookmarked ? 'currentColor' : 'none'};"></i>
                    </button>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="${safeAvatar}" style="width: 32px; height: 32px; border-radius: 50%;" />
                      <div>
                        <strong>${safeName}</strong><br />
                        <small style="color: var(--brand-dark);">@${safeHandle}</small>
                      </div>
                    </div>
                  </td>
                  <td>${item.country === 'KR' ? '🇰🇷 Korea' : '🇺🇸 US'}</td>
                  <td><strong>${new Intl.NumberFormat('ko-KR').format(item.followers)}</strong>명</td>
                  <td>${Number(item.engagement)}%</td>
                  <td>${tags.map(t => `#${escapeHTML(t)}`).join(' ')}</td>
                  <td><strong style="color: var(--brand-dark);">${Number(item.score)}</strong></td>
                  <td><button class="action-btn-outline" style="font-size: 11px; padding: 4px 10px;">열기 <i data-lucide="arrow-right" style="width: 11px; height: 11px;"></i></button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  refreshLucideIcons();
}
