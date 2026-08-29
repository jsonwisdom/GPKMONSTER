import { issueVerdict } from "../../src/evaluator/index";
import { getStandardInputs, getChallengeInputs } from "../fixtures/standard-inputs";

describe("Determinism", () => {
  test("same inputs → same receiptHash", async () => {
    const inputs = getStandardInputs();
    const result1 = await issueVerdict(inputs);
    const result2 = await issueVerdict(inputs);
    expect(result1.receiptHash).toBe(result2.receiptHash);
    expect(result1.payload.version).toBe(1);
    expect(result1.payload.parentReceiptHash).toBeNull();
    expect(result1.envelope.createdAt).not.toBe(result2.envelope.createdAt);
  });

  test("all payload numbers are safe integers", async () => {
    const inputs = getStandardInputs();
    const result = await issueVerdict(inputs);

    function checkSafeIntegers(obj: unknown, path: string): void {
      if (typeof obj === "number") {
        expect(Number.isSafeInteger(obj)).toBe(true);
        expect(obj).not.toBeNaN();
        expect(obj).not.toBe(Infinity);
        expect(obj).not.toBe(-Infinity);
        return;
      }
      if (obj === null || typeof obj !== "object") return;
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          checkSafeIntegers(obj[i], `${path}[${i}]`);
        }
        return;
      }
      for (const key of Object.keys(obj)) {
        checkSafeIntegers((obj as any)[key], `${path}.${key}`);
      }
    }

    checkSafeIntegers(result.payload, "payload");
  });

  test("challenge produces new version with parent link", async () => {
    const baseInputs = getStandardInputs();
    const v1 = await issueVerdict(baseInputs);

    const challengeInputs = getChallengeInputs();
    const v2 = await issueVerdict(challengeInputs, v1);

    expect(v2.payload.version).toBe(2);
    expect(v2.payload.parentReceiptHash).toBe(v1.receiptHash);
    expect(v2.receiptHash).not.toBe(v1.receiptHash);
  });

  test("challenge by edgeId targets the correct reasoning step", async () => {
    const inputs = getStandardInputs();
    const v1 = await issueVerdict(inputs);

    const targetEdge = v1.payload.evidenceGraph.edges.find(
      (e) => e.sourceId === "node-A1" && e.targetId === "node-A2"
    );
    expect(targetEdge).toBeDefined();

    const challengeInputs = {
      ...inputs,
      challenge: {
        kind: "device_person_gap" as const,
        edgeId: targetEdge!.edgeId,
        artifactId: "A2",
        reasoning: "GPS only proves device location",
        proposedAlternative: "Device could be elsewhere",
        timestamp: Date.now(),
      },
    };

    const v2 = await issueVerdict(challengeInputs, v1);
    expect(v2.payload.version).toBe(2);

    const challengedStep = v2.payload.reasoning.find(
      (step) => step.edgeId === targetEdge!.edgeId
    );
    expect(challengedStep?.challenged).toBe(true);
    expect(challengedStep?.challengeResult?.accepted).toBe(true);
  });
});
