import json
import re
import os
import urllib.request
from datetime import datetime

os.makedirs("assets", exist_ok=True)

# 1. Download Author Image
author_img_url = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoZe0Nhuov63qBERLS3yMLjld6rDFTTgwxUznklMH7cbCATCJds7Psjpw_uqYHYyEknZkFc0QM__cm6dbVjvGWBWDZ_wOmF6VuyYjaJCRkLtnnhWeW0K5FDRBrgsinmKAqJgo33DuRyhVg-fjqzsbME3B7G29Tdnc954Sp_1w_vE5hrVA/s220/WhatsApp_Image_2024-03-26_at_5.10.30_PM-removebg-preview%20(5).png"
try:
    req = urllib.request.Request(author_img_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open("assets/author.png", "wb") as f:
        f.write(resp.read())
    print("Downloaded author image to assets/author.png")
except Exception as e:
    print("Error downloading author image:", e)

# 2. Download Background Image
bg_img_url = "https://themes.googleusercontent.com/image?id=iOjEWmpWlNVmx91RAaWC3irZSyq8cu05pASFz84khXxbIM83x8QP6Hnw7ZIDcZFvcAGSBpGCNsBC"
try:
    req = urllib.request.Request(bg_img_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open("assets/banner.jpg", "wb") as f:
        f.write(resp.read())
    print("Downloaded background banner to assets/banner.jpg")
except Exception as e:
    print("Error downloading banner image:", e)

# Load raw posts and comments
with open("all_posts.json", "r", encoding="utf-8") as f:
    posts_raw = json.load(f)

with open("all_comments.json", "r", encoding="utf-8") as f:
    comments_raw = json.load(f)

# Process comments
comments_by_url = {}
for entry in comments_raw.get("feed", {}).get("entry", []):
    in_reply_to = entry.get("thr$in-reply-to", {}).get("href", "")
    author_name = entry.get("author", [{}])[0].get("name", {}).get("$t", "Anonymous")
    pub = entry.get("published", {}).get("$t", "")
    content = entry.get("content", {}).get("$t", "")
    
    # Clean up content
    clean_content = re.sub(r'<[^>]+>', '', content).strip()
    
    c_obj = {
        "author": author_name,
        "date": pub,
        "content": clean_content
    }
    if in_reply_to not in comments_by_url:
        comments_by_url[in_reply_to] = []
    comments_by_url[in_reply_to].append(c_obj)

# Process posts
processed_posts = []
entries = posts_raw.get("feed", {}).get("entry", [])

archive_counts = {}

for idx, entry in enumerate(entries):
    post_id = entry.get("id", {}).get("$t", "").split("-")[-1]
    title = entry.get("title", {}).get("$t", "").strip()
    pub = entry.get("published", {}).get("$t", "")
    updated = entry.get("updated", {}).get("$t", "")
    content_html = entry.get("content", {}).get("$t", "")
    
    # Original URL
    links = entry.get("link", [])
    alt = [l["href"] for l in links if l.get("rel") == "alternate"]
    orig_url = alt[0] if alt else ""
    
    # Month archive key (e.g. "July 2026")
    dt = datetime.fromisoformat(pub.replace("Z", "+00:00")) if pub else datetime.now()
    month_year = dt.strftime("%B %Y")
    archive_counts[month_year] = archive_counts.get(month_year, 0) + 1
    
    # Find thumbnail if any
    thumb_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content_html)
    thumb_url = thumb_match.group(1) if thumb_match else ""
    
    # If title is empty, check for quotes or sher
    if not title:
        # Check if first line contains quote
        first_clean = re.sub(r'<[^>]+>', ' ', content_html).strip()
        first_line = [line.strip() for line in first_clean.split("\n") if line.strip()][0] if first_clean else "Untitled Post"
        if "Hum bhi dariya hain" in first_line:
            title = "Hum Bhi Dariya Hain (हम भी दरिया हैं)"
        elif "The Broken Branch" in first_line:
            title = "“The Broken Branch”"
        else:
            title = first_line[:50] + "..." if len(first_line) > 50 else first_line

    # Snippet text
    clean_text = re.sub(r'<[^>]+>', ' ', content_html)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    snippet = clean_text[:280] + ("..." if len(clean_text) > 280 else "")

    # Post comments
    post_comments = comments_by_url.get(orig_url, [])

    is_featured = (idx == 0)

    processed_posts.append({
        "id": post_id or f"post-{idx}",
        "title": title,
        "slug": orig_url.split("/")[-1].replace(".html", "") if orig_url else f"post-{idx}",
        "published": pub,
        "dateFormatted": dt.strftime("%B %d, %Y"),
        "monthYear": month_year,
        "year": dt.strftime("%Y"),
        "author": "Prof. Sulekh Kumar",
        "authorTitle": "Qualified UGC NET DEC-2024 & 2025 for Assistant Professor & Admission to Ph.D. in Computer Science & Application",
        "contentHtml": content_html,
        "snippet": snippet,
        "thumbnail": thumb_url,
        "origUrl": orig_url,
        "isFeatured": is_featured,
        "comments": post_comments,
        "commentsCount": len(post_comments)
    })

site_data = {
    "blogInfo": {
        "title": "Motivation,Education and Research",
        "subtitle": "This Blog is dedicate to motivate the reader and educate them to understand new things and integrate them in research",
        "author": {
            "name": "Prof. Sulekh Kumar",
            "qualifications": "Qualified UGC NET DEC-2024 & 2025 for Assistant Professor & Admission to Ph.D. in Computer Science & Application",
            "bio": "Sulekh Kumar from Palamu District of Jharkhand. I have done B.Sc. IT from Ranchi College, Ranchi. I have also done MCA from Dr. Shyama Prasad Mukherjee University. I am recently Working as Assistant Professor in RVS College of Engineering And Technology, Jamshedpur ,Jharkhand",
            "avatar": "assets/author.png",
            "profileUrl": "https://www.blogger.com/profile/08588688521541723554"
        },
        "bannerImage": "assets/banner.jpg"
    },
    "archives": archive_counts,
    "posts": processed_posts
}

with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(site_data, f, ensure_ascii=False, indent=2)

# Also write as JavaScript file so it can load instantly without CORS issues when running from file://
js_content = "window.BLOG_DATA = " + json.dumps(site_data, ensure_ascii=False, indent=2) + ";\n"
with open("data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated site_data.json and data.js with {len(processed_posts)} posts and {len(archive_counts)} archive groups!")
