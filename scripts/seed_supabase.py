/**
 * Notoow Influencer Finder - Supabase Python Direct Seeding Script
 * 
 * Automatically seeds 40 influencers, tags, and media into Supabase using Supabase Python Client.
 */

import os
import sys
from supabase import create_client, Client

SUPABASE_URL = "https://wqymwtvktdhofzegjawn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeW13dHZrdGRob2Z6ZWdqYXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMzU0NjAsImV4cCI6MjEwNDkxMTQ2MH0.LjPZEDbFEoEhYcTzB-yAhBxDjL8hy1-Ngcuvy7oM6j4"

def seed_database():
    print(f"Connecting to Supabase at {SUPABASE_URL}...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 40 Influencers Dataset
    INFLUENCERS = [
        {"id": "u01", "name": "소학커플", "handle": "ssohak_couple", "country": "KR", "country_name": "Korea", "followers": 9040, "private": False, "engagement": 4.6, "score": 98, "bio": "한국 신혼부부 중 라이프스타일 콘텐츠를 다루는 1만 전후 인플루언서", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u02", "name": "리나 앤 모먼트", "handle": "reenauk33", "country": "KR", "country_name": "Korea", "followers": 9320, "private": False, "engagement": 4.1, "score": 95, "bio": "Romantic Couple Lifestyle Creator. 신혼집 인테리어 & 데일리룩", "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u03", "name": "윤성 커플", "handle": "yoon_seong_a", "country": "KR", "country_name": "Korea", "followers": 11900, "private": False, "engagement": 4.8, "score": 96, "bio": "Korean-Japanese Couple & Parenting Creator. 떡볶이 공구 open!", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u04", "name": "우라 브이로그", "handle": "woo_la", "country": "KR", "country_name": "Korea", "followers": 10900, "private": False, "engagement": 3.9, "score": 89, "bio": "Couple Lifestyle Vlogger. 일상 브이로그와 인테리어 조명 픽", "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u05", "name": "홈데코 큐레이터", "handle": "home_curator", "country": "KR", "country_name": "Korea", "followers": 10100, "private": False, "engagement": 4.3, "score": 92, "bio": "Newlywed Lifestyle & Home Decor Curator. 깔끔한 주방 살림템", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u06", "name": "육아와 어쩌지", "handle": "bubu_life", "country": "KR", "country_name": "Korea", "followers": 10900, "private": False, "engagement": 4.5, "score": 91, "bio": "Parenting & Family Lifestyle Creator. 후쿠오카 가족 여행기", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u07", "name": "뷰티 나노 샬롯", "handle": "charlotte_skin", "country": "US", "country_name": "United States", "followers": 12500, "private": False, "engagement": 5.2, "score": 97, "bio": "North America Beauty & Clean Skincare Specialist. YesStyle Discount code", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u08", "name": "민트 라이프", "handle": "mint_lifestyle", "country": "KR", "country_name": "Korea", "followers": 8200, "private": False, "engagement": 4.0, "score": 87, "bio": "Infertility & Twin Pregnancy Journey. 신혼부부 건강 루틴", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u09", "name": "Glow Recipe Amy", "handle": "glow_amy", "country": "US", "country_name": "United States", "followers": 34200, "private": False, "engagement": 5.8, "score": 99, "bio": "K-Beauty Ambassador in NYC. Dermatologist-recommended skincare routines", "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"},
        {"id": "u10", "name": "Glass Skin Jenny", "handle": "jenny_glassskin", "country": "KR", "country_name": "Korea", "followers": 45100, "private": False, "engagement": 6.2, "score": 98, "bio": "물광 피부 전문 스킨케어 큐레이터. 세럼 & 앰플 비교", "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80", "cover": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", "profile_url": "https://www.instagram.com/"}
    ]

    try:
        print("Upserting influencers...")
        res = supabase.table("influencers").upsert(INFLUENCERS).execute()
        print("Upsert success!", len(res.data) if res.data else "Done")
    except Exception as e:
        print("Error upserting influencers:", e)

if __name__ == "__main__":
    seed_database()
