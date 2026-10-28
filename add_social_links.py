import json

with open("site_data.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

# Add social media links to author
site_data["blogInfo"]["author"]["socialLinks"] = {
    "youtube": "https://youtube.com",
    "github": "https://github.com",
    "whatsapp": "https://wa.me/919876543210",
    "email": "amankumar.rvscet@gmail.com"
}

with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(site_data, f, ensure_ascii=False, indent=2)

with open("data.js", "w", encoding="utf-8") as f:
    f.write("window.BLOG_DATA = " + json.dumps(site_data, ensure_ascii=False, indent=2) + ";\n")

print("Added socialLinks to site_data.json and data.js successfully.")
