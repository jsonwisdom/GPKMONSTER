import {
  canonicalizeObject,
compareUtf8Bytes,
} from "../../src/canonical/index";
import { issueVerdict } from "../../src/evaluator/index";
import { getStandardInputs } from "../fixtures/standard-inputs";

describe("Canonicalization", () => {
  test("UTF-8 byte comparison is deterministic", () => {
    expect(compareUtf8Bytes("a", "b")).toBeLessThan(0);
    expect(compareUtf8Bytes("b", "a")).toBeGreaterThan(0);
    expect(compareUtf8Bytes("a", "a")).toBe(0);
  });

  test("canonicalizeObject sorts keys by UTF-8 bytes", () => {
    const input = { z: 1, a: 2, b: 3 };
    const result = canonicalizeObject(input) as Record<string, number>;
    expect(Object.keys(result)).toEqual(["a", "b", "z"]);
  });

  test("canonicalizeObject preserves array order", () => {
    const input = { arr: [3, 1, 2] };
    const result = canonicalizeObject(input) as { arr: number[] };
    expect(result.arr).toEqual([3, 1, 2]);
  });

  test("canonicalizeArtifacts sorts by id", async () => {
    const inputs = getStandardInputs();
    const result = await issueVerdict(inputs);
    const ids = result.payload.artifacts.map((a) => a.id);
    expect(ids).toEqual([...ids].sort());
  });

  test("canonicalizeNodes sorts by nodeId", async () => {
    const inputs = getStandardInputs();
    const result = await issueVerdict(inputs);
    const ids = result.payload.evidenceGraph.nodes.map((n) => n.nodeId);
    expect(ids).toEqual([...ids].sort());
  });
});
