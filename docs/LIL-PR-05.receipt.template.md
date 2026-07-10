# LIL-PR-05 Receipt Template

This file is a template only. It is not an execution receipt and does not establish foreign-key enforcement.

```text
issue=2
scope=LIL_PR_05_LINEAGE_EDGE_FK_CONSTRAINT
property=INSERT_LINEAGE_EDGE_WITH_NONEXISTENT_CHILD_IS_REJECTED
workflow_run_id=<observed>
workflow_run_url=<observed>
job=lineage_fk_gate
postgres_version=<observed>
constraint_name=lineage_edge_child_asset_fk
orphan_child_insert_exit=<observed>
valid_lineage_edge_insert_exit=<observed>
asset_migration_sha256=<observed>
lineage_migration_sha256=<observed>
negative_fixture_sha256=<observed>
positive_fixture_sha256=<observed>
error_log_sha256=<observed>
artifact_digest=<observed>
receipt_file_sha256=<observed>
authority=false
conclusion=<observed>
```

## Predecessor receipts

- LIL-PR-01: `0d80d8a9b1eedf687675c63722e0bb9124b232509908adc959959d5d4e3dc731`
- LIL-PR-02: `51e9ddf50b05b626c7996b2a42f4abd01c2202814e7ee4921c297240e75de029`
- LIL-PR-03: `661743aad6d7447c1648ebee7681ca9161bf69b537e4618b2775f031b68de197`
- LIL-PR-04: `33ee54dda4137265166d410828ce4d5c2a3bbf089f2d7e0dbf9262d2d4cfd4f7`

## Interpretation boundary

A passing receipt proves only that the tested PostgreSQL instance rejected the committed orphan-child lineage edge under `lineage_edge_child_asset_fk` and accepted the committed positive control.

It does not prove complete lineage integrity, parent foreign-key enforcement, cycle prevention, immutable history, production readiness, or end-to-end governance.
