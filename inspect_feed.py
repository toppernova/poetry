import re
import json

file_path = r"C:\Users\sande\.gemini\antigravity-ide\brain\ea51beaa-07eb-4ee4-b610-1639f0c932e4\.system_generated\steps\28\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

start = text.find('{"version":"1.0"')
raw = text[start:].strip()

# Fix invalid \u escapes if any (e.g. \u not followed by 4 hex digits)
fixed = re.sub(r'\\u(?![0-9a-fA-F]{4})', r'\\\\u', raw)

try:
    data = json.loads(fixed)
    entries = data["feed"].get("entry", [])
    print(f"Parsed successfully! Total entries: {len(entries)}")
    for i, e in enumerate(entries):
        title = e.get("title", {}).get("$t", "(No Title)")
        pub = e.get("published", {}).get("$t", "")[:10]
        links = e.get("link", [])
        alt = [l["href"] for l in links if l.get("rel") == "alternate"]
        print(f"{i+1}. [{pub}] '{title}' -> {alt[0] if alt else ''}")
except Exception as ex:
    print("Error:", ex)
