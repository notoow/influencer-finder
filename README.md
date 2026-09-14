# influencer-finder

신혼부부·커플 인스타그래머 마케팅을 위한 **VIP 부부 보드형 인플루언서 대시보드**입니다.  
팔로워 8,000~15,000(기본값) 구간의 후보를 필터링하고, 키워드/참여율 기반으로 정렬한 뒤 카드·피드·리스트 뷰로 바로 검토할 수 있습니다.

UI는 스크린샷 기준으로 인스타그램 느낌의 피드/프로필 레이아웃에 맞춰 구성되어 있습니다.

> ⚠️ 주의  
> 인스타그램 수집은 해당 플랫폼 이용약관/정책을 준수해야 합니다. 계정 접근량 제한, 로그인 제한, 정책 변경이 발생할 수 있으므로 운영 환경에서는 사용량을 제한하고 예외 처리 로그를 반드시 확인하세요.

## 기능

- 해시태그 기반으로 최근 업로드 게시물 수집
- 게시자 프로필의 팔로워 수 필터링
- 바이오/최근 캡션에서 신혼/커플 관련 키워드 점수화
- 참여율(좋아요·댓글/팔로워) 계산
- CSV로 후보 리스트 저장

## 설치

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
pip install -e .
```

## 환경변수(.env)

`.env.example`를 복사해서 `.env`로 저장하고 아래 값을 넣으세요.

```env
IG_USER=your_instagram_username
IG_PASS=your_instagram_password
```

## 사용 방법

기본 키워드는 `신혼부부,신혼,부부,커플,커플일상,부부일상,웨딩` 입니다.

```bash
influencer-finder \
  --hashtags "신혼부부,커플일상,부부브이로그" \
  --min-followers 8000 \
  --max-followers 15000 \
  --posts-per-tag 40 \
  --out outputs/couple_candidates.csv
```

커스텀 키워드를 쓰려면 `--keywords` 또는 `--keywords-file`을 사용하세요.

```bash
influencer-finder \
  --hashtags "육아,커플라이프,부부일상" \
  --keywords "육아,아이키즈,육아일상,육아맘" \
  --out outputs/couple_candidates.csv
```

자주 쓰는 템플릿 파일 예시

```bash
influencer-finder \
  --hashtags "신혼부부,부부일상" \
  --keywords-file presets/keywords/newlywed_couple.txt \
  --out outputs/newlywed_couple_candidates.csv

influencer-finder \
  --hashtags "브이로그,커플데이트" \
  --keywords-file presets/keywords/daily_vlog.txt \
  --out outputs/daily_vlog_candidates.csv

influencer-finder \
  --hashtags "육아,신생아,유아" \
  --keywords-file presets/keywords/parenting_junior.txt \
  --out outputs/parenting_candidates.csv
```

또는 `.env`에 로그인 정보를 넣으면 아래처럼 실행할 수 있습니다.

```bash
influencer-finder \
  --hashtags "신혼부부,웨딩후기,부부데일리" \
  --out outputs/couple_candidates.csv
```

## GitHub Pages 배포

정적 페이지는 `docs/index.html`, `docs/styles.css`를 기준으로 배포됩니다.

### 1) 배포 브랜치 정리

```bash
git branch -M main
git push -u origin main
```

### 2) GitHub Pages 활성화

1. GitHub 저장소의 **Settings > Pages** 이동
2. **Build and deployment**의 **Source**를 **GitHub Actions**로 설정
3. 리포지토리 루트의 `.github/workflows/pages.yml`이 자동으로 배포 워크플로우를 실행

### 3) 수동 배포/확인용

```bash
git add docs/index.html docs/styles.css README.md .github/workflows/pages.yml .github/workflows/sync-csv-to-pages.yml
git commit -m "feat: add github pages deployment workflow"
git push
```

### 4) 배포 주소

기본 주소는 다음 형식입니다.

```text
https://<GitHub 사용자명>.github.io/<레포지토리명>/
```

예: `https://user.github.io/vip-vip-100-100-dr-jinmokoo/`

## GitHub Actions 연동 및 CSV 자동 동기화

GitHub Pages는 정적 페이지이므로, CSV는 별도 CI가 생성해 저장해야 합니다.

### A. 수동 수집(기존)

- `.github/workflows/run-influencer-finder.yml`에서 `workflow_dispatch`로 직접 실행
- 실행 후 생성물은 `influencer-finder-result` artifact에서 `outputs/couple_candidates.csv`로 다운로드 가능

### B. GitHub Pages용 자동 동기화(권장)

- `.github/workflows/sync-csv-to-pages.yml`를 사용해 `influencer-finder`를 실행하고,
  결과를 `docs/data/couple_candidates.csv`로 덮어쓰기
- 결과 파일이 커밋되면 `pages.yml`이 자동으로 배포
- `docs/index.html`에는 Raw URL 입력 항목이 있어 아래 주소를 넣으면 최신 데이터가 바로 반영됩니다.

```text
https://raw.githubusercontent.com/<GitHub 사용자명>/<레포지토리명>/main/docs/data/couple_candidates.csv
```

#### 실행에 필요한 시크릿

- `IG_USER`
- `IG_PASS`

GitHub 환경변수(`Settings > Secrets and variables > Actions`)에서 등록해야 합니다.

## 주요 옵션

- `--hashtags`: 쉼표로 구분한 해시태그 목록
- `--keywords`: 키워드 필터 (기본: 신혼부부 중심). 쉼표 구분 문자열
- `--keywords-file`: 키워드 파일 경로(한 줄에 1개 또는 쉼표 구분), `--keywords`와 병합
- `--min-followers`, `--max-followers`: 팔로워 수 범위
- `--posts-per-tag`: 해시태그당 수집 게시물 수
- `--posts-per-account`: 참여율 계산을 위한 최근 게시물 수
- `--out`: 출력 CSV 경로
- `--score-threshold`: 키워드 점수 최소 조건(기본 1)
- `--top-k`: 결과 상위 n개만 저장(기본 200)

## 출력 컬럼

- `username`
- `user_id`
- `followers`
- `is_private`
- `keyword_hit`
- `engagement_rate`
- `post_count_checked`
- `profile_url`
- `bio`

## 프로젝트 구조

```txt
.
├─ README.md
├─ LICENSE
├─ .gitignore
├─ requirements.txt
├─ .env.example
└─ src/
   └─ influencer_finder/
      ├─ __init__.py
      ├─ __main__.py
      ├─ finder.py
      └─ cli.py
```

## 라이선스

MIT
