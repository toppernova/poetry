import urllib.request
import json

url = "https://sulekh194971.blogspot.com/feeds/comments/default?alt=json&max-results=50"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

try:
    with urllib.request.urlopen(req) as resp:
        raw_data = resp.read().decode("utf-8")
        data = json.loads(raw_data)

    with open("all_comments.json", "w", encoding="utf-8") as out:
        json.dump(data, out, ensure_ascii=False, indent=2)

    entries = data["feed"].get("entry", [])
    print(f"Total comments fetched and saved: {len(entries)}")

except Exception as ex:
    print("Error fetching comments:", ex)
