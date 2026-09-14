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

  // Show "run a search first" state before any search has been executed
  if (!store.hasSearched && list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: var(--text-muted);">
        <div style="max-width: 480px; margin: 0 auto;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--brand-gradient); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; opacity: 0.85;">
            <i data-lucide="search" style="width: 28px; height: 28px; color: #fff;"></i>
          </div>
          <h3 style="color: var(--text-primary); margin: 0 0 10px; font-size: 20px; font-weight: 800;">AI 프롬프트로 인플루언서를 발굴해 보세요</h3>
          <p style="font-size: 14px; margin: 0 0 24px; line-height: 1.7;">상단의 <strong>AI 인플루언서 발굴</strong> 탭에서 자연어 프롬프트를 입력하면<br/>실제 Instagram 크롤링 결과가 이 데이터 보드에 표시됩니다.</p>
          <button onclick="switchMainTab('search'); setTimeout(focusPrompt, 200);" 
                  style="background: var(--brand-gradient); color: #fff; border: none; padding: 12px 28px; border-radius: 24px; font-size: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
            <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i> 지금 검색 시작하기
          </button>
        </div>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

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
      // Always link to real Instagram profile
      const instagramUrl = `https://www.instagram.com/${encodeURIComponent(item.handle)}/`;
      const safeUrl = escapeHTML(instagramUrl);

      return `
        <article class="notoow-card" data-id="${escapeHTML(item.id)}" data-profile-url="${safeUrl}">
          <div class="card-media-wrapper">
            <img class="card-media-img" src="${safeCover}" alt="${safeName}" />
            <div class="media-top-badge">
              <span>${item.country === 'KR' ? '🇰🇷 Korea' : item.country === 'US' ? '🇺🇸 US' : item.country === 'JP' ? '🇯🇵 Japan' : '🌍 ' + (item.country || 'Global')}</span>
              ${item.is_live ? '<span style="background: var(--brand-gradient); color: #FFF; margin-left: 4px; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 10px;">LIVE</span>' : ''}
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
              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" 
                 onclick="event.stopPropagation()"
                 class="metric-pill" 
                 style="color: var(--brand-dark); display: flex; align-items: center; gap: 4px; text-decoration: none;">
                <img src="../assets/instagram.png" alt="Instagram" style="width: 13px; height: 13px; object-fit: contain;" />
                Instagram 피드 <i data-lucide="external-link" style="width: 11px; height: 11px;"></i>
              </a>
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
      const instagramUrl = `https://www.instagram.com/${encodeURIComponent(item.handle)}/`;
      const safeUrl = escapeHTML(instagramUrl);

      return `
        <article class="profile-card-full" data-id="${escapeHTML(item.id)}" data-profile-url="${safeUrl}">
          <div class="profile-header-row">
            <img class="profile-avatar-lg" src="${safeAvatar}" alt="${safeName}" />
            <div class="profile-title-area">
              <h4>${safeName}</h4>
              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" style="color: var(--brand-dark); font-size: 13px;">@${safeHandle}</a>
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
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()"
             style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; padding: 8px 16px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; border-radius: 20px; font-size: 12px; font-weight: 700; text-decoration: none;">
            <img src="../assets/instagram.png" alt="Instagram" style="width: 14px; height: 14px; object-fit: contain; filter: brightness(10);" />
            Instagram 피드 보기
          </a>
        </article>
      `;
    }).join('');
  } else if (mode === 'list') {
    container.className = 'influencer-grid list-mode';
    container.innerHTML = `
      <div class="list-table-container">
        <table class="notoow-table">
          <thead>
            <tr>
              <th>북마크</th>
              <th>프로필 / 계정</th>
              <th>국가</th>
              <th>팔로워</th>
              <th>참여율</th>
              <th>태그</th>
              <th>AI 스코어</th>
              <th>Instagram</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(item => {
              const isBookmarked = store.isBookmarked(item.id);
              const safeName = escapeHTML(item.name);
              const safeHandle = escapeHTML(item.handle);
              const safeAvatar = escapeHTML(item.avatar);
              const tags = Array.isArray(item.tags) ? item.tags : [];
              const instagramUrl = `https://www.instagram.com/${encodeURIComponent(item.handle)}/`;
              const safeUrl = escapeHTML(instagramUrl);

              return `
                <tr data-id="${escapeHTML(item.id)}" data-profile-url="${safeUrl}" style="cursor: pointer;">
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
                  <td>${item.country === 'KR' ? '🇰🇷 Korea' : item.country === 'US' ? '🇺🇸 US' : item.country === 'JP' ? '🇯🇵 JP' : item.country || '-'}</td>
                  <td><strong>${new Intl.NumberFormat('ko-KR').format(item.followers)}</strong>명</td>
                  <td>${Number(item.engagement)}%</td>
                  <td>${tags.map(t => `#${escapeHTML(t)}`).join(' ')}</td>
                  <td><strong style="color: var(--brand-dark);">${Number(item.score)}</strong></td>
                  <td onclick="event.stopPropagation()">
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer"
                       style="display: inline-flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; border-radius: 14px; font-size: 11px; font-weight: 700; padding: 4px 10px; text-decoration: none;">
                      <img src="../assets/instagram.png" alt="IG" style="width: 11px; height: 11px; object-fit: contain; filter: brightness(10);" />
                      피드
                    </a>
                  </td>
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
