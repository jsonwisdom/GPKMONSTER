# GPKMONSTER — Garbage Pail Journalism Reverse Replay v1

## Mission

Turn a broken user-visible system into an evidence-first investigative story by replaying the failure backward from observable consequence to documented implementation contract.

```text
STYLE = GARBAGE_PAIL_JOURNALISM
METHOD = REVERSE_REPLAY
AUDIT_ROOT = GPKMONSTER
SATIRE_ALLOWED = TRUE
FABRICATION_ALLOWED = FALSE
UNVERIFIED_CULPABILITY = FALSE
AUTHORITY_CREATED = FALSE
```

## Core law

```text
HEADLINE != FINDING
SCREENSHOT != ROOT_CAUSE
DOCUMENTATION != IMPLEMENTATION
SUPPORT_SCRIPT != TECHNICAL_RECEIPT
CORRELATION != CULPABILITY
EMPLOYEE_ROLE != PERSONAL_FAULT
```

A story may be funny, grotesque, sharp, or embarrassing. The evidence boundary may not move for style.

## Reverse replay sequence

Start from the user's visible consequence and walk backward:

```text
PROJECT_BLOCKED
<- RESOURCE_ACCESS_FAILED
<- CONNECTOR_OR_SESSION_FAILED
<- AUTH_HANDOFF_FAILED
<- CREDENTIAL_DISCOVERY_OR_BINDING_FAILED
<- PUBLISHED_DEVELOPER_CONTRACT
<- IMPLEMENTATION_OWNER
<- CHANGE_HISTORY / VERSION / RELEASE
```

Each arrow is a separate proof obligation.

## The Garbage Pail Card

Every investigated failure gets one card with eight fields:

1. **CARD TITLE** — satirical name for the failure.
2. **THE GROSS PART** — what the user actually experienced.
3. **RECEIPT** — screenshot, log, hash, timestamp, response, or reproducible command.
4. **THE MANUAL** — primary developer documentation governing the edge.
5. **REPLAY** — exact steps that reproduce or fail to reproduce the behavior.
6. **MISMATCH** — documented behavior versus observed behavior.
7. **BURDEN HOLDER** — which system currently has the next unanswered technical question.
8. **VERDICT** — MATCH, MISMATCH, HOLD, or UNPROVEN.

## Documentation rails

For each vendor or platform, test four document classes:

```text
AUTHENTICATION
ACCOUNT / RELYING-PARTY BINDING
HANDOFF / CALLBACK / TOKEN EXCHANGE
RECOVERY / ERROR BEHAVIOR
```

Primary documentation is preferred. Secondary reporting may provide context but cannot replace the implementation contract.

## Journalism rules

### Rule 1 — Show the contradiction

Good investigative unit:

```text
DOCUMENT SAYS X
SYSTEM DID Y
RECEIPT SHOWS Z
STATUS = MISMATCH | HOLD
```

### Rule 2 — Name systems before people

```text
SYSTEM_OWNER = FAIR SUBJECT
NAMED_EMPLOYEE = ONLY WHEN ROLE + DECISION + DOCUMENT ARE ESTABLISHED
```

Do not convert employment history, title, or association into culpability.

### Rule 3 — Follow money as a separate rail

Payment, subscription, card-network, merchant, processor, and platform access are independent edges.

```text
PAYMENT_ACCEPTED != SERVICE_WORKED
SERVICE_WORKED != AUTH_HANDOFF_WORKED
CARD_NETWORK != MERCHANT IMPLEMENTATION
```

### Rule 4 — Thirty-year replay requires dated receipts

Historical claims must be bound to contemporaneous records, archived documentation, litigation, regulator records, patents, standards, release notes, or other dated primary evidence.

```text
OLD_PATTERN_SIMILARITY != SAME_ACTOR
CORPORATE_LINEAGE != CONTINUOUS CULPABILITY
```

## Box D publication format

```text
CARD
TITLE:
DATE:
SYSTEMS:
USER IMPACT:
OBSERVED FAILURE:
PRIMARY DOCUMENT:
DOCUMENT CLAIM:
REPRODUCTION:
TECHNICAL MISMATCH:
NEXT BURDEN:
STATUS:
AUTHORITY_CREATED: FALSE
```

## Reverse-replay stopping rule

Stop when the evidence stops.

```text
NO RECEIPT = HOLD
NO PRIMARY DOCUMENT = HOLD
NO REPRODUCTION = HOLD
NO ROLE BINDING = DO NOT NAME PERSON
NO CAUSAL BINDING = DO NOT CLAIM CULPABILITY
```

## Editorial principle

Garbage Pail Journalism is not 'everybody is guilty.' It is:

> Make the system wear its own receipts.

The joke is presentation. The proof is the product.
