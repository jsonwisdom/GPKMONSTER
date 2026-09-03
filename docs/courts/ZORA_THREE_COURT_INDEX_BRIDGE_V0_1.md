# Zora Three-Court Index Bridge V0.1

## Purpose

Bind GPKMONSTER's Meme Court, Goblin Court, and Clown Court query surfaces to the current enumerable Zora inventory without copying or inflating the upstream corpus.

## Source lock

```text
SOURCE_REPOSITORY              = jsonwisdom/jay-zora-portal
SOURCE_REF                     = live-zora-ingestion
OBSERVED_BRANCH_HEAD           = 2872714cd7d0f3460b106ba5d37b24a9cd2c85d6
SOURCE_PATH                    = data/live_zora_items.json
SOURCE_GIT_BLOB_SHA            = 905d9a0448cec672e11d7fc2aa382450a8d8717a
SOURCE_SHA256                  = 89ea69d495b2a4bd53e24c41d4fa03bfd0abe085703abf1656f83d8f15e5cc8d
MANIFEST_PATH                  = exports/jay_zora_inventory.manifest.json
MANIFEST_GENERATION_COMMIT     = 01cc0b07d70f55baa612d44afdee663d7362b860
PROFILE_HANDLE                 = jaywisdom
PROFILE_CREATOR_ADDRESS        = 0x829adfedbe565f9885a7ea6bc78912acaef055e2
DECLARED_PROFILE_COUNT         = 1087
ENUMERABLE_INVENTORY_COUNT     = 1015
UNIQUE_CONTRACT_COUNT          = 1015
DECLARED_ENUMERABLE_GAP        = 72
TERMINAL_HAS_NEXT_PAGE         = false
```

The profile-declared count and enumerable inventory count are separate facts. The 72-row gap stays visible.

## Court projections

### Meme Court

Search fields: title, description, image_uri, zora_url, contract, token_id, chain, tx_hash, created_at.

Purpose: turn matched source rows into public explainers, cards, and satire candidates. A matched row proves only that the row exists in the bound source corpus.

### Goblin Court

Search and inspect: source index, contract, token_id, tx_hash, source blob, manifest hash fields, missing identifiers, duplicate-contract condition, declared/enumerable gap.

Purpose: receipt discipline and anomaly surfacing. It may output NEEDS_RECEIPT, REPLAY_REQUIRED, SOURCE_GAP, or ADMISSIBLE_SOURCE_ROW. It may not promote a row into an accusation.

### Clown Court

Search and inspect: contradictory counts, stale receipts, fake-green labels, authority drift, unsupported narrative promotion, and burden shifting.

Purpose: expose absurdity without converting satire into a fact finding.

## Runtime

`tools/query_three_courts.py` is the local query adapter. It reads the upstream JSON array and emits one JSON object per line. The adapter does not call Zora, Base, EAS, or any external service.

Expected local source path when sibling repos are checked out:

```text
../jay-zora-portal/data/live_zora_items.json
```

## Membrane

```text
SOURCE_ROW_MATCH != FACTUAL_FINDING
PROFILE_ASSOCIATION != WALLET_CONTROL
DECLARED_COUNT != ENUMERABLE_COUNT
ENUMERABLE_ROW != TRANSACTION_REPLAY
ZORA_POINTER != PROOF
BASE_POINTER != PROOF
EAS_ATTESTATION != TRUTH
```

## Current state

```text
WALLET_01_SOURCE_BINDING       = PASS
WALLET_01_DECLARED_PROFILE     = 1087
WALLET_01_ENUMERABLE_CORPUS    = 1015
WALLET_01_GAP                  = 72
WALLETS_RESOLVED               = 1/8
THREE_COURT_SOURCE_BINDING     = PASS
QUERY_ADAPTER_SOURCE           = PRESENT
QUERY_ADAPTER_IN_REPO_TEST     = HOLD
BASE_EAS                       = NOT_CLAIMED
REAL_WORLD_AUTHORITY           = FALSE
```
