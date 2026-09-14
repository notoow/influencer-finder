# Notoow Influencer Finder - Supabase Real Image Updater Script
# Replaces generic stock photos with 100% topic-matched, realistic Instagram-like imagery.

import urllib.request
import json

SUPABASE_URL = "https://wqymwtvktdhofzegjawn.supabase.co"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeW13dHZrdGRob2Z6ZWdqYXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMzU0NjAsImV4cCI6MjEwNDkxMTQ2MH0.LjPZEDbFEoEhYcTzB-yAhBxDjL8hy1-Ngcuvy7oM6j4"

INFLUENCER_IMAGES = [
    {"id": "u01", "cover": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"},
    {"id": "u02", "cover": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"},
    {"id": "u03", "cover": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"},
    {"id": "u04", "cover": "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80"},
    {"id": "u05", "cover": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"},
    {"id": "u06", "cover": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"},
    {"id": "u07", "cover": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"},
    {"id": "u08", "cover": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80"},
    {"id": "u09", "cover": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80"},
    {"id": "u10", "cover": "https://images.unsplash.com/photo-1608248597260-6571e5d15842?w=800&auto=format&fit=crop&q=80"},
    {"id": "u11", "cover": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80"},
    {"id": "u12", "cover": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"},
    {"id": "u13", "cover": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"},
    {"id": "u14", "cover": "https://images.unsplash.com/photo-1512290900673-7002b5217615?w=800&auto=format&fit=crop&q=80"},
    {"id": "u15", "cover": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"},
    {"id": "u16", "cover": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"},
    {"id": "u17", "cover": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"},
    {"id": "u18", "cover": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80"},
    {"id": "u19", "cover": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"},
    {"id": "u20", "cover": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80"},
    {"id": "u21", "cover": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80"},
    {"id": "u22", "cover": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80"},
    {"id": "u23", "cover": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"},
    {"id": "u24", "cover": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80"},
    {"id": "u25", "cover": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"},
    {"id": "u26", "cover": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"},
    {"id": "u27", "cover": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80"},
    {"id": "u28", "cover": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80"},
    {"id": "u29", "cover": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"},
    {"id": "u30", "cover": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"},
    {"id": "u31", "cover": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80"},
    {"id": "u32", "cover": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"},
    {"id": "u33", "cover": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"},
    {"id": "u34", "cover": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"},
    {"id": "u35", "cover": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80"},
    {"id": "u36", "cover": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80"},
    {"id": "u37", "cover": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80"},
    {"id": "u38", "cover": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"},
    {"id": "u39", "cover": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"},
    {"id": "u40", "cover": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"}
]

def update_images():
    print("Updating 40 influencer images in Supabase DB...")
    for item in INFLUENCER_IMAGES:
        url = f"{SUPABASE_URL}/rest/v1/influencers?id=eq.{item['id']}"
        req = urllib.request.Request(
            url,
            data=json.dumps({"cover": item["cover"]}).encode("utf-8"),
            headers={
                "apikey": API_KEY,
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        try:
            urllib.request.urlopen(req)
            print(f"Updated {item['id']} -> {item['cover'][:50]}...")
        except Exception as e:
            print(f"Error updating {item['id']}:", e)

if __name__ == "__main__":
    update_images()
