/**
 * Notoow Influencer Finder - Supabase Service Layer (SSOT & Resilient)
 * 
 * Handles database API connections, Full-Text Search RPC calls, direct table queries, and Bookmark sync.
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
    // 1. Primary: Try PostgreSQL Full-Text Search RPC
    const { data, error } = await supabaseClient.rpc('search_influencers', {
      search_query: prompt,
      country_filter: country,
      min_followers: minF,
      max_followers: maxF,
      sort_by: sorter,
      result_limit: CONFIG.RESULT_LIMIT
    });

    if (!error && Array.isArray(data)) {
      console.log(`[SupabaseService] Fetched ${data.length} influencers from Supabase RPC.`);
      return data;
    }

    if (error) {
      console.warn('[SupabaseService] RPC search returned error, trying direct table fallback:', error);
    }

    // 2. Fallback: Query 'influencers' table directly if RPC fails
    let query = supabaseClient.from('influencers').select('*, influencer_tags(tag), influencer_media(image, likes, comments, caption)');
    
    if (country !== 'ALL') {
      query = query.eq('country', country);
    }
    if (minF > 0) {
      query = query.gte('followers', minF);
    }
    if (maxF < 999999999) {
      query = query.lte('followers', maxF);
    }

    const { data: tableData, error: tableError } = await query.limit(CONFIG.RESULT_LIMIT);

    if (!tableError && Array.isArray(tableData)) {
      console.log(`[SupabaseService] Direct table fallback fetched ${tableData.length} items.`);
      return tableData.map(item => ({
        ...item,
        tags: Array.isArray(item.influencer_tags) ? item.influencer_tags.map(t => t.tag) : [],
        feed: Array.isArray(item.influencer_media) ? item.influencer_media : []
      }));
    }

    return null;
  } catch (err) {
    console.error('[SupabaseService] Search exception:', err);
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

export async function upsertLiveInfluencers(liveItems = []) {
  if (!supabaseClient || !Array.isArray(liveItems) || liveItems.length === 0) return;

  try {
    const formattedRows = liveItems.map(item => ({
      id: item.id,
      name: item.name,
      handle: item.handle,
      country: item.country || 'KR',
      country_name: item.country_name || 'Korea',
      followers: item.followers || 10000,
      private: false,
      engagement: item.engagement || 4.5,
      score: item.score || 95,
      bio: item.bio || '',
      avatar: item.avatar,
      cover: item.cover,
      profile_url: item.profile_url
    }));

    await supabaseClient.from('influencers').upsert(formattedRows, { onConflict: 'id' });
    console.log(`[SupabaseService] Successfully auto-cached ${formattedRows.length} live Instagram creators into Supabase DB.`);
  } catch (err) {
    console.warn('[SupabaseService] Auto-cache to Supabase failed:', err);
  }
}

