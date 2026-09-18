import { issueVerdict } from "../../src/evaluator/index";
import { VerdictInputs, ArtifactInput, Claim } from "../../src/kernel/types";

describe("RAW vs NORMALIZED", () => {
  test("NFKC normalization changes content", () => {
    const normalized = "①".normalize("NFKC");
    expect(normalized).toBe("1");
    expect("①").not.toBe("1");
  });

  test("raw hash differs after NFKC normalization", async () => {
    const enc = new TextEncoder();
    const raw1 = enc.encode("①");
    const raw2 = enc.encode("1");
    expect(raw1).not.toEqual(raw2);
  });

  test("artifact display has normalized content, payload has raw hash", async () => {
    const inputs = getNFKCTestInputs();
    const result = await issueVerdict(inputs);
    const artifactId = "A1";
    const display = result.envelope.artifactDisplay[artifactId];
    const payloadArtifact = result.payload.artifacts.find(a => a.id === artifactId);

    expect(display?.normalizedContent).toBeDefined();
    expect(payloadArtifact?.rawContentSha256).toBeDefined();
    expect(payloadArtifact?.rawContentSha256).not.toBe(display?.normalizedContent);
  });
});

function getNFKCTestInputs(): VerdictInputs {
  const claim: Claim = {
    id: "NFKC-TEST-001",
    actor: "Test",
    action: "Test action",
    timestamp: "2026-08-29T14:30:00Z",
    context: "Test context",
  };

  const artifacts: ArtifactInput[] = [
    {
      id: "A1",
      type: "document",
      source: "test",
      provenance: "FIRST_PARTY",
      content: "①KⅣ",
      metadata: {},
    },
  ];

  return {
    roundId: "NFKC-TEST-001",
    claim,
    artifacts,
    seed: 999,
    observationBoundary: "all_at_once",
  };
}
