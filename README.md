# GPKMONSTER

Settlement surface for Jay's GPKMONSTER lineage.

```text
SETTLE_NAME     = jaywisdom.base.eth
SETTLE_ADDRESS  = 0xA380552a27b0a5a2874Ea7AA52CAC09f542002E8
AUTHORITY       = FALSE
NO_FAKE_GREEN   = TRUE
STATE           = COLLAPSE_PACKED / NOT_MARKET_SETTLED
```

A business idea that worked for just a little while (repo created 2016-09-29).
This rebuild does not pretend the 2016 product is back. It inventories what still exists and pins it to the Base ENS anchor until a later human grant settles market or mint state.

## What this repo is now

Pointer collapse + ledger MVP spec. Not a DEX. Not EVENT_X. Not F4.

- [`SETTLEMENT.md`](SETTLEMENT.md) — collapse map
- [`collapse-index.json`](collapse-index.json) — machine index
- [`schemas/`](schemas/) — intent / receipt shapes from issue #2
- Issue #2 — Living Image Ledger MVP (architecture only)

## Collapse rule

```text
GPKMONSTER husk
  + JSONWisdom repo graph slot
  + JOY goblin constellation bytes (hashed, not imported as truth)
  + Zora / Uniswap V4 public pointers
  → jaywisdom.base.eth
```

Zora pool marks and Uniswap pool IDs are **observed locators**. They are not a filled settlement. `PUBLISH_READY ≠ PUBLISHED`. `POOL_SEEN ≠ SETTLED`.

## Boundary

```text
RETRIEVED ≠ SUITABLE
SUITABLE ≠ AUTHORIZED
AUTHORIZED ≠ EXECUTED
EXECUTED ≠ PUBLISHED
PUBLISHED ≠ VERIFIED
HASH ≠ TRUTH
