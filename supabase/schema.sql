-- ============================================================================
-- Notoow Influencer Finder - Supabase Database Schema & Setup Script (v3 - Bulletproof)
-- Project ID: wqymwtvktdhofzegjawn
-- 
-- Instructions:
-- Copy and paste this script into your Supabase Dashboard SQL Editor
-- (https://supabase.com/dashboard/project/wqymwtvktdhofzegjawn/sql/new)
-- and click "RUN".
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. DROP EXISTING TABLES & FUNCTIONS IF NEEDED
DROP FUNCTION IF EXISTS search_influencers CASCADE;
DROP TABLE IF EXISTS influencer_media CASCADE;
DROP TABLE IF EXISTS influencer_tags CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS search_logs CASCADE;
DROP TABLE IF EXISTS influencers CASCADE;

-- 2. INFLUENCERS TABLE
CREATE TABLE influencers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  handle VARCHAR(100) NOT NULL UNIQUE,
  country VARCHAR(10) NOT NULL DEFAULT 'KR',
  country_name VARCHAR(100) NOT NULL DEFAULT 'Korea',
  followers INT NOT NULL DEFAULT 0,
  private BOOLEAN NOT NULL DEFAULT FALSE,
  engagement NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  score INT NOT NULL DEFAULT 0,
  bio TEXT DEFAULT '',
  avatar TEXT NOT NULL,
  cover TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(handle, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(bio, '')), 'B')
  ) STORED
);

-- Index for Full Text Search & Fast Filtering
CREATE INDEX idx_influencers_fts ON influencers USING GIN (fts);
CREATE INDEX idx_influencers_followers ON influencers (followers DESC);
CREATE INDEX idx_influencers_score ON influencers (score DESC);
CREATE INDEX idx_influencers_country ON influencers (country);

-- 3. INFLUENCER TAGS TABLE
CREATE TABLE influencer_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id VARCHAR(50) REFERENCES influencers(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_influencer_tags_tag ON influencer_tags(tag);
CREATE INDEX idx_influencer_tags_inf ON influencer_tags(influencer_id);

-- 4. INFLUENCER MEDIA (FEEDS/REELS) TABLE
CREATE TABLE influencer_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id VARCHAR(50) REFERENCES influencers(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  caption TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_influencer_media_inf ON influencer_media(influencer_id);

-- 5. BOOKMARKS TABLE
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(100) NOT NULL,
  influencer_id VARCHAR(50) REFERENCES influencers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, influencer_id)
);

-- 6. SEARCH LOGS TABLE
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(100),
  query TEXT NOT NULL,
  country_filter VARCHAR(10) DEFAULT 'ALL',
  min_followers INT DEFAULT 0,
  sort_by VARCHAR(50) DEFAULT 'score_desc',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public Read Access for Search / Public Anonymous Write for Bookmarks & Logs
-- ============================================================================

ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Allow Public Select for influencers & metadata
CREATE POLICY "Allow public select on influencers" ON influencers FOR SELECT USING (true);
CREATE POLICY "Allow public select on influencer_tags" ON influencer_tags FOR SELECT USING (true);
CREATE POLICY "Allow public select on influencer_media" ON influencer_media FOR SELECT USING (true);

-- Allow Public Select & Insert & Delete for bookmarks
CREATE POLICY "Allow public all on bookmarks" ON bookmarks FOR ALL USING (true) WITH CHECK (true);

-- Allow Public Insert for search_logs
CREATE POLICY "Allow public insert on search_logs" ON search_logs FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SEARCH RPC FUNCTION (Full Text Search + Filter)
-- ============================================================================

