import { issueVerdict } from "../../src/evaluator/index";
import { analyzeEvidence } from "../../src/evidence/analyzer";
import { canonicalizeMetadata } from "../../src/canonical/metadata";
import { Claim, ArtifactInput, VerdictInputs } from "../../src/kernel/types";

/**
 * Collision mechanics — current constitution.
 * #2 and #4 are regression locks for repaired law bugs.
 * #1 #3 #5 #6 state existing law; they do not invent prefixes,
 * float retention, or guessed-edge contracts.
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
  test("#1 NO FLOATS: non-integer metadata.amount is dropped, not sealed", () => {
    const canonical = canonicalizeMetadata({ amount: 14.5, location: "Chicago" });
    expect(canonical.amount).toBeUndefined();
    expect(canonical.location).toBe("Chicago");
  });

  test("#2 analyzer consumes only canonical metadata (regression lock)", () => {
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

  test("#3 receiptHash binds sealed payload; dropped float is not a second preimage", async () => {
    const dropped = await issueVerdict(
      inputs([
        artifact("A", "plain memo", { amount: 14.5 }),
        artifact("B", "plain memo two", { amount: 20 }),
      ])
    );
    const omitted = await issueVerdict(
      inputs([
        artifact("A", "plain memo", {}),
        artifact("B", "plain memo two", { amount: 20 }),
      ])
    );
    const differentSeed = await issueVerdict({
      ...inputs([
        artifact("A", "plain memo", {}),
        artifact("B", "plain memo two", { amount: 20 }),
      ]),
      seed: 2,
    });

    expect(dropped.payload.artifacts.find((a) => a.id === "A")?.metadata.amount).toBeUndefined();
    expect(dropped.receiptHash).toBe(omitted.receiptHash);
    expect(differentSeed.receiptHash).not.toBe(omitted.receiptHash);
  });
});

describe("Collision mechanics — edge-id encounter order", () => {
  test("#4 contradict edgeId is UTF-8 pair-stable (regression lock)", async () => {
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

  test("#5 challenge binds sealed edgeId; guessed non-canonical pair name is rejected", async () => {
    const a = artifact("A1", "receipt in Chicago", { location: "Chicago" });
    const b = artifact("A2", "GPS 40.7128", { location: "NYC" });
    const swapped = await issueVerdict(inputs([b, a]));
    const sealedId = swapped.payload.evidenceGraph.edges[0]?.edgeId;
    expect(sealedId).toBe("edge-A1-A2");

    const guessed = await issueVerdict({
      ...inputs([b, a]),
      challenge: {
        kind: "device_person_gap",
        edgeId: "edge-A2-A1",
        artifactId: "A2",
        reasoning: "GPS only proves device location",
        proposedAlternative: "Device could be elsewhere",
      },
    });
    expect(guessed.payload.verdict.reasoningSummary.includes("challenge rejected")).toBe(true);

    const copied = await issueVerdict({
      ...inputs([b, a]),
      challenge: {
        kind: "device_person_gap",
        edgeId: sealedId!,
        artifactId: "A2",
        reasoning: "GPS only proves device location",
        proposedAlternative: "Device could be elsewhere",
      },
    });
    expect(copied.payload.verdict.reasoningSummary.includes("challenge rejected")).toBe(false);
    const hit = copied.payload.reasoning.find((step) => step.edgeId === sealedId);
    expect(hit?.challenged).toBe(true);
  });
});

describe("Collision mechanics — hash alphabet", () => {
  test("#6 current law is bare 64-hex; prefixes are not required", async () => {
    const sealed = await issueVerdict(
      inputs([artifact("A", "hello domain probe")])
    );
    const raw = sealed.payload.artifacts[0].rawContentSha256;
    expect(sealed.receiptHash).toMatch(/^[0-9a-f]{64}$/);
    expect(raw).toMatch(/^[0-9a-f]{64}$/);
    expect(sealed.receiptHash.startsWith("receipt:")).toBe(false);
    expect(raw.startsWith("artifact:")).toBe(false);
    expect((sealed.payload as { receiptHash?: string }).receiptHash).toBeUndefined();
    expect(sealed.receiptHash).not.toEqual(raw);
  });
});
