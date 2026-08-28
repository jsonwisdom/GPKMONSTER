---
name: gpk-boxd-render-standard
description: Box D pre-render and readback guard for original retro gross-out satirical trading cards. Prevents generic gross-out output from being promoted as a successful institutional satire render.
---

# GPK Box D Render Standard

SPEC_ID: BOX_D_GPK_RENDER_GUARD_V1
AUTHOR: Jay
ROLE: PRE_RENDER_AND_PRE_CANON_QUALITY_GATE
AUTHORITY_CREATED: false
SILENT_MUTATION: forbidden
FAKE_GREEN: forbidden
TOPPS_RIGHTS: NOT_ASSERTED
PASS_IS_LICENSE: false

## Trigger

Apply this skill when a request asks for a GPK-like legal, civic, institutional, or gross-out satirical trading card, or when an existing card is being evaluated for promotion into the series.

The model-facing style target is always described generically as an **original retro gross-out satirical trading card**. Do not use `Garbage Pail Kids` or `Topps` as a generation-style instruction.

## Lineage

Receipt Ricky -> Box D preflight -> Renderer -> Box D readback -> Canon Carrie -> Lore Larry -> Press Patty

Correction lane:

Override Ollie -> corrected renderer input -> Box D again

No failed artifact is silently replaced. Corrections are append-only objects.

## Verdict precedence

REJECT > CONFLICT > DELTA > HOLD > PASS

- REJECT: request violates a hard boundary or attempts false provenance/rights claims.
- CONFLICT: supplied facts, citations, labels, or benchmark bindings contradict each other.
- DELTA: the render exists but fails one or more required quality gates.
- HOLD: required content, mechanism, citation-vs-fiction decision, or reference input is unresolved.
- PASS: all required gates are satisfied for the scoped render only.

PASS does not create legal authority, ownership, provenance, canon outside this series, or a license from any third party.

## D1 — One-second thesis

The card must communicate one dominant victim/character, one institutional mechanism, and one predicament within a glance. The face must carry the emotional holding: panic, delight, guilt, menace, shock, gloat, or another specific readable state. Generic AI smile = DELTA.

## D2 — Gross + clever

The gross-out element must translate the institutional mechanism. Slime, pus, shock, broken objects, bodily distortion, food, smoke, impact, or mess cannot exist as decoration alone.

**Hard gate:** If the institutional mechanism can be removed and the picture still works as generic gross-out art, Box D returns DELTA.

## D3 — Institution becomes a physical verb

Abstract procedure must become a diegetic object that acts on the body or environment: crushes, floods, punches, tapes shut, drains, burns, buries, inflates, splits, traps, or otherwise performs the doctrine.

Floating labels are not mechanisms. A statute number or doctrine name with no physical job = DELTA.

## D4 — Name-first comedy

The title is the thesis. It must be short, memorable, pronounceable, and do conceptual work before the viewer reads the props. Generic labels such as `Legal Card #4` fail.

## D5 — Physical card language

The composition must read as a collectible sticker/trading card rather than a generic poster:

- dominant top title treatment
- distressed/aged print surface
- imperfect physical-stock feel
- coherent border/edition language
- one main scene, not a collage
- secondary bottom punchline

The visual contract is defined in `references/visual-contract.md`.

## D6 — Props as verbs; one card, one doctrine

Every major prop must advance the joke. Paperwork, devices, gavels, drawers, phones, signs, food, clothing, or evidence must *do* something.

One card carries one primary doctrine/mechanism. Do not blend unrelated statutes, jurisdictions, or sister doctrines into a doctrine smoothie. Extra doctrine belongs in another card or remains HOLD.

## D7 — Text integrity and rights boundary

Requested words must be legible and spelled correctly. Legal citations must be accurate when presented as real; otherwise they must be clearly fictionalized or omitted. AI alphabet soup = DELTA.

Jay's rendering standard is separate from third-party intellectual-property rights. This skill does not assert ownership of Topps, Garbage Pail Kids, their marks, characters, trade dress, or licenses.

## Receipt Ricky preflight

Before rendering, answer four questions:

1. What one institutional verb is this card?
2. What physical object performs that verb?
3. What pun-name/title is shorter than the doctrine?
4. What bottom caption rules on what happened to the body?

If any answer is `general legal vibes`, HOLD. Do not render.

Receipt Ricky also records whether citations are real, fictional, or intentionally omitted.

## Box D readback

After rendering, inspect the actual artifact rather than the prompt. Score D1-D7 against the rendered image. Prompt compliance is not assumed from intent.

Automatic DELTA examples include:

- generic political poster
- generic comic-book art
- photoreal subject plus slime
- random paperwork collage
- unreadable typography
- broken anatomy that obscures the gag
- meaningless labels
- missing central institutional joke
- missing effective title
- missing bottom punchline
- style without narrative
- floating citation wallpaper
- multiple doctrines collapsed into one scene

## Consumer contract

`jsonwisdom/GPKMONSTER` is the standard home.

`jsonwisdom/JOY` may consume this standard for its scoped creative lane, but JOY does not own or redefine this specification. Any JOY production status, family membrane, or promotion gate remains separate from Box D's quality verdict.

Historical Google Drive material and benchmark images remain separate objects and are never merged into this skill merely because they are references.

## Output receipt

Return at minimum:

```text
SPEC_ID=BOX_D_GPK_RENDER_GUARD_V1
OBJECT=<card/object id>
PREFLIGHT=PASS|HOLD|CONFLICT|REJECT
READBACK=PASS|DELTA|HOLD|CONFLICT|REJECT
FAILED_GATES=<none|D1,D2,...>
CANON_PROMOTION_ALLOWED=true|false
TOPPS_RIGHTS=NOT_ASSERTED
AUTHORITY_CREATED=false
```

Canon Carrie, Lore Larry, and Press Patty act only after Box D readback PASS. A PASS is scoped to the evaluated artifact and creates no external authority.