CREATE OR REPLACE FUNCTION search_influencers(
  search_query TEXT DEFAULT '',
  country_filter TEXT DEFAULT 'ALL',
  min_followers INT DEFAULT 0,
  max_followers INT DEFAULT 999999999,
  sort_by TEXT DEFAULT 'score_desc',
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id VARCHAR(50),
  name VARCHAR(100),
  handle VARCHAR(100),
  country VARCHAR(10),
  country_name VARCHAR(100),
  followers INT,
  private BOOLEAN,
  engagement NUMERIC(5, 2),
  score INT,
  bio TEXT,
  avatar TEXT,
  cover TEXT,
  profile_url TEXT,
  tags TEXT[],
  feed JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT i.*
    FROM influencers i
    WHERE (country_filter = 'ALL' OR i.country = country_filter)
      AND i.followers >= min_followers
      AND i.followers <= max_followers
      AND (
        search_query IS NULL OR search_query = '' OR
        i.fts @@ plainto_tsquery('simple', search_query) OR
        i.name ILIKE '%' || search_query || '%' OR
        i.handle ILIKE '%' || search_query || '%' OR
        i.bio ILIKE '%' || search_query || '%' OR
        EXISTS (
          SELECT 1 FROM influencer_tags t 
          WHERE t.influencer_id = i.id AND t.tag ILIKE '%' || search_query || '%'
        )
      )
  )
  SELECT 
    f.id,
    f.name,
    f.handle,
    f.country,
    f.country_name,
    f.followers,
    f.private,
    f.engagement,
    f.score,
    f.bio,
    f.avatar,
    f.cover,
    f.profile_url,
    COALESCE((
      SELECT array_agg(t.tag::TEXT ORDER BY t.created_at)
      FROM influencer_tags t
      WHERE t.influencer_id = f.id
    ), ARRAY[]::TEXT[]) AS tags,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'image', m.image,
        'likes', m.likes,
        'comments', m.comments,
        'caption', m.caption
      ))
      FROM influencer_media m
      WHERE m.influencer_id = f.id
    ), '[]'::jsonb) AS feed
  FROM filtered f
  ORDER BY
    CASE WHEN sort_by = 'score_desc' THEN f.score END DESC,
    CASE WHEN sort_by = 'followers_desc' THEN f.followers END DESC,
    CASE WHEN sort_by = 'followers_asc' THEN f.followers END ASC,
    CASE WHEN sort_by = 'engagement_desc' THEN f.engagement END DESC,
    f.created_at DESC
  LIMIT result_limit;
END;
$$;


-- ============================================================================
-- INITIAL DATA SEEDING (40 INFLUENCERS - Individual Self-Contained Inserts)
-- ============================================================================

