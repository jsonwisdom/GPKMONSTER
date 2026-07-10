#!/usr/bin/env python3

import argparse
import hashlib
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--constitution", required=True)
    parser.add_argument("--brief", required=True)
    parser.add_argument("--output-dir", default="dist")
    args = parser.parse_args()

    constitution_path = Path(args.constitution)
    brief_path = Path(args.brief)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    constitution = load_json(constitution_path)
    brief = load_json(brief_path)

    if constitution.get("defaults", {}).get("authority") is not False:
        raise SystemExit("CONSTITUTION_ERROR: authority must remain false")
    if brief.get("authority") is not False:
        raise SystemExit("BRIEF_ERROR: authority must remain false")

    prompt_lines = [
        "STANDING RENDERING CONSTITUTION:",
        *[f"- {item}" for item in constitution["required_behavior"]],
        "",
        "PROHIBITIONS:",
        *[f"- {item}" for item in constitution["prohibited_behavior"]],
        "",
        "ASSET BRIEF:",
        f"Title: {brief['title']}",
        f"Format: {brief['format']}",
        f"Concept: {brief['concept']}",
        f"Lesson: {brief['lesson']}",
        "Originality requirements:",
        *[f"- {item}" for item in brief["originality_requirements"]],
        "",
        f"Fallback rule: {constitution['fallback_rule']}",
        "Official affiliation: false",
        "Authority: false",
    ]

    prompt = "\n".join(prompt_lines) + "\n"
    prompt_path = output_dir / "render_prompt.txt"
    prompt_path.write_text(prompt, encoding="utf-8")

    manifest = {
        "constitution_version": constitution["version"],
        "creative_mode": constitution["mode"],
        "asset_id": brief["asset_id"],
        "title": brief["title"],
        "constitution_sha256": hashlib.sha256(constitution_path.read_bytes()).hexdigest(),
        "brief_sha256": hashlib.sha256(brief_path.read_bytes()).hexdigest(),
        "compiled_prompt_sha256": hashlib.sha256(prompt.encode("utf-8")).hexdigest(),
        "official_affiliation": False,
        "authority": False,
    }
    (output_dir / "render_manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
