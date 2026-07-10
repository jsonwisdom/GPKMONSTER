# LIL-PR-04 Scope — Asset Table ID Constraint

## Constitutional anchor

- Repository: `jsonwisdom/GPKMONSTER`
- Issue: `#2` — Living Image Ledger MVP
- Predecessor: `LIL-PR-03`
- Predecessor head SHA: `66a80a5e22f635cf0235252c7c13769bba15dacf`
- LIL-PR-01 receipt SHA-256: `0d80d8a9b1eedf687675c63722e0bb9124b232509908adc959959d5d4e3dc731`
- LIL-PR-02 receipt SHA-256: `51e9ddf50b05b626c7996b2a42f4abd01c2202814e7ee4921c297240e75de029`
- LIL-PR-03 receipt SHA-256: `661743aad6d7447c1648ebee7681ca9161bf69b537e4618b2775f031b68de197`

## Selected scope

`LIL-PR-04_ASSET_TABLE_DDL_CONSTRAINT`

## Single property to prove

A PostgreSQL asset table rejects insertion when `asset_id` does not match the canonical Living Image Ledger identifier format.

```text
INSERT_ASSET_WITH_INVALID_ID_FORMAT = REJECT
```

## Planned identifier format

The first persistence slice will use the narrow format:

```text
^LIL-ASSET-[A-Z0-9]+(?:-[A-Z0-9]+)*$
```

Examples:

```text
LIL-ASSET-GPK-001      = VALID
asset-001              = INVALID
LIL_ASSET_GPK_001      = INVALID
LIL-ASSET-             = INVALID
```

The exact format is intentionally narrow and may evolve only through a later witnessed migration.

## Planned negative fixture

`tests/fixtures/invalid/asset_bad_id.sql`

The fixture will attempt to insert an asset using an identifier that violates the committed `CHECK` constraint.

Expected result:

```text
invalid_asset_insert_exit != 0
```

## Planned positive control

`tests/fixtures/valid/asset_valid_id.sql`

The control will insert an otherwise equivalent asset using a canonical identifier.

Expected result:

```text
valid_asset_insert_exit = 0
```

## Planned implementation surface

The later implementation slice may introduce only the minimum surfaces needed to witness this property:

- `migrations/001_asset_table.sql`
- one invalid SQL fixture
- one valid SQL fixture
- one PostgreSQL-backed CI job
- captured PostgreSQL version
- captured failing constraint name and error output
- one execution-derived receipt artifact

No version table, lineage edge, embedding column, publication state, wallet field, payment field, or retrieval logic belongs in this slice.

## Required future receipt fields

```text
issue=2
scope=LIL_PR_04_ASSET_TABLE_DDL_CONSTRAINT
property=INSERT_ASSET_WITH_INVALID_ID_FORMAT_IS_REJECTED
postgres_version=<observed>
constraint_name=<observed>
invalid_asset_insert_exit=<observed>
valid_asset_insert_exit=<observed>
migration_sha256=<observed>
negative_fixture_sha256=<observed>
positive_fixture_sha256=<observed>
error_log_sha256=<observed>
receipt_file_sha256=<observed>
artifact_digest=<observed>
authority=false
conclusion=<observed>
```

## Exit semantics

A constitutional pass requires PostgreSQL to reject the invalid insert while accepting the positive control, with the CI job itself completing successfully after checking both outcomes.

```text
INVALID_INSERT_EXIT != 0
VALID_INSERT_EXIT = 0
WORKFLOW_EXIT = 0
```

A database startup failure, migration failure, missing `psql`, or harness error is not evidence of constraint enforcement.

## Explicit non-claims

This scope does not claim:

- the asset schema is complete
- database lineage enforcement exists
- identifier format is globally final
- persistence is production-ready
- tamper-proof storage
- multi-tenant isolation
- retrieval correctness
- secure agents
- deterministic transforms
- end-to-end governance

## Governance boundaries

```text
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
NO_SILENT_PROMOTION = TRUE
B20_REQUIRED = FALSE
```

## Promotion rule

`LIL-PR-04` may move from `DEFINED` to `WITNESSED` only after a separate implementation step produces an observed PostgreSQL CI run where the invalid identifier is rejected, the valid identifier is accepted, and the resulting receipt artifact is independently inspected.

No migration, SQL fixture, PostgreSQL service, workflow change, or execution receipt is included in this scope document.
