# GPKMONSTER five-package plan V1

Source rails: `jsonwisdom/jay-zora-portal@live-zora-ingestion`, a locally synced Drive export, and this GPKMONSTER branch.

1. `01_ZORA_CATALOG` — catalogs, exports, and inventory data.
2. `02_ZORA_MEDIA` — Drive-synced image/video originals only.
3. `03_RECEIPTS` — GitHub and Drive receipts, timelines, maps, and sums.
4. `04_KAREN11` — satire-labeled KAREN11 specifications and HOLD receipts; no rendered art is implied.
5. `05_POWERSHELL_HANDOFF` — configuration, policy, and build tools Jason runs locally.

Every archive uses sorted member names, a 1980-01-01 DOS timestamp, empty comments/extras, pinned DOS creator system, DEFLATE level 9, and `allowZip64=False`. Empty packages fail. ZIP64 extra `0x0001`, ZIP64 EOCD, ZIP64 locator, GPBF bit 3, and GPBF bit 13 fail verification.

Drive is a private input rail. The packager never uploads Drive content to GitHub. Output remains HOLD until Jason reviews the five SHA-256 values in PowerShell.