INSERT INTO influencers VALUES ('u01', '소학커플', 'ssohak_couple', 'KR', 'Korea', 9040, false, 4.6, 98, '한국 신혼부부 중 라이프스타일 콘텐츠를 다루는 1만 전후 인플루언서', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u02', '리나 앤 모먼트', 'reenauk33', 'KR', 'Korea', 9320, false, 4.1, 95, 'Romantic Couple Lifestyle Creator. 신혼집 인테리어 & 데일리룩', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u03', '윤성 커플', 'yoon_seong_a', 'KR', 'Korea', 11900, false, 4.8, 96, 'Korean-Japanese Couple & Parenting Creator. 떡볶이 공구 open!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u04', '우라 브이로그', 'woo_la', 'KR', 'Korea', 10900, false, 3.9, 89, 'Couple Lifestyle Vlogger. 일상 브이로그와 인테리어 조명 픽', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u05', '홈데코 큐레이터', 'home_curator', 'KR', 'Korea', 10100, false, 4.3, 92, 'Newlywed Lifestyle & Home Decor Curator. 깔끔한 주방 살림템', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u06', '육아와 어쩌지', 'bubu_life', 'KR', 'Korea', 10900, false, 4.5, 91, 'Parenting & Family Lifestyle Creator. 후쿠오카 가족 여행기', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u07', '뷰티 나노 샬롯', 'charlotte_skin', 'US', 'United States', 12500, false, 5.2, 97, 'North America Beauty & Clean Skincare Specialist. YesStyle Discount code', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u08', '민트 라이프', 'mint_lifestyle', 'KR', 'Korea', 8200, false, 4.0, 87, 'Infertility & Twin Pregnancy Journey. 신혼부부 건강 루틴', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u09', 'Glow Recipe Amy', 'glow_amy', 'US', 'United States', 34200, false, 5.8, 99, 'K-Beauty Ambassador in NYC. Dermatologist-recommended skincare routines', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u10', 'Glass Skin Jenny', 'jenny_glassskin', 'KR', 'Korea', 45100, false, 6.2, 98, '물광 피부 전문 스킨케어 큐레이터. 세럼 & 앰플 비교', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u11', 'Sunscreen Specialist Lee', 'sunscreen_lee', 'KR', 'Korea', 18900, false, 4.7, 94, '선케어 & 무기자차 전문 분석가. 유기자차 선크림 비교 컷', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u12', 'Derma Sarah', 'derma_sarah', 'US', 'United States', 89000, false, 7.1, 99, 'Clinical aesthetician sharing science-backed skincare ingredients & reviews', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u13', '비건 뷰티 지민', 'vegan_jimin', 'KR', 'Korea', 14200, false, 5.1, 93, '비건 & 럭셔리 스킨케어 브이로그. 착한 성분 화장품 추천', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u14', 'Minimal Beauty Maya', 'minimal_maya', 'US', 'United States', 28400, false, 4.9, 96, 'Minimalist 3-step skincare routine for sensitive skin barrier', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u15', 'Quiet Luxury Claire', 'claire_luxury', 'US', 'United States', 67800, false, 5.4, 97, 'Elevated daily outfits, capsule wardrobe & old money aesthetic styling', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u16', '성수 패션 현우', 'seongsu_outfit', 'KR', 'Korea', 22100, false, 6.0, 95, '성수동 스트릿 & 무신사 랭킹 브랜드 룩북 커플 패션', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u17', 'OOTD Sophia', 'sophia_ootd', 'US', 'United States', 51200, false, 4.8, 94, 'New York Street Style & High-low fashion mix for young professionals', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u18', '미니멀 스타일 유진', 'yujin_styled', 'KR', 'Korea', 15800, false, 5.3, 92, '2030 모던 미니멀룩 & 슬랙스 추천 핏 가이드', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u19', 'Vintage Vibe Leo', 'leo_vintage', 'US', 'United States', 31900, false, 5.9, 96, '90s Archive fashion & vintage denim styling for street culture lovers', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u20', '시티보이 동혁', 'cityboy_dh', 'KR', 'Korea', 19400, false, 4.5, 90, '시티보이 & 아메카지 룩북. 캐주얼 레이어드 코디 팁', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u21', '오브제 하우스 민지', 'minji_object', 'KR', 'Korea', 17300, false, 5.1, 94, '신혼집 24평 아파트 리모델링 & 모듈 가구 배치는 이렇게!', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u22', 'Nordic Living Oliver', 'oliver_nordic', 'US', 'United States', 42000, false, 5.7, 97, 'Scandinavian interior design, warm minimalist living room inspo', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u23', '홈카페 지수', 'jisoo_homecafe', 'KR', 'Korea', 29800, false, 6.3, 98, '매일 아침 시그니처 에스프레소 레시피 & 감성 홈카페', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u24', 'Plant Parent Daniel', 'daniel_plants', 'US', 'United States', 18600, false, 4.4, 91, 'Urban jungle bedroom & rare monstera indoor gardening guide', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u25', '비건 테이스트 서현', 'seohyun_table', 'KR', 'Korea', 13500, false, 5.2, 93, '헬시 비건 원팬 요리 레시피 & 주말 온더테이블', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u26', 'Coffee Ritual Mark', 'mark_coffee', 'US', 'United States', 35400, false, 5.6, 96, 'Specialty coffee pour-over techniques & coffee bean roaster reviews', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u27', '도쿄 로컬 브이로그 수빈', 'subin_tokyo', 'KR', 'Korea', 38900, false, 6.1, 98, '도쿄 재주 3년차 현지 맛집 & 카페 투어 감성 릴스', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u28', 'Solo Travel Hannah', 'hannah_wander', 'US', 'United States', 64200, false, 5.8, 97, 'Budget luxury travel guide for female solo wanderers across Europe', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u29', '제주 감성 숙소 유나', 'yuna_jeju', 'KR', 'Korea', 21500, false, 5.0, 94, '제주 촌집 리모델링 스테이 & 감성 숙소 큐레이션', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u30', 'Backpack Chris', 'chris_hike', 'US', 'United States', 48900, false, 6.5, 96, 'Ultralight backpacking tips, gear reviews & Pacific Crest Trail vlog', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u31', '캠퍼 태호', 'taeho_camping', 'KR', 'Korea', 19800, false, 4.9, 92, '차박 & 우중 캠핑 감성 세팅 꿀팁 공유', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u32', 'Island Hopping Alex', 'alex_tropics', 'US', 'United States', 72000, false, 5.4, 98, 'Tropical island hidden gems & drone photography guide', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u33', '필라테스 준', 'june_pilates', 'KR', 'Korea', 16700, false, 4.7, 91, '바른 자세 체형 교정 & 홈트 필라테스 루틴', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u34', 'Crossfit Jake', 'jake_fit', 'US', 'United States', 53400, false, 6.2, 95, 'High-intensity functional fitness, nutrition & protein meal prep', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u35', '러닝 크루 민재', 'minjae_runner', 'KR', 'Korea', 14500, false, 5.1, 93, '마라톤 10k 대비 러닝화 추천 & 러닝 코스', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u36', 'Yoga Flow Chloe', 'chloe_yoga', 'US', 'United States', 41200, false, 5.5, 96, 'Morning vinyasa yoga flow & mindfulness meditation guide', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u37', '건강한 식단 지은', 'jieun_healthy', 'KR', 'Korea', 22300, false, 4.9, 94, '저탄고지 샐러드 드레싱 레시피 & 건강 도시락', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u38', 'K-Skin Lab 박약사', 'pharm_park', 'KR', 'Korea', 52100, false, 6.4, 99, '약사가 알려주는 여드름·색소침착 화장품 성분 진짜 리뷰', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u39', '프리랜서 다은', 'daeun_freelance', 'KR', 'Korea', 9800, false, 4.0, 87, 'IT 프리랜서 & 디지털 노마드. 재택근무 생산성 & 장비 리뷰', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');
INSERT INTO influencers VALUES ('u40', 'Aesthetic Emma', 'emma_aesthetic', 'US', 'United States', 25600, false, 4.8, 95, 'Cottagecore & soft aesthetic lifestyle. Slow living & journaling', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80', 'https://www.instagram.com/');

-- TAG SEED DATA
INSERT INTO influencer_tags (influencer_id, tag) VALUES
('u01', '신혼부부'), ('u01', '라이프스타일'), ('u01', '커플'), ('u01', '데이트'),
('u02', '신혼부부'), ('u02', '인테리어'), ('u02', '패션'), ('u02', '브이로그'),
('u03', '한일커플'), ('u03', '육아'), ('u03', '공구'), ('u03', '식단'),
('u04', '브이로그'), ('u04', '조명'), ('u04', '신혼일상'), ('u04', '홈데코'),
('u05', '홈데코'), ('u05', '살림템'), ('u05', '스킨케어'), ('u05', '뷰티'),
('u06', '육아'), ('u06', '가족여행'), ('u06', '신혼'), ('u06', '일상'),
('u07', '뷰티'), ('u07', '스킨케어'), ('u07', '미국'), ('u07', '클린뷰티'),
('u08', '신혼부부'), ('u08', '임신준비'), ('u08', '식단'), ('u08', '건강'),
('u09', 'K뷰티'), ('u09', '스킨케어'), ('u09', '글로우'), ('u09', 'NYC'),
('u10', '물광피부'), ('u10', '세럼'), ('u10', '스킨케어'), ('u10', '엠플'),
('u11', '선크림'), ('u11', '무기자차'), ('u11', '자외선차단'), ('u11', '뷰티'),
('u12', '피부과'), ('u12', '성분분석'), ('u12', '더마'), ('u12', '안티에이징'),
('u13', '비건뷰티'), ('u13', '클린성분'), ('u13', '럭셔리'), ('u13', '에코'),
('u14', '민감성'), ('u14', '장벽케어'), ('u14', '미니멀'), ('u14', '스킨케어'),
('u15', '올드머니'), ('u15', '캡슐워드로브'), ('u15', '콰이어트럭셔리'), ('u15', '패션'),
('u16', '성수패션'), ('u16', '스트릿'), ('u16', '무신사'), ('u16', '커플룩'),
('u17', '뉴욕패션'), ('u17', '스트릿룩'), ('u17', 'OOTD'), ('u17', '직장인룩'),
('u18', '모던미니멀'), ('u18', '슬랙스'), ('u18', '2030패션'), ('u18', '깔끔룩'),
('u19', '빈티지'), ('u19', '90년대'), ('u19', '스트릿'), ('u19', '데님'),
('u20', '시티보이'), ('u20', '아메카지'), ('u20', '캐주얼'), ('u20', '레이어드'),
('u21', '모듈가구'), ('u21', '인테리어'), ('u21', '신혼집'), ('u21', '리모델링'),
('u22', '북유럽'), ('u22', '인테리어'), ('u22', '미니멀'), ('u22', '거실'),
('u23', '홈카페'), ('u23', '에스프레소'), ('u23', '커피레시피'), ('u23', '감성'),
('u24', '식집사'), ('u24', '몬스테라'), ('u24', '플랜테리어'), ('u24', '원예'),
('u25', '비건식단'), ('u25', '원팬요리'), ('u25', '온더테이블'), ('u25', '쿠킹'),
('u26', '스페셜티'), ('u26', '드립커피'), ('u26', '원두'), ('u26', '바리스타'),
('u27', '도쿄맛집'), ('u27', '일본여행'), ('u27', '카페투어'), ('u27', '브이로그'),
('u28', '혼자여행'), ('u28', '유럽여행'), ('u28', '가성비럭셔리'), ('u28', '세계여행'),
('u29', '제주숙소'), ('u29', '감성스테이'), ('u30', '백패킹'), ('u30', '하이킹'),
('u31', '차박'), ('u31', '우중캠핑'), ('u32', '휴양지'), ('u32', '드론촬영'),
('u33', '필라테스'), ('u33', '체형교정'), ('u34', '크로스핏'), ('u34', '식단관리'),
('u35', '마라톤'), ('u35', '러닝화'), ('u36', '요가'), ('u36', '명상'),
('u37', '저탄고지'), ('u37', '샐러드'), ('u38', '약사'), ('u38', '여드름'),
('u39', '프리랜서'), ('u39', '재택근무'), ('u40', '감성'), ('u40', '라이프스타일');

-- MEDIA SEED DATA (Individual Inserts to prevent multiline syntax errors)
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u01', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80', 1420, 62, '자기야 진정좀 해!! 신혼부부 주말 브런치 케미');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u01', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80', 1120, 45, '오늘의 홈카페 테이블 세팅');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u02', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 1890, 84, '신혼집 8평 거실 리모델링 완성 컷!');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u03', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 2310, 115, '언제나 떡볶이 6차 공구 오픈 기념 이벤트!');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u04', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 1450, 40, '밤마다 틀어두는 감성 무드등과 아로마 디퓨저');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u05', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', 1670, 53, '청소가 편해지는 주방 살림꿀템 TOP 5');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u06', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 1980, 76, '육아 식단 어쩌지?! 급하게 만드는 연어 덮밥');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u07', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 2840, 132, 'My daily morning skin barrier routine for glass skin');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u08', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 1210, 39, '딸기우유 붓고 눌렀더니 확화채 완성!');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u09', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80', 4890, 210, 'Glass skin secrets: Why double cleansing changed my texture');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u10', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 5620, 312, '수분 광채 세럼 TOP 3 꼼꼼 성분 비교 분석');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u11', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', 2140, 88, '백탁 없는 무기자차 선크림 5종 8시간 지속력 테스트');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u12', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 12400, 540, 'Retinol vs Bakuchiol: What every skin type needs to know');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u13', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 1850, 72, '민감성 피부를 위한 100% 비건 수분 크림 내돈내산 3달 후기');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u14', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80', 3910, 145, '3-step calming routine after sun exposure');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u15', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 8920, 412, '10 essential capsule wardrobe pieces for effortless fall elegance');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u16', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 3410, 189, '성수동 팝업스토어 탐방 & 금주 시티보이 착장');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u17', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', 6780, 290, 'Styling oversized blazer for Manhattan coffee runs');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u18', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 2190, 94, '다리 길어보이는 와이드 슬랙스 핏 가이드');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u19', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 4520, 210, 'Thrifting 90s vintage Levis in Brooklyn');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u20', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', 2890, 115, '가을 레이어드 코디 꿀팁 3가지');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u21', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 2940, 142, '신혼집 거실 모듈 소파 위치 바꾸기 서라운드 뷰');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u22', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 5810, 230, 'Cozy minimalist apartment tour in Copenhagen style');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u23', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 4890, 310, '아침을 깨우는 바닐라 크림 라떼 레시피');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u24', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80', 2340, 98, 'Monstera Albo propagation setup & watering secret');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u25', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', 1890, 82, '15분 완성 알리오 올리오 비건 파스타');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u26', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80', 4120, 175, 'Best hand drippers compared: V60 vs Kalita Wave');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u27', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80', 5920, 280, '도쿄 나카메구로 숨은 로컬 드립 커피숍');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u28', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80', 9810, 490, 'Solo girl travel guide in Florence Italy');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u29', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', 3120, 140, '제주 구좌읍 돌담 감성독채 스테이 1박 후기');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u30', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', 7420, 310, 'Top 5 ultralight backpacks under 2 lbs');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u31', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', 2980, 135, '빗소리 들으며 즐기는 가평 오토 캠핑 텐트 세팅');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u32', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', 11200, 520, 'Clear turquoise water of Maldives from above');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u33', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80', 2410, 92, '굽은 어깨 바로 펴주는 5분 필라테스 스트레칭');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u34', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', 8420, 380, 'Full day of eating for muscle growth: 3,000 kcal meal plan');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u35', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80', 2140, 85, '러너 필수템! 발볼 넓은 사람을 위한 쿠션 러닝화');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u36', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80', 6120, 240, '15-minute sunset vinyasa flow for deep relaxation');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u37', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80', 3150, 120, '일주일 내내 안 질리는 리코타 아보카도 샐러드');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u38', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80', 8920, 412, '레티놀 처음 쓰는 사람이 꼭 알아야 할 5가지 ⚠️');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u39', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', 1120, 45, '재택근무 1년차 데스크 셋업 & 생산성 도구 추천 💻');
INSERT INTO influencer_media (influencer_id, image, likes, comments, caption) VALUES ('u40', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80', 3450, 128, 'Slow morning routine in my countryside cottage');
