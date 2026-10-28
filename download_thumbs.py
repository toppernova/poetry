import json
import os
import urllib.request
import re

with open("site_data.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

for i, post in enumerate(site_data["posts"]):
    thumb = post["thumbnail"]
    if thumb:
        filename = f"post_{i+1}_thumb.jpg"
        filepath = os.path.join("assets", filename)
        try:
            req = urllib.request.Request(thumb, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as resp, open(filepath, "wb") as out:
                out.write(resp.read())
            print(f"Downloaded {thumb[:40]}... -> {filepath}")
            post["localThumbnail"] = filepath.replace("\\", "/")
        except Exception as e:
            print(f"Failed to download {thumb}: {e}")
            post["localThumbnail"] = thumb
    else:
        post["localThumbnail"] = ""

with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(site_data, f, ensure_ascii=False, indent=2)

with open("data.js", "w", encoding="utf-8") as f:
    f.write("window.BLOG_DATA = " + json.dumps(site_data, ensure_ascii=False, indent=2) + ";\n")

print("Updated site_data.json and data.js with local thumbnails!")
