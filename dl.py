import curl_cffi.requests, json, base64, os

base = "https://raw.githubusercontent.com/twinthos/twinthos/master"
files = {
    "index.html": "index.html",
    "assets/site.css": "assets/site.css",
    "assets/site.js": "assets/site.js",
    "favicon.svg": "favicon.svg",
}

os.makedirs("/root/twinthos_hero/assets", exist_ok=True)

for raw_path, local_path in files.items():
    url = f"{base}/{raw_path}"
    r = curl_cffi.requests.get(url, impersonate="chrome110", timeout=15)
    full = f"/root/twinthos_hero/{local_path}"
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(r.text)
    print(f"{local_path}: {len(r.text)} chars")

print("Done downloading source")
