#!/usr/bin/env python3
"""Query a bound Zora JSON inventory through Meme, Goblin, and Clown Court projections.

This is a local read-only adapter. It performs no network calls and creates no
on-chain, legal, or semantic authority.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any, Iterable

SCHEMA = "gpkmonster-three-courts-query.v0.1"
DEFAULT_SOURCE = "../jay-zora-portal/data/live_zora_items.json"
SEARCH_FIELDS = (
    "title",
    "description",
    "image_uri",
    "zora_url",
    "contract",
    "token_id",
    "chain",
    "tx_hash",
    "created_at",
)


def canonical_row_hash(row: dict[str, Any]) -> str:
    payload = json.dumps(
        row,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def searchable_text(row: dict[str, Any]) -> str:
    return "\n".join(str(row.get(field, "")) for field in SEARCH_FIELDS).casefold()


def matching_rows(rows: list[dict[str, Any]], query: str) -> Iterable[tuple[int, dict[str, Any]]]:
    needle = query.casefold().strip()
    for index, row in enumerate(rows, start=1):
        if not needle or needle in searchable_text(row):
            yield index, row


def common(index: int, row: dict[str, Any], court: str, source: str) -> dict[str, Any]:
    return {
        "schema": SCHEMA,
        "court": court,
        "source": source,
        "source_index": index,
        "source_row_hash": canonical_row_hash(row),
        "contract": row.get("contract"),
        "token_id": row.get("token_id"),
        "tx_hash": row.get("tx_hash"),
        "created_at": row.get("created_at"),
        "authority": False,
        "onchain_witness": "NOT_INFERRED",
    }


def meme_projection(index: int, row: dict[str, Any], source: str) -> dict[str, Any]:
    out = common(index, row, "MEME_COURT", source)
    out.update(
        {
            "genre": "PUBLIC_TRANSLATION_AND_SHAREABILITY",
            "classification": "SOURCE_ROW_MATCH",
            "title": row.get("title"),
            "description": row.get("description"),
            "image_uri": row.get("image_uri"),
            "zora_url": row.get("zora_url"),
            "chain": row.get("chain"),
            "receipt_boundary": "MATCHED_SOURCE_ROW_NOT_FACTUAL_FINDING",
        }
    )
    return out


def goblin_projection(index: int, row: dict[str, Any], source: str) -> dict[str, Any]:
    out = common(index, row, "GOBLIN_COURT", source)
    required = ("contract", "zora_url", "title")
    missing = [field for field in required if not row.get(field)]
    optional_missing = [field for field in ("token_id", "tx_hash") if not row.get(field)]
    out.update(
        {
            "genre": "ANOMALY_AND_RECEIPT_DISCIPLINE",
            "classification": "SOURCE_ROW_HASHED",
            "required_missing": missing,
            "identifier_gaps": optional_missing,
            "receipt_state": "NEEDS_REVIEW" if (missing or optional_missing) else "IDENTIFIERS_PRESENT",
            "semantic_verdict": "NOT_RUN",
        }
    )
    return out


def clown_projection(index: int, row: dict[str, Any], source: str) -> dict[str, Any]:
    out = common(index, row, "CLOWN_COURT", source)
    flags: list[str] = []
    if not row.get("contract"):
        flags.append("MISSING_CONTRACT")
    if not row.get("zora_url"):
        flags.append("MISSING_ZORA_URL")
    if not row.get("tx_hash"):
        flags.append("MISSING_TX_HASH")
    out.update(
        {
            "genre": "ABSURDITY_AND_AUTHORITY_DRIFT_DETECTION",
            "classification": "SOURCE_ROW_INSPECTION",
            "mechanical_flags": flags,
            "satire_finding": "NONE_AUTOMATIC",
            "fake_green_finding": "NONE_AUTOMATIC",
            "receipt_boundary": "FLAGS_REQUIRE_HUMAN_OR_REPLAY_REVIEW_BEFORE_STORY_PROMOTION",
        }
    )
    return out


PROJECTORS = {
    "meme": meme_projection,
    "goblin": goblin_projection,
    "clown": clown_projection,
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=DEFAULT_SOURCE)
    parser.add_argument("--court", choices=("meme", "goblin", "clown", "all"), default="all")
    parser.add_argument("--q", default="", help="case-insensitive substring query")
    parser.add_argument("--limit", type=int, default=25)
    args = parser.parse_args()

    if args.limit < 1:
        raise SystemExit("--limit must be >= 1")

    source_path = Path(args.source)
    if not source_path.is_file():
        raise SystemExit(f"SOURCE_NOT_FOUND: {source_path}")

    raw = json.loads(source_path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise SystemExit("SOURCE_SCHEMA_MISMATCH: expected JSON array")
    if any(not isinstance(row, dict) for row in raw):
        raise SystemExit("SOURCE_SCHEMA_MISMATCH: every row must be an object")

    source_label = str(source_path)
    courts = tuple(PROJECTORS) if args.court == "all" else (args.court,)
    emitted = 0

    for index, row in matching_rows(raw, args.q):
        for court in courts:
            print(json.dumps(PROJECTORS[court](index, row, source_label), ensure_ascii=False, separators=(",", ":")))
        emitted += 1
        if emitted >= args.limit:
            break

    if emitted == 0:
        print(
            json.dumps(
                {
                    "schema": SCHEMA,
                    "court": args.court.upper(),
                    "query": args.q,
                    "status": "NO_MATCH",
                    "authority": False,
                },
                separators=(",", ":"),
            )
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
