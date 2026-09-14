from __future__ import annotations

from dataclasses import dataclass
from statistics import mean
from typing import Iterable, List

from instagrapi import Client


DEFAULT_KEYWORDS = {
    "신혼",
    "신혼부부",
    "부부",
    "커플",
    "커플일상",
    "부부일상",
    "웨딩",
}


@dataclass
class Influencer:
    username: str
    user_id: int
    followers: int
    is_private: bool
    bio: str
    keyword_hit: int
    engagement_rate: float
    post_count_checked: int

    @property
    def profile_url(self) -> str:
        return f"https://www.instagram.com/{self.username}/"


def _clean_text(value: str | None) -> str:
    return (value or "").replace("\n", " ").strip()


class InfluencerFinder:
    def __init__(
        self,
        username: str,
        password: str,
        *,
        keywords: Iterable[str] | None = None,
        min_followers: int = 8000,
        max_followers: int = 15000,
        posts_per_tag: int = 40,
        posts_per_account: int = 8,
        score_threshold: int = 1,
        top_k: int = 200,
        session_file: str | None = None,
    ) -> None:
        self.username = username
        self.password = password
        self.min_followers = min_followers
        self.max_followers = max_followers
        self.posts_per_tag = posts_per_tag
        self.posts_per_account = posts_per_account
        self.score_threshold = score_threshold
        self.top_k = top_k
        self.keywords = self._normalize_keywords(keywords)

        self.client = Client()
        if session_file:
            self.client.load_settings(session_file)
            self.client.login(username, password)
        else:
            self.client.login(username, password)

    @staticmethod
    def _normalize_keywords(keywords: Iterable[str] | None) -> set[str]:
        values = {str(value).strip() for value in (keywords or []) if str(value).strip()}
        return values or set(DEFAULT_KEYWORDS)

    def run(self, hashtags: Iterable[str]) -> List[Influencer]:
        seen_users = set()
        result: List[Influencer] = []

        for raw_tag in hashtags:
            hashtag = raw_tag.strip().lstrip("#")
            if not hashtag:
                continue

            medias = self.client.hashtag_medias_recent(hashtag, amount=self.posts_per_tag)
            for media in medias:
                try:
                    user_id = media.user.pk
                except Exception:
                    continue

                if user_id in seen_users:
                    continue
                seen_users.add(user_id)

                profile = self._safe_get_profile(user_id)
                if not profile:
                    continue

                followers = int(profile.follower_count or 0)
                if not (self.min_followers <= followers <= self.max_followers):
                    continue

                try:
                    candidate = self._build_candidate(profile, media)
                except Exception:
                    continue

                if candidate.keyword_hit < self.score_threshold:
                    continue

                result.append(candidate)

        result.sort(
            key=lambda item: (item.keyword_hit, item.engagement_rate, item.followers),
            reverse=True,
        )
        return result[: self.top_k]

    def _safe_get_profile(self, user_id: int):
        try:
            return self.client.user_info_by_id(user_id)
        except Exception:
            return None

    def _build_candidate(self, profile, media):
        username = profile.username
        user_id = int(profile.pk)
        followers = int(profile.follower_count or 0)
        bio = _clean_text(profile.biography)

        user_medias = self.client.user_medias(user_id, amount=self.posts_per_account)
        texts = [_clean_text(media.caption_text) for media in user_medias]
        combined = " ".join([bio] + texts).lower()

        score = self._keyword_score(combined)
        rates = self._engagement_rates(user_medias, followers)
        engagement = round(mean(rates), 4) if rates else 0.0

        return Influencer(
            username=username,
            user_id=user_id,
            followers=followers,
            is_private=bool(profile.is_private),
            bio=bio[:120],
            keyword_hit=score,
            engagement_rate=engagement,
            post_count_checked=len(user_medias),
        )

    def _engagement_rates(self, medias: Iterable, followers: int) -> List[float]:
        if followers <= 0:
            return []

        rates: List[float] = []
        for item in medias:
            likes = int(getattr(item, "like_count", 0) or 0)
            comments = int(getattr(item, "comment_count", 0) or 0)
            rates.append((likes + comments) / followers * 100)
        return rates

    def _keyword_score(self, text: str) -> int:
        target = text.lower()
        score = 0
        for keyword in self.keywords:
            if str(keyword).strip() and str(keyword).lower() in target:
                score += 1
        return score
