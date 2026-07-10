# LIL-PR-02 Scope — Lineage Table Creation

## Constitutional anchor

- Repository: `jsonwisdom/GPKMONSTER`
- Issue: `#2` — Living Image Ledger MVP
- Predecessor: `LIL-PR-01`
- Predecessor head SHA: `8933736edd671c6a136e44037e2052f32f5971f0`
- Predecessor receipt SHA-256: `0d80d8a9b1eedf687675c63722e0bb9124b232509908adc959959d5d4e3dc731`

## Selected scope

`LIL-PR-02_LINEAGE_TABLE_CREATION`

## Single property to prove

A lineage-aware datastore rejects creation of a derived asset version when its declared parent version does not exist.

```text
DERIVED_ASSET_WITH_MISSING_PARENT = REJECT
```

## Minimum implementation target

The implementation PR may introduce only the minimum required surfaces to witness this property:

- an `asset` table
- an `asset_version` table
- a `lineage_edge` table
- database constraints or transactional enforcement binding child versions to existing parent versions
- one valid parent-child fixture
- one orphan-child fixture
- one CI workflow that executes the negative and positive controls
- one execution-derived receipt artifact

## Negative test

Attempt to create a child asset version referencing a parent version identifier that does not exist.

Expected result:

```text
orphan_child_insert = REJECT
```

## Positive control

Create a parent asset version, then create a child version whose lineage edge references that existing parent.

Expected result:

```text
valid_parent_child_insert = ACCEPT
```

## Required future receipt fields

```text
issue=2
scope=LIL_PR_02_LINEAGE_TABLE_CREATION
property=DERIVED_ASSET_WITH_MISSING_PARENT_IS_REJECTED
orphan_child_result=REJECT
valid_parent_child_result=ACCEPT
schema_sha256=<observed>
negative_fixture_sha256=<observed>
receipt_sha256=<observed>
authority=false
conclusion=<observed>
```

## Explicit non-claims

This scope does not claim:

- tamper-proof lineage
- complete provenance
- trustworthy retrieval
- secure agents
- production database readiness
- distributed consistency
- cryptographic signing
- end-to-end publication verification

## Governance boundaries

```text
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
NO_SILENT_PROMOTION = TRUE
B20_REQUIRED = FALSE
```

## Promotion rule

`LIL-PR-02` may move from `DEFINED` to `WITNESSED` only after a new implementation PR produces an observed CI run, a rejected orphan-child insertion, an accepted valid parent-child insertion, and an independently inspected receipt artifact.

No implementation is included in this scope document.
