# LIL-PR-04 Receipt Template

This file is a template only. It is not an execution receipt and does not establish persistence enforcement.

```text
issue=2
scope=LIL_PR_04_ASSET_TABLE_DDL_CONSTRAINT
property=INSERT_ASSET_WITH_INVALID_ID_FORMAT_IS_REJECTED
workflow_run_id=<observed>
workflow_run_url=<observed>
job=asset_ddl_gate
postgres_version=<observed>
constraint_name=asset_id_format
invalid_asset_insert_exit=<observed>
valid_asset_insert_exit=<observed>
migration_sha256=<observed>
negative_fixture_sha256=<observed>
positive_fixture_sha256=<observed>
error_log_sha256=<observed>
artifact_digest=<observed>
receipt_file_sha256=<observed>
authority=false
conclusion=<observed>
```

## Interpretation boundary

A passing receipt proves only that the tested PostgreSQL instance applied the committed migration, rejected the committed invalid identifier under `asset_id_format`, and accepted the committed valid identifier.

It does not prove schema completeness, production readiness, lineage storage, tamper-proof persistence, retrieval correctness, or end-to-end governance.
