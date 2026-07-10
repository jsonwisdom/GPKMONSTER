# LIL-PR-06 Receipt Template

This file is a template only. It is not an execution receipt and does not establish parent foreign-key enforcement.

```text
issue=2
scope=LIL_PR_06_LINEAGE_PARENT_FK_CONSTRAINT
property=INSERT_LINEAGE_EDGE_WITH_NONEXISTENT_PARENT_IS_REJECTED
workflow_run_id=<observed>
workflow_run_url=<observed>
job=lineage_parent_fk_gate
postgres_version=<observed>
constraint_name=lineage_edge_parent_asset_fk
orphan_parent_insert_exit=<observed>
valid_parent_edge_insert_exit=<observed>
asset_migration_sha256=<observed>
lineage_migration_sha256=<observed>
parent_fk_migration_sha256=<observed>
negative_fixture_sha256=<observed>
positive_fixture_sha256=<observed>
error_log_sha256=<observed>
artifact_digest=<observed>
receipt_file_sha256=<observed>
authority=false
conclusion=<observed>
```

## Interpretation boundary

A passing receipt proves only that the tested PostgreSQL instance rejected the committed lineage edge whose `parent_asset_id` was absent under `lineage_edge_parent_asset_fk`, and accepted the committed positive control.

It does not prove cycle prevention, immutable lineage, complete relational integrity, production readiness, or end-to-end governance.
