import { issueVerdict } from "../../src/evaluator/index";
import { getStandardInputs } from "../fixtures/standard-inputs";

describe("Deep Freeze", () => {
  test("SealedReceipt is immutable", async () => {
    const inputs = getStandardInputs();
    const result = await issueVerdict(inputs);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.payload)).toBe(true);
    expect(Object.isFrozen(result.envelope)).toBe(true);
    expect(Object.isFrozen(result.payload.artifacts)).toBe(true);
    expect(Object.isFrozen(result.payload.reasoning)).toBe(true);

    expect(() => {
      (result as any).payload = {};
    }).toThrow();
  });

  test("receiptHash is appended, not part of payload", async () => {
    const inputs = getStandardInputs();
    const result = await issueVerdict(inputs);
    expect((result.payload as any).receiptHash).toBeUndefined();
    expect(result.receiptHash).toBeDefined();
    expect(result.receiptHash.length).toBe(64);
  });
});
