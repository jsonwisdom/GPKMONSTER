# Creative Business Governance

## Purpose

Govern the creative portion of the business as an independent system for producing, organizing, preserving, teaching with, licensing, and selling original art assets.

Topps is not part of this governance model. The business does not depend on Topps ownership, approval, sponsorship, licensing, branding, or infrastructure.

## Business hierarchy

```text
BUSINESS
└── IMAGE_RENDERING_SERVICE_FACTORY
    ├── PRODUCTION
    │   ├── concept intake
    │   ├── prompt compilation
    │   ├── image creation
    │   ├── lesson generation
    │   └── product packaging
    ├── AUTOMATION
    │   ├── validation
    │   ├── metadata generation
    │   ├── hashing
    │   ├── packaging
    │   └── publication handoff
    ├── DATABASE
    │   ├── art asset records
    │   ├── image links
    │   ├── lesson links
    │   ├── package links
    │   ├── licensing state
    │   └── provenance records
    └── ASSETS
        ├── original images
        ├── characters
        ├── lesson packs
        ├── coaching packs
        └── commercial digital packages
```

## Core classifications

Every creative item must be classified as one of:

- `CONCEPT`
- `PROMPT`
- `IMAGE`
- `CHARACTER`
- `LESSON`
- `COACHING_PACK`
- `PRODUCT_PACKAGE`
- `LICENSE`
- `PUBLICATION`

Every image is treated as both:

```text
ART = TRUE
ASSET = TRUE
POTENTIAL_VALUE = TRUE
```

Value is not assumed from existence alone. Value becomes observed only through a recorded sale, license, commission, appraisal, or documented internal valuation.

## Governance rules

1. The factory is the product root. No individual image or character may become the system root.
2. Automation must serve production. Production must not be distorted to satisfy infrastructure momentum.
3. The database is an index and evidence layer. It is not the creative authority.
4. Every asset record must link to its current image, metadata, lesson, package, and provenance where those exist.
5. Originality status, affiliation status, licensing status, and publication status must be explicit.
6. No outside brand is a constitutional dependency of the business.
7. No automated process may publish, sell, license, or delete an asset without the required human approval state.
8. A missing image, broken link, failed package, or failed validation must remain visible and must not be promoted as complete.
9. Asset value claims must distinguish asking price, sale price, licensed value, and unverified estimate.
10. Creative intent outranks local implementation momentum.

## Required asset states

```text
IDEA
DRAFT
RENDERED
REVIEWED
APPROVED
PACKAGED
PUBLISHED
LICENSED
SOLD
ARCHIVED
REJECTED
```

Allowed progression:

```text
IDEA → DRAFT → RENDERED → REVIEWED → APPROVED → PACKAGED → PUBLISHED
```

Commercial states may follow publication:

```text
PUBLISHED → LICENSED
PUBLISHED → SOLD
```

No automation may silently skip `REVIEWED` or `APPROVED`.

## Ownership and affiliation fields

Every asset record must include:

```text
creator
rights_holder
original_work
third_party_reference
official_affiliation
license_status
commercial_status
human_approved
authority
```

Default constitutional values:

```text
original_work = true
official_affiliation = false
human_approved = false
authority = false
```

## Value governance

Permitted value fields:

```text
asking_price
sale_price
license_fee
commission_fee
internal_estimate
currency
valuation_basis
valuation_date
```

Rules:

- `asking_price` is not a sale.
- `internal_estimate` is not market value.
- `sale_price` requires an observed completed sale.
- `license_fee` requires an observed license agreement or payment record.
- No speculative value may be presented as realized revenue.

## Human control

Human approval is required for:

- final image approval
- public publication
- commercial listing
- licensing terms
- price approval
- deletion
- major revision of an existing asset

## Constitutional state

```text
CREATIVE_BUSINESS = INDEPENDENT
TOPPS_DEPENDENCY = FALSE
FACTORY_ROOT = IMAGE_RENDERING_SERVICE_FACTORY
PRODUCTION = AUTOMATABLE
DATABASE = REQUIRED_FOR_INDEXING_AND_LINKAGE
IMAGE = ART_AND_ASSET
VALUE = OBSERVED_OR_EXPLICITLY_ESTIMATED
HUMAN_APPROVAL = REQUIRED_FOR_PUBLICATION_AND_COMMERCE
AUTHORITY = FALSE
```
