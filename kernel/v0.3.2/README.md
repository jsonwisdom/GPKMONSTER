# GPKMONSTER Kernel v0.3.2-RC3

Constitutional, integer-native, append-only evidence engine.

## Constitutional Invariants

1. **HASH ≠ PART OF ITS OWN PREIMAGE** — receiptHash appended after hashing
2. **DISPLAY TIME ≠ HASHED TIME** — timestamps in envelope, not payload
3. **INTEGER CONFIDENCE** — all values are BasisPoints (0..10000)
4. **SET ORDER ≠ EVENT ORDER** — semantic array ordering
5. **RAW ≠ NORMALIZED** — raw hash in payload, normalized in envelope
6. **CANONICAL = SEALED** — no shadow payload
7. **NO FLOATS ANYWHERE** — integer arithmetic throughout

## Build

```bash
npm install
npm run build
npm test
```

Branch

feature/kernel-v0.3.2 — master remains untouched.
