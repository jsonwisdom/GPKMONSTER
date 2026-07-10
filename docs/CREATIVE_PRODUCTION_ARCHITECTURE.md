# Creative Production Architecture

## System flow

```text
CREATIVE_INTAKE
  → PRODUCTION_QUEUE
  → AUTOMATED_RENDER_PACKAGE
  → HUMAN_REVIEW
  → ART_ASSET_DATABASE
  → PUBLICATION_OR_STORE
```

## Production

Production owns the transformation from idea to finished package:

```text
concept
prompt
rendered image
lesson
metadata
commercial package
```

Production may be automated, but no automated output becomes publicly approved merely because a workflow completed.

## Automation

Automation may:

- validate the render brief
- apply the standing creative constitution
- compile the render prompt
- generate lesson and coaching material
- generate metadata
- hash files
- create ZIP packages
- prepare database records
- verify links
- prepare publication handoff

Automation may not independently:

- claim ownership
- approve final art
- approve pricing
- publish publicly
- enter a license agreement
- mark an item sold
- delete an asset

## Database

The database is the searchable business index for creative production.

Each art asset record links to the relevant:

```text
image
render prompt
metadata
lesson
product package
provenance receipt
storefront listing
```

The database records facts and states. It does not decide whether art is good, valuable, lawful, or commercially successful.

## Art assets

An image may simultaneously be:

```text
ART
BUSINESS_ASSET
EDUCATIONAL_MEDIA
COACHING_MEDIA
COMMERCIAL_PRODUCT_COMPONENT
```

These classifications do not require an outside brand relationship.

## Value

Value is recorded by evidence class:

```text
ASKING_PRICE = OFFER
SALE_PRICE = OBSERVED_TRANSACTION
LICENSE_FEE = OBSERVED_LICENSE_VALUE
INTERNAL_ESTIMATE = NON-MARKET ESTIMATE
COMMISSION_FEE = OBSERVED_SERVICE PRICE
```

No estimated or listed value may be silently promoted to realized revenue.

## Independent business boundary

```text
TOPPS_ROLE = NONE
TOPPS_DEPENDENCY = FALSE
TOPPS_APPROVAL_REQUIRED = FALSE
EXTERNAL_BRAND_AFFILIATION = FALSE
ORIGINAL_CREATIVE_BUSINESS = TRUE
```

References to outside culture, products, or companies may exist in individual commentary or parody works, but no outside company governs the factory, production system, database, ownership records, pricing, or asset lifecycle.

## Current implementation boundary

```text
PRODUCTION_PACKAGE_AUTOMATION = PRESENT_IN_BRANCH
ART_ASSET_RECORD_SCHEMA = PRESENT_IN_BRANCH
LIVE_DATABASE = NOT_YET_IMPLEMENTED
PUBLICATION_AUTOMATION = NOT_YET_IMPLEMENTED
PAYMENT_AUTOMATION = NOT_YET_IMPLEMENTED
HUMAN_APPROVAL = REQUIRED
AUTHORITY = FALSE
```
