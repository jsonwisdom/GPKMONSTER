# LIL-PR-03 Scope — Schema Validation Enforcement

## Constitutional anchor

- Repository: `jsonwisdom/GPKMONSTER`
- Issue: `#2` — Living Image Ledger MVP
- Predecessor: `LIL-PR-02`
- Predecessor head SHA: `65b8a60338f97c4f046cd89750a64a7aaef1f3aa`
- Predecessor receipt SHA-256: `51e9ddf50b05b626c7996b2a42f4abd01c2202814e7ee4921c297240e75de029`

## Selected scope

`LIL-PR-03_SCHEMA_VALIDATION_ENFORCEMENT`

## Single property to prove

An operation intent that omits the required `asset_id` field is rejected by the committed `operation_intent` JSON Schema.

```text
OPERATION_INTENT_MISSING_ASSET_ID = REJECT
```

## Planned negative fixture

`tests/fixtures/invalid/missing_asset_id.json`

The fixture will otherwise satisfy the minimum operation-intent contract while intentionally omitting `asset_id`.

Expected result:

```text
missing_asset_id_result = REJECT
```

## Planned positive control

A conforming operation intent containing all required fields, including `asset_id`, must validate successfully.

Expected result:

```text
complete_operation_intent_result = ACCEPT
```

## Planned validation surface

The implementation slice may introduce only the minimum required surfaces to witness this property:

- one invalid operation-intent fixture
- one valid operation-intent control fixture, if the existing corpus does not contain one
- a pinned JSON Schema validator invocation in CI
- an execution-derived receipt artifact
- explicit capture of validator version, schema hash, fixture hash, and observed exit semantics

AJV is the preferred validator for this scope. OPA policy integration is not required to prove the JSON Schema property and must not be claimed unless separately implemented and witnessed.

## Required future receipt fields

```text
issue=2
scope=LIL_PR_03_SCHEMA_VALIDATION_ENFORCEMENT
property=OPERATION_INTENT_MISSING_REQUIRED_FIELD_IS_REJECTED
validator=ajv
validator_version=<observed>
missing_asset_id_result=REJECT
positive_control_result=ACCEPT
negative_exit_code=<observed>
positive_exit_code=<observed>
schema_sha256=<observed>
negative_fixture_sha256=<observed>
receipt_file_sha256=<observed>
artifact_digest=<observed>
authority=false
conclusion=<observed>
```

## Exit semantics

A constitutional pass requires the validator to reject the invalid fixture while the workflow itself exits successfully after verifying that rejection.

```text
INVALID_FIXTURE_VALIDATOR_EXIT != 0
POSITIVE_CONTROL_VALIDATOR_EXIT = 0
WORKFLOW_EXIT = 0
```

A workflow failure is not evidence of schema enforcement.

## Explicit non-claims

This scope does not claim:

- schema completeness
- semantic correctness of required fields
- OPA and JSON Schema equivalence
- database integrity
- complete provenance
- secure agents
- trustworthy retrieval
- end-to-end pipeline readiness

## Governance boundaries

```text
AUTHORITY = FALSE
NO_FAKE_GREEN = TRUE
NO_SILENT_PROMOTION = TRUE
B20_REQUIRED = FALSE
```

## Promotion rule

`LIL-PR-03` may move from `DEFINED` to `WITNESSED` only after an implementation PR produces an observed CI run where the invalid fixture is rejected, the positive control is accepted, the workflow exits successfully, and the resulting receipt artifact is independently inspected.

No fixture, validator integration, policy change, or CI implementation is included in this scope document.
