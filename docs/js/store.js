/**
 * Notoow Influencer Finder - Central State Store (SSOT)
 * 
 * Manages reactive application state: data list, bookmarks, view mode, filters.
 *
 * NOTE: Mock data is intentionally excluded from initial display.
 * Results are shown only after a real search is performed.
 */

// Generate or retrieve persistent Session ID for bookmarks
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('notoow_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('notoow_session_id', sessionId);
  }
  return sessionId;
}

export const store = {
  sessionId: getOrCreateSessionId(),
  currentData: [], // Empty on load — populated only by real search results
  hasSearched: false, // Tracks whether a search has been run
  bookmarkedIds: new Set(),
  currentViewMode: 'feed', // 'feed' | 'profile' | 'list'
  isBookmarkOnly: false,
  selectedPlatform: 'instagram',

  setData(data) {
    this.currentData = Array.isArray(data) ? data : [];
    this.hasSearched = true;
  },

  resetDataToMock() {
    // No longer resets to mock - clears results instead
    this.currentData = [];
    this.hasSearched = false;
  },

  toggleBookmark(id) {
    if (this.bookmarkedIds.has(id)) {
      this.bookmarkedIds.delete(id);
      return false; // Removed
    } else {
      this.bookmarkedIds.add(id);
      return true; // Added
    }
  },

  isBookmarked(id) {
    return this.bookmarkedIds.has(id);
  },

  setViewMode(mode) {
    this.currentViewMode = mode;
  },

  setBookmarkOnly(flag) {
    this.isBookmarkOnly = flag;
  },

  setPlatform(platform) {
    this.selectedPlatform = platform;
  },

  getFilteredData() {
    const promptInput = document.getElementById('promptInput');
    const keywordInput = document.getElementById('keywordInput');
    const minFInput = document.getElementById('minFollowers');
    const maxFInput = document.getElementById('maxFollowers');
    const countrySelect = document.getElementById('countrySelect');
    const includePrivateCheck = document.getElementById('includePrivate');
    const sortSelect = document.getElementById('sortSelect');

    const prompt = (promptInput?.value || '').toLowerCase();
    const keyword = (keywordInput?.value || '').toLowerCase();
    const minF = parseInt(minFInput?.value) || 0;
    const maxF = parseInt(maxFInput?.value) || Infinity;
    const country = countrySelect?.value || 'ALL';
    const includePrivate = includePrivateCheck ? includePrivateCheck.checked : false;
    const sorter = sortSelect?.value || 'score_desc';

    let list = this.currentData.filter(item => {
      if (this.isBookmarkOnly && !this.bookmarkedIds.has(item.id)) return false;
      if (!includePrivate && item.private) return false;
      if (item.followers < minF || item.followers > maxF) return false;
      if (country !== 'ALL' && item.country !== country) return false;

      const tagsText = Array.isArray(item.tags) ? item.tags.join(' ') : '';
      const fullText = `${item.name} ${item.handle} ${item.bio} ${tagsText}`.toLowerCase();
      if (prompt && !fullText.includes(prompt.slice(0, 3))) {
        const terms = prompt.split(/\s+/).filter(t => t.length > 1);
        if (terms.length > 0 && !terms.some(t => fullText.includes(t))) {
          return false;
        }
      }
      if (keyword && !fullText.includes(keyword)) return false;

      return true;
    });

    // Sorting logic
    if (sorter === 'followers_desc') list.sort((a, b) => b.followers - a.followers);
    else if (sorter === 'followers_asc') list.sort((a, b) => a.followers - b.followers);
    else if (sorter === 'engagement_desc') list.sort((a, b) => b.engagement - a.engagement);
    else if (sorter === 'score_desc') list.sort((a, b) => b.score - a.score);
    else if (sorter === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }
};
