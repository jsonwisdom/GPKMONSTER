# GPKMONSTER — Quad × Quad Onion Audit v1

## Purpose

Define a repository-native reverse-replay audit that tests sixteen independent proof edges without depending on any website, storefront, hosted login, external domain, or third-party narrative.

```text
AUDIT_ROOT = GPKMONSTER
AUDIT_MODEL = QUAD_X_QUAD_ONION
EDGE_COUNT = 16
EXTERNAL_WEBSITE_DEPENDENCY = FALSE
AUTHORITY_CREATED = FALSE
```

## Governing law

```text
PASS(edge_n) != PASS(edge_n+1)
OBSERVED != VERIFIED
IDENTITY != AUTHORITY
SOURCE != BUILD
BUILD != PACKAGE
PACKAGE != RECEIPT
RECEIPT != PROMOTION
PROMOTION != AUTHORITY
```

No edge inherits truth from an adjacent edge. Every promotion requires its own evidence.

## Onion A — Source Integrity

1. repository path exists
2. branch/ref is explicit
3. commit SHA is explicit
4. source bytes/hash are reproducible

## Onion B — Execution Integrity

5. local operator command is explicit
6. runtime/environment is explicit
7. replay completes deterministically
8. replay output hash is stable across repeated runs

## Onion C — Artifact Integrity

9. output package exists
10. package is non-empty
11. ZIP64 / unsupported packaging fails closed
12. package manifest binds expected files and hashes

## Onion D — Continuity / Receipt Integrity

13. continuity mirror is independently observed
14. receipt binds source, execution, and artifact state
15. reverse replay reaches the same justified state
16. no authority, mint, publish, merge, or promotion is inferred without a separate explicit edge

## Quadratic replay

Each onion is audited against every other onion. A valid audit therefore checks both the sixteen primary edges and their cross-boundary relationships:

```text
SOURCE -> EXECUTION
SOURCE -> ARTIFACT
SOURCE -> RECEIPT
EXECUTION -> SOURCE
EXECUTION -> ARTIFACT
EXECUTION -> RECEIPT
ARTIFACT -> SOURCE
ARTIFACT -> EXECUTION
ARTIFACT -> RECEIPT
RECEIPT -> SOURCE
RECEIPT -> EXECUTION
RECEIPT -> ARTIFACT
```

Cross-boundary consistency does not collapse the primary edges. It only proves that two independently established states agree.

## Fail-closed states

```text
MISSING_SOURCE       = HOLD
AMBIGUOUS_REF        = HOLD
NONDETERMINISTIC_RUN = HOLD
EMPTY_ARTIFACT       = FAIL
ZIP64_REQUIRED       = FAIL
HASH_MISMATCH        = FAIL
MISSING_RECEIPT      = HOLD
SCOPE_INFLATION      = FAIL
AUTHORITY_INFERENCE  = FAIL
```

## Reverse replay rule

Reverse replay starts from the receipt/artifact boundary and walks backward to source. It may confirm continuity but may never invent a missing forward edge.

```text
RECEIPT
<- ARTIFACT
<- EXECUTION
<- SOURCE
```

A successful reverse replay means only:

```text
REPLAY_SURVIVED = TRUE
```

It does not mean:

```text
MERGE = TRUE
PUBLISH = TRUE
MINT = TRUE
AUTHORITY = TRUE
```

## Scope lock

This audit is intentionally independent of websites, storefronts, hosted identity providers, social platforms, registrars, or external corporate authentication systems. Those may be tested elsewhere, but they are not prerequisites for GPKMONSTER truth.

```text
GPKMONSTER_TRUTH = REPO_NATIVE + REPLAYABLE + RECEIPTED
WEBSITE_STATE = OUT_OF_SCOPE
EXTERNAL_ACCOUNT_STATE = OUT_OF_SCOPE
```
