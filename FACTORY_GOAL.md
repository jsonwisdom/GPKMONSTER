# Jason's Satirical Learning Image Factory — Product Goal

## Goal

Build a reusable factory that turns an original parody or satire concept into an organized, teachable, coachable, and sellable digital asset package.

The working creative inspiration may be described privately as "Jason's Garbage Pail Kids Factory," but the public product must use its own independent brand identity and must not imply Topps sponsorship or affiliation.

## Factory contract

```text
INPUT
  character concept
  visual joke
  lesson
  audience
  originality requirements
  rendered image

PROCESS
  apply standing satire constitution
  compile render prompt
  validate asset brief
  generate lesson sheet
  generate product metadata
  compute SHA-256 receipts
  create digital-sales ZIP

OUTPUT
  artwork
  render prompt
  render manifest
  lesson sheet
  metadata
  SHA256SUMS
  digital-sales ZIP
```

## Anti-drift architecture

```text
PRODUCT_ROOT = IMAGE_RENDERING_SERVICE_FACTORY
ASSET = DOWNSTREAM_INSTANCE
TEMPLATE = REUSABLE_FORMAT
OUTPUT = GENERATED_PACKAGE
```

Rules:

- No individual character may define the product root.
- No character name belongs in generic factory files.
- Generic factory code may consume asset briefs but may not depend on a specific asset.
- Asset branches may contain only asset-specific briefs, images, lessons, and overrides.
- Database work is out of scope unless a concrete factory requirement later proves it necessary.
- Rendering, organization, learning content, packaging, and sale readiness are the current priorities.

## Current MVP

The MVP accepts a completed image plus a generic JSON brief and produces a downloadable package. It does not yet call an external image-generation API or publish to a storefront.

```text
EXTERNAL_RENDER_API = NOT_IMPLEMENTED
AUTOMATIC_STOREFRONT_PUBLISHING = NOT_IMPLEMENTED
DIGITAL_PACKAGE_BUILD = IMPLEMENTED_IN_BRANCH
AUTHORITY = FALSE
```
