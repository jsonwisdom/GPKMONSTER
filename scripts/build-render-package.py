#!/usr/bin/env python3

import argparse
import hashlib
import json
import shutil
import zipfile
from pathlib import Path


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--brief", required=True)
    parser.add_argument("--image", required=True)
    parser.add_argument("--output-dir", default="dist")
    args = parser.parse_args()

    brief_path = Path(args.brief)
    image_path = Path(args.image)
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    brief = json.loads(brief_path.read_text(encoding="utf-8"))
    if brief.get("authority") is not False:
        raise SystemExit("AUTHORITY_MUST_REMAIN_FALSE")
    if not image_path.is_file():
        raise SystemExit(f"IMAGE_NOT_FOUND: {image_path}")

    extension = image_path.suffix.lower() or ".bin"
    packaged_image = out / f"artwork{extension}"
    shutil.copyfile(image_path, packaged_image)

    questions = "\n".join(
        f"{index}. {question}"
        for index, question in enumerate(brief["discussion_questions"], start=1)
    )
    lesson = (
        f"# {brief['title']}\n\n"
        f"## Lesson\n\n{brief['lesson']}\n\n"
        f"## Discussion questions\n\n{questions}\n\n"
        "## Independent-series notice\n\n"
        "Original satirical educational artwork. No official affiliation, sponsorship, or endorsement is claimed.\n"
    )
    lesson_path = out / "lesson.md"
    lesson_path.write_text(lesson, encoding="utf-8")

    metadata = {
        "asset_id": brief["asset_id"],
        "title": brief["title"],
        "format": brief["format"],
        "purpose": brief["purpose"],
        "audience": brief.get("audience", "general"),
        "lesson": brief["lesson"],
        "sku": brief["product"]["sku"],
        "license": brief["product"]["license"],
        "price_status": brief["product"]["price_status"],
        "image_file": packaged_image.name,
        "image_sha256": sha256(packaged_image),
        "brief_sha256": sha256(brief_path),
        "official_affiliation": False,
        "authority": False,
    }
    metadata_path = out / "metadata.json"
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    files = [packaged_image, lesson_path, metadata_path]
    prompt = out / "render_prompt.txt"
    manifest = out / "render_manifest.json"
    for optional in (prompt, manifest):
        if optional.exists():
            files.append(optional)

    sums_path = out / "SHA256SUMS"
    sums_path.write_text(
        "".join(f"{sha256(path)}  {path.name}\n" for path in files),
        encoding="utf-8",
    )
    files.append(sums_path)

    zip_name = f"{brief['asset_id'].lower()}-digital-pack.zip"
    zip_path = out / zip_name
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, arcname=path.name)

    print(json.dumps({
        "asset_id": brief["asset_id"],
        "package": str(zip_path),
        "package_sha256": sha256(zip_path),
        "authority": False,
    }, indent=2))


if __name__ == "__main__":
    main()
