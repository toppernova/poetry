import json

with open("site_data.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

# Update blogInfo to have Aman Kumar only (mentor completely removed)
site_data["blogInfo"] = {
    "title": "Motivation,Education and Research",
    "subtitle": "This Blog is dedicate to motivate the reader and educate them to understand new things and integrate them in research",
    "author": {
        "name": "Aman Kumar",
        "role": "Student, Department of B.Tech CSE",
        "college": "RVS College of Engineering and Technology, Jamshedpur, Jharkhand",
        "bio": "Aman Kumar from Department of B.Tech Computer Science and Engineering, RVS College of Engineering and Technology, Jamshedpur, Jharkhand. Dedicated to motivate the reader, understand new concepts, and integrate them in education and research.",
        "avatar": "assets/aman_avatar.jpg"
    },
    "bannerImage": "assets/banner.jpg"
}

# Remove any mentor mentions in blogInfo
if "mentor" in site_data["blogInfo"]:
    del site_data["blogInfo"]["mentor"]

# Write to site_data.json and data.js
with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(site_data, f, ensure_ascii=False, indent=2)

with open("data.js", "w", encoding="utf-8") as f:
    f.write("window.BLOG_DATA = " + json.dumps(site_data, ensure_ascii=False, indent=2) + ";\n")

print("Cleaned site_data.json and data.js: mentor removed, Aman Kumar author set.")
