# LIL-PR-02 Receipt Template

This file is a template only. It is not an execution receipt and does not establish enforcement.

```text
issue=2
scope=LIL_PR_02_LINEAGE_POLICY_NEGATIVE_GATE
property=DERIVED_ASSET_WITH_MISSING_PARENT_IS_REJECTED
workflow_run_id=<observed>
workflow_run_url=<observed>
job=lineage_negative_gate
missing_parent_result=<observed>
valid_parent_result=<observed>
deny_count=<observed>
negative_fixture_sha256=<observed>
policy_sha256=<observed>
artifact_digest=<observed>
receipt_file_sha256=<observed>
authority=false
conclusion=<observed>
```

## Interpretation boundary

A passing receipt proves only that the OPA policy denied the committed missing-parent fixture and allowed the positive control under the tested policy version.

It does not prove database constraints, datastore integrity, tamper-proof lineage, complete provenance, or end-to-end asset governance.
