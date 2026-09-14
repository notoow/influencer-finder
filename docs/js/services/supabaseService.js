/**
 * Notoow Influencer Finder - Supabase Service Layer (SSOT)
 * 
 * Handles database API connections, Full-Text Search RPC calls, and Bookmark sync.
 */

import { CONFIG } from '../config.js';

let supabaseClient = null;

export function initSupabase() {
  if (window.supabase && window.supabase.createClient && CONFIG.SUPABASE_ANON_KEY && !CONFIG.SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')) {
    try {
      supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      console.log('[SupabaseService] Client initialized successfully!');
      return true;
    } catch (e) {
      console.warn('[SupabaseService] Failed to initialize client:', e);
    }
  }
  console.log('[SupabaseService] Supabase not configured or key missing. Running in local fallback mode.');
  return false;
}

export function isSupabaseReady() {
  return supabaseClient !== null;
}

export async function searchInfluencersFromSupabase({ prompt = '', country = 'ALL', minF = 0, maxF = 999999999, sorter = 'score_desc' }) {
  if (!supabaseClient) return null;

  try {
    const { data, error } = await supabaseClient.rpc('search_influencers', {
      search_query: prompt,
      country_filter: country,
      min_followers: minF,
      max_followers: maxF,
      sort_by: sorter,
      result_limit: CONFIG.RESULT_LIMIT
    });

    if (error) {
      console.warn('[SupabaseService] RPC search error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('[SupabaseService] RPC search exception:', err);
    return null;
  }
}

export async function syncBookmarkToSupabase(sessionId, influencerId, isBookmarked) {
  if (!supabaseClient) return;

  try {
    if (isBookmarked) {
      await supabaseClient.from('bookmarks').insert({ session_id: sessionId, influencer_id: influencerId });
    } else {
      await supabaseClient.from('bookmarks').delete().match({ session_id: sessionId, influencer_id: influencerId });
    }
  } catch (err) {
    console.warn('[SupabaseService] Bookmark sync error:', err);
  }
}
