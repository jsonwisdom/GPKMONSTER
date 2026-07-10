# LIL-PR-03 Receipt Template

This file is a template only. It is not an execution receipt and does not establish schema enforcement.

```text
issue=2
scope=LIL_PR_03_SCHEMA_VALIDATION_ENFORCEMENT
property=OPERATION_INTENT_MISSING_REQUIRED_FIELD_IS_REJECTED
workflow_run_id=<observed>
workflow_run_url=<observed>
job=schema_validation_gate
validator=ajv
validator_version=<observed>
negative_exit_code=<observed>
positive_exit_code=<observed>
workflow_conclusion=<observed>
schema_sha256=<observed>
negative_fixture_sha256=<observed>
positive_fixture_sha256=<observed>
validator_script_sha256=<observed>
artifact_digest=<observed>
receipt_file_sha256=<observed>
authority=false
conclusion=<observed>
```

## Interpretation boundary

A passing receipt proves only that the pinned AJV validator rejected the committed operation intent missing `asset_id`, accepted the committed positive control, and that the harness distinguished invalid input from execution errors.

It does not prove schema completeness, semantic trustworthiness, OPA integration, database integrity, or end-to-end governance.
