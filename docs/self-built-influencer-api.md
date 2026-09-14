# 유료 API 대체형 인플루언서 API 설계안 (정적 대시보드 연동용)

## 1) 결론: 가능 여부

네, 가능합니다.  
지금 제공한 유료 API 스펙은 기능 단위를 기준으로 보면 내부에서 비슷하게 구현할 수 있습니다.

우리는 다음 3개 축으로 새 API를 구성하면 됩니다.

- 인스타 데이터 수집 파이프라인 (프로필/미디어 수집)
- 분석/집계 파이프라인 (참여율/태그/성향 점수 계산)
- 검색/조회 API 레이어 (현재 프론트엔드가 소비할 엔드포인트 제공)

핵심은 실시간 API 호출보다 **정기 수집 + 캐시 기반 조회**로 설계하는 것입니다.

## 2) 목표

- 유료 API의 기존 엔드포인트 형태를 최소한 유지
- 현재 보드 페이지의 CSV 임포트 흐름과 호환되는 데이터 제공
- 수동 운영 우선: 자동화는 크론/워크플로우로 단계 확장
- 초기에 과도한 정확도보다, 운영 가능한 반복성과 비용 통제를 우선

## 3) 기존 API에 대응하는 우리 API 설계(우선순위)

### 3.1 사용자 후보 검색

`POST /v1/{platform}/search/users/query`

- 입력: `query`, `country`, `gender`, `sort`, `min_followers`, `max_followers`, `limit`
- 내부 동작:
  - `query` 키워드를 해시태그/키워드 후보 목록으로 변환
  - 최근 hashtag 기반 수집 캐시에서 사용자 후보 추출
  - 팔로워/참여율/최근성/타이틀 매칭 점수 정렬
- 반환: `items`(user_id, username, display_name, follower_count, engagement_metrics 등)

### 3.2 유사 사용자 검색

`POST /v1/{platform}/search/users/similar`

- 입력: `user_id`, `limit`
- 내부 동작:
  - 기준 사용자의 핵심 특징 벡터 생성(카테고리, 팔로워대, 참여율, 해시태그 빈도)
  - 유사도 계산 후 상위 `limit` 반환
- 반환: `items` 리스트 (유저 기본 메타 + engagement_metrics)

### 3.3 미디어 키워드 검색

`POST /v1/{platform}/search/media/keyword`

- 입력: `keyword`, `country`, `gender`, `since`, `sort`, `limit`, `cursor`
- 내부 동작:
  - `since`일 이내 미디어 인덱스에서 텍스트/해시태그 검색
  - 좋아요, 댓글, 조회수 기반 랭킹
- 반환: `items`(media_id, author_user_id, caption, likes, comments, hashtags, is_video, is_sponsored)

### 3.4 사용자 상세 기본 정보

`GET /v1/{platform}/users/basic/{user_id}`

- 입력: `user_id`
- 내부 동작:
  - 프로필 캐시 조회(없으면 즉시 수집)
- 반환: `follower_count`, `following_count`, `media_count`, `engagement_metrics` 등

### 3.5 사용자 분석 정보

`GET /v1/{platform}/users/analytics/{user_id}`

- 입력: `user_id`, `categories` (demographic, lifestyle, creator 등)
- 내부 동작:
  - 최근 미디어/댓글/프로필 텍스트 기반 rule 기반 분석
  - 성향 태그, 선호 해시태그, 협업 적합도 점수 산출
- 반환: 성향/라이프스타일/브랜드 성향/상세 키워드 등

### 3.6 사용자 미디어

`GET /v1/{platform}/users/media/{user_id}?since=90`

- 입력: `user_id`, `since`(일수)
- 내부 동작:
  - 기간별 미디어 조회 후 정렬/정합성 보정
- 반환: 최근 포스트 목록, 좋아요/댓글/스폰서 여부

## 4) 현재 프로젝트와 연결 방식

우리가 만든 정적 대시보드는 CSV 기반이라 아래 방식이면 바로 연결 가능합니다.

- CSV export용 공통 스키마를 제공하는 내보내기 엔드포인트 추가
  - `GET /v1/{platform}/export/candidates`
- 또는 수동으로 다음 데이터만 뽑아 `docs/index.html`의 업로더가 읽는 열 형식으로 내보내기
  - `username`, `followers`, `bio`, `engagement_rate`, `profile_url`, `keyword_hit`, `tags`

## 5) 수집 파이프라인 제안

- 수집 소스:
  - 공개 해시태그/키워드 페이지 크롤
  - 공개 프로필/미디어 엔드포인트
  - 과거 결과 캐시 재사용
- 처리:
  - 사용자 메타 정규화
  - 미디어 집계(좋아요/댓글/조회수 평균)
  - 성향 분석(해시태그·캡션·bio 키워드 기반)
- 저장:
  - `users`, `media`, `search_index`, `analytics_cache`, `ingest_jobs` 테이블
- 공개 처리량:
  - 초기에 1일 1~2회 배치 수집으로 안정화
- 재시도/내결함성:
  - 실패 항목은 dead-letter 큐 또는 에러 테이블에 기록

## 6) 기술 스택(권장)

- API 서버: FastAPI
- DB: PostgreSQL (초기엔 SQLite도 가능하지만 추천은 Postgres)
- 백그라운드 수집: APScheduler / Celery + Redis
- 검색/유사도: PostgreSQL + trigram/pg_trgm 또는 FAISS로 단순 임베딩
- 컨테이너/배포: Docker + GitHub Actions 워크플로우

## 7) 응답형태 적합성(지금 화면과 맞추기)

프론트에서 즉시 쓸 수 있게 필수 필드를 최소 고정합니다.

- 사용자 식별: `user_id`, `username`, `display_name`, `platform`
- 기본 지표: `follower_count`, `engagement_rate`, `estimated_ad_price_usd`
- 필터 키: `is_private`, `is_verified`, `follower_tier`, `gender`, `country`, `hashtags`
- 보드 확장: `keyword_hit`, `score`, `tags`, `profile_url`

## 8) 구현 단계(최소 3단계)

1 단계: MVP API
- `users/basic`, `users/media`, `search/media/keyword` 구현
- CSV 내보내기 연결
2 단계: 분석 강화
- `users/analytics`, `search/users/query` 구현
- 점수 계산 규칙 고정(카테고리/해시태그/참여율 가중치)
3 단계: 유사도 고도화
- `search/users/similar` 벡터화 적용
- 관리자 페이지형 스크립트로 수동 동기화 품질 관리

## 9) 품질/운영 주의사항

- 플랫폼 정책 준수: 비공개 API 우회 수집은 서비스 정책 변경 리스크가 큼
- 계정 접근 제한 대응: 요청량 제한과 사용자-Agent 분산, 실패 로그 모니터링 필수
- 데이터 유효기간: 분석 결과는 최신성 라벨링과 TTL 관리
- 개인정보 처리: 수집 기준과 목적을 명확히 문서화

## 10) 다음에 바로 진행할 일

- `docs/self-built-influencer-api.md` 기반으로 `src/`에 FastAPI 라우트 스켈레톤 생성
- CSV 생성기를 `outputs/csv`로 표준화
- `docs/index.html`의 수동 업로드 가이드를 이 API export 포맷으로 고정

