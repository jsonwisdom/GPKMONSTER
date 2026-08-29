import { issueVerdict } from "../../src/evaluator/index";
import { analyzeEvidence } from "../../src/evidence/analyzer";
import { canonicalizeMetadata } from "../../src/canonical/metadata";
import { Claim, ArtifactInput, VerdictInputs } from "../../src/kernel/types";

/**
 * Binding regressions. RED is the receipt that current kernel
 * does not close these surfaces. Do not edit src/ to make these green
 * in this commit.
 */

function baseClaim(): Claim {
  return {
    id: "COL-001",
    actor: "Probe",
    action: "Collision mechanic vector",
    timestamp: "2026-08-29T15:00:00Z",
    context: "kernel collision tests",
  };
}

function artifact(
  id: string,
  content: string,
  metadata: Record<string, unknown> = {}
): ArtifactInput {
  return {
    id,
    type: "document",
    source: "probe",
    provenance: "UNKNOWN",
    content,
    metadata,
  };
}

function inputs(arts: ArtifactInput[]): VerdictInputs {
  return {
    roundId: "COL-001",
    claim: baseClaim(),
    artifacts: arts,
    seed: 1,
    observationBoundary: "all_at_once",
  };
}

describe("Collision mechanics — metadata drop / off-ledger cause", () => {
  test("non-integer metadata.amount remains in canonical metadata (MUST FAIL today)", () => {
    const canonical = canonicalizeMetadata({ amount: 14.5, location: "Chicago" });
    expect(canonical.amount).toBeDefined();
  });

  test("analyzer must not read metadata fields that canonicalizeMetadata drops (MUST FAIL today)", () => {
    const rawMeta = { amount: 14.5 };
    const canonical = canonicalizeMetadata(rawMeta);
    const withDropped = analyzeEvidence(
      [artifact("A", "plain memo", rawMeta), artifact("B", "plain memo two", { amount: 20 })],
      baseClaim()
    );
    const withoutDropped = analyzeEvidence(
      [artifact("A", "plain memo", canonical), artifact("B", "plain memo two", { amount: 20 })],
      baseClaim()
    );
    expect(withDropped.graph.edges).toEqual(withoutDropped.graph.edges);
  });

  test("same raw content + same hashed metadata => same receiptHash (MUST FAIL today)", async () => {
    const left = await issueVerdict(
      inputs([
        artifact("A", "plain memo", { amount: 14.5 }),
        artifact("B", "plain memo two", { amount: 20 }),
      ])
    );
    const right = await issueVerdict(
      inputs([
        artifact("A", "plain memo", {}),
        artifact("B", "plain memo two", { amount: 20 }),
      ])
    );

    const leftMeta = left.payload.artifacts.find((a) => a.id === "A")?.metadata;
    const rightMeta = right.payload.artifacts.find((a) => a.id === "A")?.metadata;
    expect(leftMeta).toEqual(rightMeta);
    expect(left.payload.artifacts.find((a) => a.id === "A")?.rawContentSha256).toBe(
      right.payload.artifacts.find((a) => a.id === "A")?.rawContentSha256
    );
    expect(left.receiptHash).toBe(right.receiptHash);
  });
});

describe("Collision mechanics — edge-id encounter order", () => {
  test("contradict edgeId is stable across input-array order (MUST FAIL today)", async () => {
    const a = artifact("A1", "receipt in Chicago", { location: "Chicago" });
    const b = artifact("A2", "GPS 40.7128", { location: "NYC" });

    const forward = await issueVerdict(inputs([a, b]));
    const reverse = await issueVerdict(inputs([b, a]));

    const forwardEdge = forward.payload.evidenceGraph.edges.find(
      (e) =>
        (e.sourceId === "node-A1" && e.targetId === "node-A2") ||
        (e.sourceId === "node-A2" && e.targetId === "node-A1")
    );
    const reverseEdge = reverse.payload.evidenceGraph.edges.find(
      (e) =>
        (e.sourceId === "node-A1" && e.targetId === "node-A2") ||
        (e.sourceId === "node-A2" && e.targetId === "node-A1")
    );

    expect(forwardEdge).toBeDefined();
    expect(reverseEdge).toBeDefined();
    expect(forwardEdge!.edgeId).toBe(reverseEdge!.edgeId);
    expect(forwardEdge!.edgeId).toBe("edge-A1-A2");
  });

  test("challenge edge-A1-A2 hits after swapped artifact order (MUST FAIL today)", async () => {
    const a = artifact("A1", "receipt in Chicago", { location: "Chicago" });
    const b = artifact("A2", "GPS 40.7128", { location: "NYC" });
    const swapped = await issueVerdict({
      ...inputs([b, a]),
      challenge: {
        kind: "device_person_gap",
        edgeId: "edge-A1-A2",
        artifactId: "A2",
        reasoning: "GPS only proves device location",
        proposedAlternative: "Device could be elsewhere",
      },
    });

    expect(swapped.payload.verdict.reasoningSummary.includes("challenge rejected")).toBe(false);
    const hit = swapped.payload.reasoning.find((step) => step.edgeId === "edge-A1-A2");
    expect(hit?.challenged).toBe(true);
  });
});

describe("Collision mechanics — domain prefix absence", () => {
  test("receiptHash is domain-separated from artifact hashes (MUST FAIL today)", async () => {
    const sealed = await issueVerdict(
      inputs([artifact("A", "hello domain probe")])
    );
    const raw = sealed.payload.artifacts[0].rawContentSha256;
    expect(sealed.receiptHash.startsWith("receipt:")).toBe(true);
    expect(raw.startsWith("artifact:")).toBe(true);
    expect(sealed.receiptHash).not.toEqual(raw);
  });
});
