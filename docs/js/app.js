/**
 * Notoow Influencer Finder - Main Application Entry Point (App Controller)
 * 
 * Binds DOM events, initializes services, and orchestrates state and UI.
 */

import { initSupabase, searchInfluencersFromSupabase, syncBookmarkToSupabase, upsertLiveInfluencers } from './services/supabaseService.js';
import { searchLiveInstagram } from './services/liveInstagramService.js';
import { parseNaturalLanguageQuery } from './services/aiSearchService.js';
import { store } from './store.js';
import { renderResults, renderLoadingSkeleton, refreshLucideIcons } from './ui/render.js';
import { openModal, closeModal } from './ui/modal.js';

// Global Event Handlers & Initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Supabase Client
  initSupabase();

  // Bind Global Event Listeners via Event Delegation
  bindGlobalEvents();

  // Execute initial live DB fetch
  await executeInitialFetch();
});

async function executeInitialFetch() {
  const remoteResults = await searchInfluencersFromSupabase({
    prompt: '',
    country: 'ALL',
    minF: 0,
    maxF: 999999999,
    sorter: 'score_desc'
  });

  if (remoteResults && remoteResults.length > 0) {
    console.log('[App] Loaded live data from Supabase DB on initial page load.');
    store.setData(remoteResults);
  } else {
    console.log('[App] Using local dataset on initial load.');
  }

  renderResults();
  refreshLucideIcons();
}

function bindGlobalEvents() {
  // 1. Results Container Delegation (Card clicks & Bookmark button clicks)
  const container = document.getElementById('resultsContainer');
  if (container) {
    container.addEventListener('click', (e) => {
      const bookmarkBtn = e.target.closest('[data-bookmark-id]');
      if (bookmarkBtn) {
        e.stopPropagation();
        const id = bookmarkBtn.dataset.bookmarkId;
        const isAdded = store.toggleBookmark(id);
        syncBookmarkToSupabase(store.sessionId, id, isAdded);
        renderResults();
        return;
      }

      const card = e.target.closest('[data-id]');
      if (card) {
        const id = card.dataset.id;
        openModal(id);
      }
    });
  }

  // 2. Filter Inputs Real-Time Change
  const inputs = ['keywordInput', 'minFollowers', 'maxFollowers', 'countrySelect', 'includePrivate', 'sortSelect'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => renderResults());
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.addEventListener('keyup', () => renderResults());
      }
    }
  });

  // Prompt input ENTER key
  const promptInput = document.getElementById('promptInput');
  if (promptInput) {
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  // Modal overlay click outside to close
  const detailModal = document.getElementById('detailModal');
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeModal();
      }
    });
  }
}

// App Controller Functions exposed to window for inline HTML triggers
export async function executeSearch() {
  const promptRaw = (document.getElementById('promptInput')?.value || '').trim();
  
  // AI Intent Parsing
  const intent = parseNaturalLanguageQuery(promptRaw);

  const countrySelect = document.getElementById('countrySelect');
  const minFInput = document.getElementById('minFollowers');
  const maxFInput = document.getElementById('maxFollowers');
  const sorter = document.getElementById('sortSelect')?.value || 'score_desc';

  // Apply parsed intents to UI sidebar controls automatically if not manually set
  if (intent.country !== 'ALL' && countrySelect) {
    countrySelect.value = intent.country;
  }
  if (intent.minFollowers > 0 && minFInput) {
    minFInput.value = intent.minFollowers;
  }
  if (intent.maxFollowers < 999999999 && maxFInput) {
    maxFInput.value = intent.maxFollowers;
  }

  const country = countrySelect?.value || 'ALL';
  const minF = parseInt(minFInput?.value) || 0;
  const maxF = parseInt(maxFInput?.value) || 999999999;

  switchMainTab('board');
  renderLoadingSkeleton();

  // Try Supabase RPC search & Live Instagram search concurrently
  const [remoteResults, liveResults] = await Promise.all([
    searchInfluencersFromSupabase({ 
      prompt: intent.query || promptRaw, 
      country, 
      minF, 
      maxF, 
      sorter 
    }),
    promptRaw ? searchLiveInstagram(promptRaw, country) : Promise.resolve([])
  ]);

  let combinedResults = [];
  if (Array.isArray(liveResults) && liveResults.length > 0) {
    combinedResults.push(...liveResults);
    // Auto-cache newly discovered live Instagram profiles to Supabase DB
    upsertLiveInfluencers(liveResults);
  }

  if (Array.isArray(remoteResults) && remoteResults.length > 0) {
    // Avoid duplicate handles
    const existingHandles = new Set(combinedResults.map(r => r.handle.toLowerCase()));
    remoteResults.forEach(r => {
      if (!existingHandles.has(r.handle.toLowerCase())) {
        combinedResults.push(r);
      }
    });
  }

  if (combinedResults.length > 0) {
    store.setData(combinedResults);
  } else {
    // Local filtering fallback
    store.resetDataToMock();
  }

  renderResults();
}

