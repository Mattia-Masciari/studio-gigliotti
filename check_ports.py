import urllib.request
import urllib.error

ports = [3000, 3005, 3006, 8080]

for port in ports:
    url = f"http://127.0.0.1:{port}/"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            print(f"Port {port}: STATUS {resp.status}, LENGTH {len(resp.read())}")
    except urllib.error.HTTPError as e:
        print(f"Port {port}: HTTP Error {e.code}")
    except Exception as e:
        print(f"Port {port}: FAILED ({e})")
