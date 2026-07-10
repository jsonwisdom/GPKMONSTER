# LIL-PR-05 Scope — Lineage Edge Foreign Key Constraint

## Constitutional anchor

- Repository: `jsonwisdom/GPKMONSTER`
- Issue: `#2` — Living Image Ledger MVP
- Predecessor: `LIL-PR-04`
- Predecessor head SHA: `d12cfb1d3a72306ac83383a9fac012c1d1b16881`
- LIL-PR-01 receipt SHA-256: `0d80d8a9b1eedf687675c63722e0bb9124b232509908adc959959d5d4e3dc731`
- LIL-PR-02 receipt SHA-256: `51e9ddf50b05b626c7996b2a42f4abd01c2202814e7ee4921c297240e75de029`
- LIL-PR-03 receipt SHA-256: `661743aad6d7447c1648ebee7681ca9161bf69b537e4618b2775f031b68de197`
- LIL-PR-04 receipt SHA-256: `33ee54dda4137265166d410828ce4d5c2a3bbf089f2d7e0dbf9262d2d4cfd4f7`

## Selected scope

`LIL-PR-05_LINEAGE_EDGE_FK_CONSTRAINT`

## Single property to prove

A PostgreSQL `lineage_edge` table rejects insertion when `child_asset_id` does not reference an existing row in `asset.asset_id`.

```text
INSERT_LINEAGE_EDGE_WITH_NONEXISTENT_CHILD = REJECT
```

## Planned migration

`migrations/002_lineage_edge_table.sql`

The later implementation slice may define only the minimum required lineage edge surface:

- `lineage_edge_id`
- `parent_asset_id`
- `child_asset_id`
- foreign keys to `asset(asset_id)`
- `authority = false`

The exact foreign key protecting the scoped property should be named:

```text
lineage_edge_child_asset_fk
```

## Planned negative fixture

`tests/fixtures/invalid/lineage_orphan_child.sql`

The fixture will first create or reference a valid parent asset, then attempt to insert a lineage edge whose `child_asset_id` does not exist.

Expected result:

```text
orphan_child_insert_exit != 0
```

Expected error class:

```text
violates foreign key constraint "lineage_edge_child_asset_fk"
```

## Planned positive control

`tests/fixtures/valid/lineage_valid_edge.sql`

The control will create or reference valid parent and child assets, then insert a lineage edge between them.

Expected result:

```text
valid_lineage_edge_insert_exit = 0
```

## Planned implementation surface

A later implementation step may introduce only:

- `migrations/002_lineage_edge_table.sql`
- one invalid SQL fixture
- one valid SQL fixture
- one PostgreSQL-backed CI job
- captured PostgreSQL version
- captured foreign-key error output
- one execution-derived receipt artifact

No asset version table, transform hash, embedding field, retrieval policy, publication state, wallet field, payment field, cascade-delete policy, or immutable-history claim belongs in this slice.

## Required future receipt fields

```text
issue=2
scope=LIL_PR_05_LINEAGE_EDGE_FK_CONSTRAINT
property=INSERT_LINEAGE_EDGE_WITH_NONEXISTENT_CHILD_IS_REJECTED
postgres_version=<observed>
constraint_name=lineage_edge_child_asset_fk
orphan_child_insert_exit=<observed>
valid_lineage_edge_insert_exit=<observed>
asset_migration_sha256=<observed>
lineage_migration_sha256=<observed>
negative_fixture_sha256=<observed>
positive_fixture_sha256=<observed>
error_log_sha256=<observed>
receipt_file_sha256=<observed>
artifact_digest=<observed>
authority=false
conclusion=<observed>
```

## Exit semantics

A constitutional pass requires PostgreSQL to reject the orphan-child edge while accepting the valid edge, with the CI workflow itself completing successfully after checking both outcomes.

```text
ORPHAN_CHILD_INSERT_EXIT != 0
VALID_LINEAGE_EDGE_INSERT_EXIT = 0
WORKFLOW_EXIT = 0
```

A missing parent migration, database startup failure, migration failure, absent `psql`, fixture syntax error, or harness failure is not evidence of foreign-key enforcement.

## Explicit non-claims

This scope does not claim:

- complete lineage integrity
- parent foreign-key enforcement unless separately tested
- cycle prevention
- immutable lineage
- cascade behavior correctness
- version-level provenance
- production database readiness
- retrieval correctness
- deterministic transforms
- secure agents
- end-to-end governance

## Governance boundaries

```text
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
NO_SILENT_PROMOTION = TRUE
B20_REQUIRED = FALSE
```

## Promotion rule

`LIL-PR-05` may move from `DEFINED` to `WITNESSED` only after a separate implementation step produces an observed PostgreSQL CI run where the orphan-child lineage edge is rejected, the valid lineage edge is accepted, and the resulting receipt artifact is independently inspected.

No migration, SQL fixture, workflow modification, foreign key, database execution, or receipt is included in this scope document.