export function executeSearchFromHome() {
  executeSearch();
}

export function switchMainTab(tab) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  if (tab === 'search') {
    document.getElementById('pageViewSearch')?.classList.add('active');
  } else if (tab === 'board') {
    document.getElementById('pageViewBoard')?.classList.add('active');
    store.setBookmarkOnly(false);
    renderResults();
  } else if (tab === 'bookmarks') {
    document.getElementById('pageViewBoard')?.classList.add('active');
    store.setBookmarkOnly(true);
    renderResults();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshLucideIcons();
}

export function switchViewMode(mode) {
  store.setViewMode(mode);
  document.querySelectorAll('.view-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === mode);
  });
  renderResults();
}

export function applyCuration(type) {
  const promptInput = document.getElementById('promptInput');
  const countrySelect = document.getElementById('countrySelect');
  if (!promptInput) return;

  if (type === 'beauty_us') {
    promptInput.value = '북미 빠르게 성장 중인 뷰티 인플루언서 스킨케어 코스메틱';
    if (countrySelect) countrySelect.value = 'US';
  } else if (type === 'skincare') {
    promptInput.value = 'YesStyle 할인코드 제공 스킨케어 나노 크리에이터';
  } else if (type === 'haircare') {
    promptInput.value = '부시시한 헤어 관리팁 헤어 케어 인플루언서';
  } else if (type === 'cleanbeauty') {
    promptInput.value = '비건 뷰티 클린 뷰티 친환경 스킨케어';
  } else if (type === 'kfashion') {
    promptInput.value = '29CM W컨셉 EQL 트렌디 K-패션 스타일 코디';
    if (countrySelect) countrySelect.value = 'KR';
  }
  executeSearch();
}

export function setFollowerRange(min, max) {
  const minEl = document.getElementById('minFollowers');
  const maxEl = document.getElementById('maxFollowers');
  if (minEl) minEl.value = min;
  if (maxEl) maxEl.value = max;
  renderResults();
}

export function resetFilters() {
  const promptInput = document.getElementById('promptInput');
  const keywordInput = document.getElementById('keywordInput');
  const minF = document.getElementById('minFollowers');
  const maxF = document.getElementById('maxFollowers');
  const countrySelect = document.getElementById('countrySelect');
  const includePrivate = document.getElementById('includePrivate');

  if (promptInput) promptInput.value = '';
  if (keywordInput) keywordInput.value = '';
  if (minF) minF.value = '';
  if (maxF) maxF.value = '';
  if (countrySelect) countrySelect.value = 'ALL';
  if (includePrivate) includePrivate.checked = false;

  document.querySelectorAll('.recommend-chip-btn').forEach(b => b.classList.remove('active'));
  store.resetDataToMock();
  renderResults();
}

export function focusPrompt() {
  document.getElementById('promptInput')?.focus();
}

export function fillPrompt(text) {
  const input = document.getElementById('promptInput');
  if (input) input.value = text;
}

export function selectPlatform(btn) {
  document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  store.setPlatform(btn.dataset.platform || 'instagram');
}

export function exportCSV() {
  const list = store.getFilteredData();
  if (!list.length) {
    alert('내보낼 데이터가 없습니다.');
    return;
  }

  const headers = ['username', 'followers', 'engagement_rate', 'score', 'is_private', 'bio', 'tags', 'profile_url'];
  const rows = list.map(p => [
    p.handle,
    p.followers,
    p.engagement,
    p.score,
    p.private ? 'TRUE' : 'FALSE',
    `"${String(p.bio).replaceAll('"', '""')}"`,
    `"${(p.tags || []).join('|').replaceAll('"', '""')}"`,
    p.profileUrl
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Notoow_influencers_export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Bind methods to window for backward compatibility with onclick attributes in HTML
window.Notoow = {
  executeSearch,
  executeSearchFromHome,
  switchMainTab,
  switchViewMode,
  applyCuration,
  setFollowerRange,
  resetFilters,
  focusPrompt,
  fillPrompt,
  selectPlatform,
  exportCSV,
  openModal,
  closeModal
};

// Top-level helpers on window for inline onclick attributes
window.executeSearch = executeSearch;
window.executeSearchFromHome = executeSearchFromHome;
window.switchMainTab = switchMainTab;
window.switchViewMode = switchViewMode;
window.applyCuration = applyCuration;
window.setFollowerRange = setFollowerRange;
window.resetFilters = resetFilters;
window.focusPrompt = focusPrompt;
window.fillPrompt = fillPrompt;
window.selectPlatform = selectPlatform;
window.exportCSV = exportCSV;
window.openModal = openModal;
window.closeModal = closeModal;
