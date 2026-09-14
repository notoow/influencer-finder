from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path

from dotenv import load_dotenv

from .finder import InfluencerFinder


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="인플루언서 후보 자동 탐색 도구"
    )
    parser.add_argument(
        "--hashtags",
        required=True,
        help="해시태그를 쉼표로 구분: 신혼부부,커플일상,부부일상",
    )
    parser.add_argument(
        "--keywords",
        default="신혼부부,신혼,부부,커플,커플일상,부부일상,웨딩",
        help="필터 키워드 목록(쉼표 구분), 기본은 신혼부부 중심 세트",
    )
    parser.add_argument(
        "--keywords-file",
        default=None,
        help="키워드 파일 경로(한 줄에 1개, 또는 쉼표 분리). --keywords와 합쳐서 사용",
    )
    parser.add_argument("--ig-user", default=None, help="Instagram 계정")
    parser.add_argument("--ig-pass", default=None, help="Instagram 비밀번호")
    parser.add_argument("--min-followers", type=int, default=8000)
    parser.add_argument("--max-followers", type=int, default=15000)
    parser.add_argument("--posts-per-tag", type=int, default=40)
    parser.add_argument("--posts-per-account", type=int, default=8)
    parser.add_argument("--score-threshold", type=int, default=1)
    parser.add_argument("--top-k", type=int, default=200)
    parser.add_argument(
        "--out",
        default="outputs/couple_candidates.csv",
        help="결과 저장 경로",
    )
    return parser


def _load_env():
    load_dotenv()


def run(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    _load_env()

    import os

    username = args.ig_user or os.getenv("IG_USER")
    password = args.ig_pass or os.getenv("IG_PASS")
    if not username or not password:
        raise SystemExit(
            "IG_USER/IG_PASS 또는 --ig-user/--ig-pass가 필요합니다."
        )

    hashtags = [tag.strip() for tag in args.hashtags.split(",") if tag.strip()]
    keywords = _parse_keywords(args.keywords, args.keywords_file)
    finder = InfluencerFinder(
        username=username,
        password=password,
        keywords=keywords,
        min_followers=args.min_followers,
        max_followers=args.max_followers,
        posts_per_tag=args.posts_per_tag,
        posts_per_account=args.posts_per_account,
        score_threshold=args.score_threshold,
        top_k=args.top_k,
    )

    candidates = finder.run(hashtags)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "username",
                "user_id",
                "followers",
                "is_private",
                "keyword_hit",
                "engagement_rate",
                "post_count_checked",
                "profile_url",
                "bio",
            ],
        )
        writer.writeheader()
        for c in candidates:
            writer.writerow(
                {
                    "username": c.username,
                    "user_id": c.user_id,
                    "followers": c.followers,
                    "is_private": c.is_private,
                    "keyword_hit": c.keyword_hit,
                    "engagement_rate": c.engagement_rate,
                    "post_count_checked": c.post_count_checked,
                    "profile_url": c.profile_url,
                    "bio": c.bio,
                }
            )

    print(f"[완료] 후보 {len(candidates)}건 저장: {out_path}")
    print(f"[적용 키워드] {', '.join(keywords)}")
    return 0


def _parse_keywords(keywords: str, keywords_file: str | None) -> list[str]:
    merged: list[str] = []
    seen: set[str] = set()

    for item in (keywords.split(",") if keywords else []):
        value = item.strip()
        if value and value not in seen:
            seen.add(value)
            merged.append(value)

    if keywords_file:
        for value in _read_keywords_file(Path(keywords_file)):
            if value not in seen:
                seen.add(value)
                merged.append(value)

    if not merged:
        return ["신혼부부"]

    return merged


def _read_keywords_file(path: Path) -> list[str]:
    if not path.exists():
        raise SystemExit(f"키워드 파일을 찾을 수 없습니다: {path}")

    raw = path.read_text(encoding="utf-8")
    tokens: list[str] = []
    for line in raw.splitlines():
        tokens.extend(re.split(r",|\s+", line.strip()))
    return [token.strip() for token in tokens if token.strip()]

