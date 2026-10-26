# Seymour — Garbage Press End-to-End Production Contract v2
SPEC_ID: SEYMOUR_GARBAGE_PRESS_E2E_V2
DATE: 2026-10-25
STATUS: PROPOSED / NOT CANON
OWNER_APPROVAL: JASON_ONLY
SOURCE: Existing Box D standard + approved widescreen/X and delivery corrections.

## One-shot trigger
"Run it through the Garbage Press" means execute the full workflow in this same request, not merely narrate the intended workflow. Do not ask for already known requirements. One request = one finished candidate, no silent batch generation. A tool inability produces an explicit truthful HOLD, not a fabricated success.

## Stage contract
0. Discover/replay active canon and card-specific instructions; resolve scope: new X widescreen edition 16:9, while archival TriggerDeck 3:4 canon remains unchanged. No fake TD IDs.
1. Source: fetch/check original or reputable reporting, event date, release state, and provenance. Preserve source URLs/time. Treat future outcomes as unconfirmed.
2. Math: independently validate figures when applicable; do not claim Wolfram validation without a returned calculation.
3. Editorial: develop one original, funny, intelligible headline, one character, one mechanism-driven gross-out gag, caption; avoid fake attributed quotes and implied real-world official conduct. Write X reply <=280 characters FIRST and label satire.
4. Box D preflight: apply D1-D7 in skills/gpk-boxd-render-standard/SKILL.md BEFORE render; mechanism must physically enact the joke. Preflight HOLD on uncertainty.
5. Render: call available image generation during the same turn, output original 16:9 PNG suitable for X; actually display generated art. Prompt or textual 'rendering' announcement is not artifact.
6. Box D readback: inspect the EXACT output image for aspect/dimensions, title, borders, typography, punctuation, logos, satire flag, anatomy and number of limbs/fingers, scene continuity, dominant readable gag, dates and facts. Not visible / uncertain is HOLD; defects DELTA. Correct iteratively without claiming PASS. Preserve correction history.
7. Artifact manifest: use filesystem only when available, verify file physically exists, can decode/open, measure exact dimensions, compute SHA-256, and record byte length. Never fabricate dimensions/hash/file path/URL.
8. Gate E DELIVERY: verify the EXACT linked downloadable copy matches the QA-approved bytes (hash and size). The screenshot/mockup/prompt is not delivery. No link unless exact path exists in active container. A valid local file is not evidence that the recipient's phone opened it. Delivery outcome PENDING until confirmed. Broken link=FAIL/HOLD, regenerate a new working delivery candidate, then retest.
9. Seymour reverse replay: SOURCE -> MATH -> EDITORIAL -> ART -> BOX_D -> MANIFEST -> GATE_E -> SEYMOUR -> JASON. Separate CREATED, RENDERED, QA_PASSED, FILE_VERIFIED, LINK_ISSUED, CLIENT_RECEIVED, HUMAN_APPROVED, PUBLISHED. Never collapse statuses.
10. Jason sees: reply first, actual image and tested download link if available, succinct QA results, precise blockers. Jason alone authorizes public release; no auto-post, auto-canon, auto-mint, or claim of public distribution.

## Hard failure rules
- A promise to render with no actual image: DELIVERY_FAIL.
- Download 'file not found': DELIVERY_FAIL regardless of visual quality or approval.
- False claims of completed QA, dimensions, byte hash, opened file, account access or publication: REJECT/CONFLICT.
- Inaccessible fingers, mangled caption, wrong 16:9 X format, failed focal joke: DELTA/HOLD.
- Final approval does not override open safety, factual or technical QA gaps; present them transparently.
- Release occurs only after human approval AND required gates pass; distinguish approval granted from upload posted.
- Do not assert ownership or license of Topps/Garbage Pail Kids marks/trade dress. Use original retro gross-out satire.

## Receipt (required)
SPEC_ID=SEYMOUR_GARBAGE_PRESS_E2E_V2
SOURCE_STATUS=...
TWEET_CHAR_COUNT=...
BOX_D_PREFLIGHT=...
RENDER_STATUS=...
BOX_D_READBACK=...
DIMENSIONS=...
SHA256=...
FILE_OPEN_TEST=...
EXACT_LINK_EXISTS=...
CLIENT_RECEIVED=UNKNOWN|CONFIRMED|FAILED
JASON_APPROVAL=PENDING|APPROVED|REJECTED
PUBLICATION=NOT_POSTED|POSTED_VERIFIED
FINAL_STATE=HOLD|DELTA|READY_FOR_HUMAN|PUBLISHED_VERIFIED

RENDERED != VERIFIED != DELIVERED != ACCEPTED != PUBLISHED.
No PASS without measured evidence; verdict precedence REJECT > CONFLICT > DELTA > HOLD > PASS.
