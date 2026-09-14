/**
 * Notoow Influencer Finder - Mock Dataset (SSOT)
 * 
 * 40 High-Quality Curated Influencers across Beauty, Skincare, Fashion, Interior, Vlogs & Fitness.
 * Used as fallback data when Supabase is offline or unconfigured.
 */

export const MOCK_INFLUENCERS = [
  {
    id: 'u01', name: '소학커플', handle: 'ssohak_couple', country: 'KR', countryName: 'Korea',
    followers: 9040, private: false, engagement: 4.6, score: 98,
    bio: '한국 신혼부부 중 라이프스타일 콘텐츠를 다루는 1만 전후 인플루언서',
    tags: ['신혼부부', '라이프스타일', '커플', '데이트'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [
      { image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80', likes: 1420, comments: 62, caption: '자기야 진정좀 해!! 신혼부부 주말 브런치 케미' },
      { image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80', likes: 1120, comments: 45, caption: '오늘의 홈카페 테이블 세팅' }
    ]
  },
  {
    id: 'u02', name: '리나 앤 모먼트', handle: 'reenauk33', country: 'KR', countryName: 'Korea',
    followers: 9320, private: false, engagement: 4.1, score: 95,
    bio: 'Romantic Couple Lifestyle Creator. 신혼집 인테리어 & 데일리룩',
    tags: ['신혼부부', '인테리어', '패션', '브이로그'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', likes: 1890, comments: 84, caption: '신혼집 8평 거실 리모델링 완성 컷!' }]
  },
  {
    id: 'u03', name: '윤성 커플', handle: 'yoon_seong_a', country: 'KR', countryName: 'Korea',
    followers: 11900, private: false, engagement: 4.8, score: 96,
    bio: 'Korean-Japanese Couple & Parenting Creator. 떡볶이 공구 open!',
    tags: ['한일커플', '육아', '공구', '식단'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', likes: 2310, comments: 115, caption: '언제나 떡볶이 6차 공구 오픈 기념 이벤트!' }]
  },
  {
    id: 'u04', name: '우라 브이로그', handle: 'woo_la', country: 'KR', countryName: 'Korea',
    followers: 10900, private: false, engagement: 3.9, score: 89,
    bio: 'Couple Lifestyle Vlogger. 일상 브이로그와 인테리어 조명 픽',
    tags: ['브이로그', '조명', '신혼일상', '홈데코'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', likes: 1450, comments: 40, caption: '밤마다 틀어두는 감성 무드등과 아로마 디퓨저' }]
  },
  {
    id: 'u05', name: '홈데코 큐레이터', handle: 'home_curator', country: 'KR', countryName: 'Korea',
    followers: 10100, private: false, engagement: 4.3, score: 92,
    bio: 'Newlywed Lifestyle & Home Decor Curator. 깔끔한 주방 살림템',
    tags: ['홈데코', '살림템', '스킨케어', '뷰티'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', likes: 1670, comments: 53, caption: '청소가 편해지는 주방 살림꿀템 TOP 5' }]
  },
  {
    id: 'u06', name: '육아와 어쩌지', handle: 'bubu_life', country: 'KR', countryName: 'Korea',
    followers: 10900, private: false, engagement: 4.5, score: 91,
    bio: 'Parenting & Family Lifestyle Creator. 후쿠오카 가족 여행기',
    tags: ['육아', '가족여행', '신혼', '일상'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', likes: 1980, comments: 76, caption: '육아 식단 어쩌지?! 급하게 만드는 연어 덮밥' }]
  },
  {
    id: 'u07', name: '뷰티 나노 샬롯', handle: 'charlotte_skin', country: 'US', countryName: 'United States',
    followers: 12500, private: false, engagement: 5.2, score: 97,
    bio: 'North America Beauty & Clean Skincare Specialist. YesStyle Discount code',
    tags: ['뷰티', '스킨케어', '미국', '클린뷰티'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', likes: 2840, comments: 132, caption: 'My daily morning skin barrier routine for glass skin ✨' }]
  },
  {
    id: 'u08', name: '민트 라이프', handle: 'mint_lifestyle', country: 'KR', countryName: 'Korea',
    followers: 8200, private: false, engagement: 4.0, score: 87,
    bio: 'Infertility & Twin Pregnancy Journey. 신혼부부 건강 루틴',
    tags: ['신혼부부', '임신준비', '식단', '건강'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', likes: 1210, comments: 39, caption: '딸기우유 붓고 눌렀더니 확화채 완성!' }]
  },
  {
    id: 'u09', name: 'Glow Recipe Amy', handle: 'glow_amy', country: 'US', countryName: 'United States',
    followers: 34200, private: false, engagement: 5.8, score: 99,
    bio: 'K-Beauty Ambassador in NYC. Dermatologist-recommended skincare routines',
    tags: ['K뷰티', '스킨케어', '글로우', 'NYC'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80', likes: 4890, comments: 210, caption: 'Glass skin secrets: Why double cleansing changed my texture' }]
  },
  {
    id: 'u10', name: 'Glass Skin Jenny', handle: 'jenny_glassskin', country: 'KR', countryName: 'Korea',
    followers: 45100, private: false, engagement: 6.2, score: 98,
    bio: '물광 피부 전문 스킨케어 큐레이터. 세럼 & 앰플 비교',
    tags: ['물광피부', '세럼', '스킨케어', '엠플'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', likes: 5620, comments: 312, caption: '수분 광채 세럼 TOP 3 꼼꼼 성분 비교 분석' }]
  },
  {
    id: 'u11', name: 'Sunscreen Specialist Lee', handle: 'sunscreen_lee', country: 'KR', countryName: 'Korea',
    followers: 18900, private: false, engagement: 4.7, score: 94,
    bio: '선케어 & 무기자차 전문 분석가. 유기자차 선크림 비교 컷',
    tags: ['선크림', '무기자차', '자외선차단', '뷰티'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', likes: 2140, comments: 88, caption: '백탁 없는 무기자차 선크림 5종 8시간 지속력 테스트' }]
  },
  {
    id: 'u12', name: 'Derma Sarah', handle: 'derma_sarah', country: 'US', countryName: 'United States',
    followers: 89000, private: false, engagement: 7.1, score: 99,
    bio: 'Clinical aesthetician sharing science-backed skincare ingredients & reviews',
    tags: ['피부과', '성분분석', '더마', '안티에이징'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', likes: 12400, comments: 540, caption: 'Retinol vs Bakuchiol: What every skin type needs to know' }]
  },
  {
    id: 'u13', name: '비건 뷰티 지민', handle: 'vegan_jimin', country: 'KR', countryName: 'Korea',
    followers: 14200, private: false, engagement: 5.1, score: 93,
    bio: '비건 & 럭셔리 스킨케어 브이로그. 착한 성분 화장품 추천',
    tags: ['비건뷰티', '클린성분', '럭셔리', '에코'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', likes: 1850, comments: 72, caption: '민감성 피부를 위한 100% 비건 수분 크림 내돈내산 3달 후기' }]
  },
  {
    id: 'u14', name: 'Minimal Beauty Maya', handle: 'minimal_maya', country: 'US', countryName: 'United States',
    followers: 28400, private: false, engagement: 4.9, score: 96,
    bio: 'Minimalist 3-step skincare routine for sensitive skin barrier',
    tags: ['민감성', '장벽케어', '미니멀', '스킨케어'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80', likes: 3910, comments: 145, caption: '3-step calming routine after sun exposure 🌿' }]
  },
  {
    id: 'u15', name: 'Quiet Luxury Claire', handle: 'claire_luxury', country: 'US', countryName: 'United States',
    followers: 67800, private: false, engagement: 5.4, score: 97,
    bio: 'Elevated daily outfits, capsule wardrobe & old money aesthetic styling',
    tags: ['올드머니', '캡슐워드로브', '콰이어트럭셔리', '패션'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', likes: 8920, comments: 412, caption: '10 essential capsule wardrobe pieces for effortless fall elegance' }]
  },
  {
    id: 'u16', name: '성수 패션 현우', handle: 'seongsu_outfit', country: 'KR', countryName: 'Korea',
    followers: 22100, private: false, engagement: 6.0, score: 95,
    bio: '성수동 스트릿 & 무신사 랭킹 브랜드 룩북 커플 패션',
    tags: ['성수패션', '스트릿', '무신사', '커플룩'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', likes: 3410, comments: 189, caption: '성수동 팝업스토어 탐방 & 금주 시티보이 착장' }]
  },
  {
    id: 'u17', name: 'OOTD Sophia', handle: 'sophia_ootd', country: 'US', countryName: 'United States',
    followers: 51200, private: false, engagement: 4.8, score: 94,
    bio: 'New York Street Style & High-low fashion mix for young professionals',
    tags: ['뉴욕패션', '스트릿룩', 'OOTD', '직장인룩'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', likes: 6780, comments: 290, caption: 'Styling oversized blazer for Manhattan coffee runs' }]
  },
  {
    id: 'u18', name: '미니멀 스타일 유진', handle: 'yujin_styled', country: 'KR', countryName: 'Korea',
    followers: 15800, private: false, engagement: 5.3, score: 92,
    bio: '2030 모던 미니멀룩 & 슬랙스 추천 핏 가이드',
    tags: ['모던미니멀', '슬랙스', '2030패션', '깔끔룩'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', likes: 2190, comments: 94, caption: '다리 길어보이는 와이드 슬랙스 핏 가이드' }]
  },
  {
    id: 'u19', name: 'Vintage Vibe Leo', handle: 'leo_vintage', country: 'US', countryName: 'United States',
    followers: 31900, private: false, engagement: 5.9, score: 96,
    bio: '90s Archive fashion & vintage denim styling for street culture lovers',
    tags: ['빈티지', '90년대', '스트릿', '데님'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', likes: 4520, comments: 210, caption: 'Thrifting 90s vintage Levi’s in Brooklyn 👖' }]
  },
  {
    id: 'u20', name: '시티보이 동혁', handle: 'cityboy_dh', country: 'KR', countryName: 'Korea',
    followers: 19400, private: false, engagement: 4.5, score: 90,
    bio: '시티보이 & 아메카지 룩북. 캐주얼 레이어드 코디 팁',
    tags: ['시티보이', '아메카지', '캐주얼', '레이어드'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', likes: 2890, comments: 115, caption: '가을 레이어드 코디 꿀팁 3가지' }]
  },
  {
    id: 'u21', name: '오브제 하우스 민지', handle: 'minji_object', country: 'KR', countryName: 'Korea',
    followers: 17300, private: false, engagement: 5.1, score: 94,
    bio: '신혼집 24평 아파트 리모델링 & 모듈 가구 배치는 이렇게!',
    tags: ['모듈가구', '인테리어', '신혼집', '리모델링'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', likes: 2940, comments: 142, caption: '신혼집 거실 모듈 소파 위치 바꾸기 서라운드 뷰' }]
  },
  {
    id: 'u22', name: 'Nordic Living Oliver', handle: 'oliver_nordic', country: 'US', countryName: 'United States',
    followers: 42000, private: false, engagement: 5.7, score: 97,
    bio: 'Scandinavian interior design, warm minimalist living room inspo',
    tags: ['북유럽', '인테리어', '미니멀', '거실'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', likes: 5810, comments: 230, caption: 'Cozy minimalist apartment tour in Copenhagen style' }]
  },
  {
    id: 'u23', name: '홈카페 지수', handle: 'jisoo_homecafe', country: 'KR', countryName: 'Korea',
    followers: 29800, private: false, engagement: 6.3, score: 98,
    bio: '매일 아침 시그니처 에스프레소 레시피 & 감성 홈카페',
    tags: ['홈카페', '에스프레소', '커피레시피', '감성'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 4890, comments: 310, caption: '아침을 깨우는 바닐라 크림 라떼 레시피 ☕' }]
  },
  {
    id: 'u24', name: 'Plant Parent Daniel', handle: 'daniel_plants', country: 'US', countryName: 'United States',
    followers: 18600, private: false, engagement: 4.4, score: 91,
    bio: 'Urban jungle bedroom & rare monstera indoor gardening guide',
    tags: ['식집사', '몬스테라', '플랜테리어', '원예'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 2340, comments: 98, caption: 'Monstera Albo propagation setup & watering secret' }]
  },
  {
    id: 'u25', name: '비건 테이스트 서현', handle: 'seohyun_table', country: 'KR', countryName: 'Korea',
    followers: 13500, private: false, engagement: 5.2, score: 93,
    bio: '헬시 비건 원팬 요리 레시피 & 주말 온더테이블',
    tags: ['비건식단', '원팬요리', '온더테이블', '쿠킹'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', likes: 1890, comments: 82, caption: '15분 완성 알리오 올리오 비건 파스타' }]
  },
  {
    id: 'u26', name: 'Coffee Ritual Mark', handle: 'mark_coffee', country: 'US', countryName: 'United States',
    followers: 35400, private: false, engagement: 5.6, score: 96,
    bio: 'Specialty coffee pour-over techniques & coffee bean roaster reviews',
    tags: ['스페셜티', '드립커피', '원두', '바리스타'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 4120, comments: 175, caption: 'Best hand drippers compared: V60 vs Kalita Wave' }]
  },
  {
    id: 'u27', name: '도쿄 로컬 브이로그 수빈', handle: 'subin_tokyo', country: 'KR', countryName: 'Korea',
    followers: 38900, private: false, engagement: 6.1, score: 98,
    bio: '도쿄 재주 3년차 현지 맛집 & 카페 투어 감성 릴스',
    tags: ['도쿄맛집', '일본여행', '카페투어', '브이로그'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 5920, comments: 280, caption: '도쿄 나카메구로 숨은 로컬 드립 커피숍 ☕' }]
  },
  {
    id: 'u28', name: 'Solo Travel Hannah', handle: 'hannah_wander', country: 'US', countryName: 'United States',
    followers: 64200, private: false, engagement: 5.8, score: 97,
    bio: 'Budget luxury travel guide for female solo wanderers across Europe',
    tags: ['혼자여행', '유럽여행', '가성비럭셔리', '세계여행'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 9810, comments: 490, caption: 'Solo girl travel guide in Florence Italy 🇮🇹' }]
  },
  {
    id: 'u29', name: '제주 감성 숙소 유나', handle: 'yuna_jeju', country: 'KR', countryName: 'Korea',
    followers: 21500, private: false, engagement: 5.0, score: 94,
    bio: '제주 촌집 리모델링 스테이 & 감성 숙소 큐레이션',
    tags: ['제주숙소', '감성스테이', '제주여행', '감성'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 3120, comments: 140, caption: '제주 구좌읍 돌담 감성독채 스테이 1박 후기' }]
  },
  {
    id: 'u30', name: 'Backpack Chris', handle: 'chris_hike', country: 'US', countryName: 'United States',
    followers: 48900, private: false, engagement: 6.5, score: 96,
    bio: 'Ultralight backpacking tips, gear reviews & Pacific Crest Trail vlog',
    tags: ['백패킹', '하이킹', '캠핑', '아웃도어'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 7420, comments: 310, caption: 'Top 5 ultralight backpacks under 2 lbs' }]
  },
  {
    id: 'u31', name: '캠퍼 태호', handle: 'taeho_camping', country: 'KR', countryName: 'Korea',
    followers: 19800, private: false, engagement: 4.9, score: 92,
    bio: '차박 & 우중 캠핑 감성 세팅 꿀팁 공유',
    tags: ['차박', '우중캠핑', '캠핑장비', '힐링'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 2980, comments: 135, caption: '빗소리 들으며 즐기는 가평 오토 캠핑 텐트 세팅' }]
  },
  {
    id: 'u32', name: 'Island Hopping Alex', handle: 'alex_tropics', country: 'US', countryName: 'United States',
    followers: 72000, private: false, engagement: 5.4, score: 98,
    bio: 'Tropical island hidden gems & drone photography guide',
    tags: ['휴양지', '드론촬영', '해외여행', '스노쿨링'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 11200, comments: 520, caption: 'Clear turquoise water of Maldives from above 🚁' }]
  },
  {
    id: 'u33', name: '필라테스 준', handle: 'june_pilates', country: 'KR', countryName: 'Korea',
    followers: 16700, private: false, engagement: 4.7, score: 91,
    bio: '바른 자세 체형 교정 & 홈트 필라테스 루틴',
    tags: ['필라테스', '체형교정', '홈트', '운동'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', likes: 2410, comments: 92, caption: '굽은 어깨 바로 펴주는 5분 필라테스 스트레칭' }]
  },
  {
    id: 'u34', name: 'Crossfit Jake', handle: 'jake_fit', country: 'US', countryName: 'United States',
    followers: 53400, private: false, engagement: 6.2, score: 95,
    bio: 'High-intensity functional fitness, nutrition & protein meal prep',
    tags: ['크로스핏', '식단관리', '단백질', '웨이트'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', likes: 8420, comments: 380, caption: 'Full day of eating for muscle growth: 3,000 kcal meal plan' }]
  },
  {
    id: 'u35', name: '러닝 크루 민재', handle: 'minjae_runner', country: 'KR', countryName: 'Korea',
    followers: 14500, private: false, engagement: 5.1, score: 93,
    bio: '마라톤 10k 대비 러닝화 추천 & 러닝 코스',
    tags: ['마라톤', '러닝화', '러닝크루', '오운완'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', likes: 2140, comments: 85, caption: '러너 필수템! 발볼 넓은 사람을 위한 쿠션 러닝화' }]
  },
  {
    id: 'u36', name: 'Yoga Flow Chloe', handle: 'chloe_yoga', country: 'US', countryName: 'United States',
    followers: 41200, private: false, engagement: 5.5, score: 96,
    bio: 'Morning vinyasa yoga flow & mindfulness meditation guide',
    tags: ['요가', '명상', '빈야사', '마인드풀니스'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', likes: 6120, comments: 240, caption: '15-minute sunset vinyasa flow for deep relaxation' }]
  },
  {
    id: 'u37', name: '건강한 식단 지은', handle: 'jieun_healthy', country: 'KR', countryName: 'Korea',
    followers: 22300, private: false, engagement: 4.9, score: 94,
    bio: '저탄고지 샐러드 드레싱 레시피 & 건강 도시락',
    tags: ['저탄고지', '샐러드', '도시락', '다이어트'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', likes: 3150, comments: 120, caption: '일주일 내내 안 질리는 리코타 아보카도 샐러드' }]
  },
  {
    id: 'u38', name: 'K-Skin Lab 박약사', handle: 'pharm_park', country: 'KR', countryName: 'Korea',
    followers: 52100, private: false, engagement: 6.4, score: 99,
    bio: '약사가 알려주는 여드름·색소침착 화장품 성분 진짜 리뷰',
    tags: ['약사', '여드름', '성분분석', '스킨케어'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80', likes: 8920, comments: 412, caption: '레티놀 처음 쓰는 사람이 꼭 알아야 할 5가지 ⚠️' }]
  },
  {
    id: 'u39', name: '프리랜서 다은', handle: 'daeun_freelance', country: 'KR', countryName: 'Korea',
    followers: 9800, private: false, engagement: 4.0, score: 87,
    bio: 'IT 프리랜서 & 디지털 노마드. 재택근무 생산성 & 장비 리뷰',
    tags: ['프리랜서', '재택근무', '생산성', '장비리뷰'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', likes: 1120, comments: 45, caption: '재택근무 1년차 데스크 셋업 & 생산성 도구 추천 💻' }]
  },
  {
    id: 'u40', name: 'Aesthetic Emma', handle: 'emma_aesthetic', country: 'US', countryName: 'United States',
    followers: 25600, private: false, engagement: 4.8, score: 95,
    bio: 'Cottagecore & soft aesthetic lifestyle. Slow living & journaling',
    tags: ['감성', '코티지코어', '저널링', '라이프스타일'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/',
    feed: [{ image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', likes: 3450, comments: 128, caption: 'Slow morning routine in my countryside cottage 🌿' }]
  }
];
