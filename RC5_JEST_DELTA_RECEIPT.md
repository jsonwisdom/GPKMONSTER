# GPKMONSTER Kernel RC5 Jest Delta Receipt

RC4 artifact SHA-256: `621db86e2eb3dad8024ab399f5376d7c3903e9b17acdf70aaac6e0d1123451f1`

Observed local Jest result on RC4:

- Manifest gate: PASS (22/22)
- npm install: PASS
- Jest exit code: 1
- Test suites: 2 failed, 2 passed, 4 total
- Tests executed: 1 failed, 8 passed, 9 total
- Test gate: DELTA

Observed defects:

1. Challenge targeting did not mark the expected reasoning step as challenged.
2. `canonicalization.test.ts` had unused imports and attempted to import `compareUtf8Bytes` from `src/canonical/index.ts` where it was not exported.

RC5 response:

- Align challenge reasoning artifact target with edge target.
- Export `compareUtf8Bytes` from canonical index.
- Remove unused canonicalization test imports.
- Remove the RC4 `as any` basis-points escape and type constants as `BasisPoints`.
- Bump kernel/package version to RC5.

RC5 local archive generated separately. RC5 tests are NOT RUN yet.

Authority: false
Master mutation: false
Merge authorization: false
