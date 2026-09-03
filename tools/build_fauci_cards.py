#!/usr/bin/env python3
import hashlib, html, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = ROOT / "sets" / "fauci-files" / "set.json"
OUT = ROOT / "rendered" / "fauci-files"

def esc(value):
    return html.escape(str(value), quote=True)

def wrap(text, width=39):
    words, lines, line = text.split(), [], []
    for word in words:
        if sum(map(len, line)) + len(line) + len(word) > width and line:
            lines.append(" ".join(line)); line = []
        line.append(word)
    if line: lines.append(" ".join(line))
    return lines[:4]

def render(card, meta):
    colors = {"HOLD":"#ffb000","CONTINUES":"#16c784","PASS_PROCESS_ONLY":"#39a0ff","PASS_LETTERS_INVENTORY_ONLY":"#39a0ff"}
    color = colors.get(card["state"], "#ff4b55")
    lines = wrap(card["caption"])
    tspans = "".join(f'<tspan x="55" dy="{0 if i == 0 else 34}">{esc(x)}</tspan>' for i,x in enumerate(lines))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="750" height="1050" viewBox="0 0 750 1050">
<rect width="750" height="1050" rx="38" fill="#111318"/>
<rect x="24" y="24" width="702" height="1002" rx="28" fill="none" stroke="{color}" stroke-width="12"/>
<text x="375" y="100" text-anchor="middle" fill="#f5f5f5" font-family="Arial" font-size="34" font-weight="700">PUBLICPROOF FAUCI FILES</text>
<text x="375" y="165" text-anchor="middle" fill="{color}" font-family="Arial" font-size="48" font-weight="900">{esc(card["name"])}</text>
<circle cx="375" cy="390" r="155" fill="#242832" stroke="{color}" stroke-width="10"/>
<text x="375" y="375" text-anchor="middle" fill="{color}" font-family="monospace" font-size="38" font-weight="700">{esc(card["id"])}</text>
<text x="375" y="430" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="27">{esc(card["state"])}</text>
<text x="55" y="625" fill="#ffffff" font-family="Arial" font-size="28">{tspans}</text>
<text x="55" y="835" fill="#aeb6c4" font-family="monospace" font-size="22">LANE: {esc(card["lane"])}</text>
<text x="55" y="880" fill="#aeb6c4" font-family="monospace" font-size="22">AUTHORITY_CREATED=false</text>
<text x="55" y="925" fill="#aeb6c4" font-family="monospace" font-size="22">jaywisdom.base.eth</text>
<text x="375" y="990" text-anchor="middle" fill="#777f8d" font-family="Arial" font-size="16">SATIRICAL EVIDENCE CARD · RENDER ≠ LEGAL PROOF</text>
</svg>'''

def main():
    meta=json.loads(SPEC.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    hashes={}
    for card in meta["cards"]:
        body=render(card, meta).encode()
        path=OUT/(card["id"]+".svg")
        path.write_bytes(body)
        hashes[str(path.relative_to(ROOT))]=hashlib.sha256(body).hexdigest()
    manifest={"set_id":meta["set_id"],"identity_anchor":meta["identity_anchor"],"authority_created":False,"render_proof_only":True,"files":hashes}
    (OUT/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(manifest,indent=2))
if __name__ == "__main__": main()
