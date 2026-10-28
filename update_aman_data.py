import json
import re
import os
from datetime import datetime

# Load existing site_data.json
with open("site_data.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

# Update blogInfo with Aman Kumar as author, and Prof. Sulekh Kumar as Mentor/Faculty Guide
site_data["blogInfo"] = {
    "title": "Motivation,Education and Research",
    "subtitle": "This Blog is dedicate to motivate the reader and educate them to understand new things and integrate them in research",
    "author": {
        "name": "Aman Kumar",
        "role": "Student, Department of B.Tech CSE",
        "college": "RVS College of Engineering and Technology, Jamshedpur, Jharkhand",
        "bio": "Aman Kumar, student of B.Tech in Computer Science and Engineering at RVS College of Engineering and Technology, Jamshedpur. Passionate about software development, artificial intelligence, educational innovation, and sharing motivational thoughts to empower fellow learners and researchers.",
        "avatar": "assets/aman_avatar.jpg",
        "github": "https://github.com",
        "linkedin": "https://linkedin.com",
        "email": "amankumar.rvscet@gmail.com"
    },
    "mentor": {
        "name": "Prof. Sulekh Kumar",
        "role": "Assistant Professor & Faculty Mentor",
        "college": "RVS College of Engineering and Technology, Jamshedpur, Jharkhand",
        "qualifications": "Qualified UGC NET DEC-2024 & 2025 for Assistant Professor & Admission to Ph.D. in Computer Science & Application",
        "avatar": "assets/author.png",
        "bio": "Sulekh Kumar from Palamu District of Jharkhand. B.Sc. IT from Ranchi College, MCA from Dr. Shyama Prasad Mukherjee University. Assistant Professor in RVS College of Engineering And Technology, Jamshedpur."
    },
    "bannerImage": "assets/banner.jpg"
}

# Add a feature post by Aman Kumar welcoming readers to the new platform
welcome_post = {
    "id": "post-welcome-aman",
    "title": "Empowering Minds: Technology, Consistency and the Spirit of Learning",
    "slug": "empowering-minds-technology-consistency-and-learning",
    "published": datetime.now().isoformat(),
    "dateFormatted": datetime.now().strftime("%B %d, %Y"),
    "monthYear": datetime.now().strftime("%B %Y"),
    "year": datetime.now().strftime("%Y"),
    "author": "Aman Kumar",
    "authorTitle": "B.Tech CSE Student, RVS College of Engineering & Technology",
    "category": "Technology & Education",
    "contentHtml": """
    <p>Welcome to <strong>Motivation, Education and Research</strong>! As a student of Computer Science & Engineering at <em>RVS College of Engineering and Technology, Jamshedpur</em>, I have always believed that education is not merely about memorizing textbooks—it is about cultivating curiosity, building resilience, and applying research-oriented problem solving to real-world challenges.</p>
    
    <blockquote>
      "The beautiful thing about learning is that no one can take it away from you. In engineering and in life, our greatest asset is our willingness to persist through difficulties."
    </blockquote>
    
    <p>Guided by inspiring teachers like <strong>Prof. Sulekh Kumar</strong>, we learn that true intelligence is amplified by dedication and positive attitude. Computer science teaches us logic, but our character and determination determine the impact we create.</p>
    
    <p>Through this platform, we will continue publishing valuable perspectives on technology trends, motivational principles, competitive exam readiness, and research methodology. Whether you are a student, an academic, or an eager lifelong learner, I welcome your feedback, ideas, and participation in our comment sections!</p>
    
    <p style="text-align: right; margin-top: 24px; font-weight: bold; color: #208695;">
      — Aman Kumar<br>
      <span style="font-size: 0.9em; font-weight: normal; color: #666;">Department of B.Tech CSE, RVSCET Jamshedpur</span>
    </p>
    """,
    "snippet": "Welcome to Motivation, Education and Research! As a student of Computer Science & Engineering at RVS College of Engineering and Technology, Jamshedpur, I believe education is about cultivating curiosity, building resilience, and applying research-oriented problem solving...",
    "thumbnail": "assets/aman_avatar.jpg",
    "localThumbnail": "assets/aman_avatar.jpg",
    "origUrl": "",
    "isFeatured": False,
    "isUserCreated": True,
    "comments": [
        {
            "author": "Prof. Sulekh Kumar",
            "date": datetime.now().isoformat(),
            "content": "Great initiative Aman! Keep motivating your fellow students and continuously strive for excellence in research and academics."
        }
    ],
    "commentsCount": 1
}

# Insert welcome post right after featured post
current_posts = site_data.get("posts", [])
# Keep the featured couplet as first, insert welcome post as second
featured = [p for p in current_posts if p.get("isFeatured")]
others = [p for p in current_posts if not p.get("isFeatured")]

# Check if welcome post already exists
others = [p for p in others if p.get("id") != "post-welcome-aman"]
site_data["posts"] = featured + [welcome_post] + others

# Update archive count
current_month = datetime.now().strftime("%B %Y")
site_data["archives"][current_month] = site_data["archives"].get(current_month, 0) + 1

# Write back
with open("site_data.json", "w", encoding="utf-8") as f:
    json.dump(site_data, f, ensure_ascii=False, indent=2)

with open("data.js", "w", encoding="utf-8") as f:
    f.write("window.BLOG_DATA = " + json.dumps(site_data, ensure_ascii=False, indent=2) + ";\n")

print("Updated site_data.json and data.js with Aman Kumar details and welcome post!")
