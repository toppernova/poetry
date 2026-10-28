import urllib.request
import json

url = "https://sulekh194971.blogspot.com/feeds/posts/default?alt=json&max-results=50"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

try:
    with urllib.request.urlopen(req) as resp:
        raw_data = resp.read().decode("utf-8")
        data = json.loads(raw_data)

    feed = data["feed"]
    print("Blog Title:", feed.get("title", {}).get("$t"))
    print("Blog Subtitle:", feed.get("subtitle", {}).get("$t"))
    author = feed.get("author", [{}])[0]
    print("Author Name:", author.get("name", {}).get("$t"))
    print("Author URI:", author.get("uri", {}).get("$t"))
    print("Author Image:", author.get("gd$image", {}).get("src"))

    entries = feed.get("entry", [])
    print(f"\nTotal entries fetched: {len(entries)}")
    for i, e in enumerate(entries):
        title = e.get("title", {}).get("$t", "").strip()
        if not title:
            title = "(No Title / Poem / Sher)"
        pub = e.get("published", {}).get("$t", "")[:10]
        links = e.get("link", [])
        alt = [l["href"] for l in links if l.get("rel") == "alternate"]
        href = alt[0] if alt else ""
        comments = e.get("thr$total", {}).get("$t", "0")
        print(f"{i+1:2d}. [{pub}] {title} (Comments: {comments}) -> {href}")

    with open("all_posts.json", "w", encoding="utf-8") as out:
        json.dump(data, out, ensure_ascii=False, indent=2)
    print("\nSaved complete blog data to all_posts.json")

except Exception as ex:
    print("Error fetching feed:", ex)
