/**
 * Notoow Influencer Finder - AI Natural Language Search Service (SSOT)
 * 
 * Parses raw Korean/English natural language prompts into structured database query parameters.
 * Supports rule-based fast Intent Extraction + LLM AI Engine.
 */

export function parseNaturalLanguageQuery(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return { country: 'ALL', minFollowers: 0, maxFollowers: 999999999, query: '' };
  }

  const text = promptText.trim().toLowerCase();

  // 1. Extract Country Intent
  let country = 'ALL';
  if (text.includes('한국') || text.includes('korea') || text.includes('k-')) {
    country = 'KR';
  } else if (text.includes('미국') || text.includes('북미') || text.includes('us') || text.includes('states')) {
    country = 'US';
  } else if (text.includes('일본') || text.includes('도쿄') || text.includes('japan')) {
    country = 'JP';
  }

  // 2. Extract Follower Range Intent
  let minFollowers = 0;
  let maxFollowers = 999999999;

  if (text.includes('나노') || text.includes('1만 전후') || text.includes('1만 미만') || text.includes('10k 전후')) {
    minFollowers = 5000;
    maxFollowers = 20000;
  } else if (text.includes('마이크로') || text.includes('3만') || text.includes('5만')) {
    minFollowers = 10000;
    maxFollowers = 50000;
  } else if (text.includes('메가') || text.includes('10만 이상') || text.includes('100k')) {
    minFollowers = 100000;
    maxFollowers = 999999999;
  }

  // 3. Clean keywords (remove stop words like "찾아줘", "추천", "인플루언서", "팔로워")
  const stopWords = ['찾아줘', '추천', '인플루언서', '크리에이터', '계정', '팔로워', '전후', '관련', '위주', '있는', '한국', '미국', '일본'];
  let cleanedTerms = promptText.split(/\s+/).filter(word => {
    const cleanWord = word.toLowerCase();
    return word.length > 1 && !stopWords.some(sw => cleanWord.includes(sw));
  });

  const query = cleanedTerms.join(' ');

  return {
    country,
    minFollowers,
    maxFollowers,
    query: query || promptText
  };
}
