import { VerdictInputs, ArtifactInput, Claim } from "../../src/kernel/types";

export function getStandardInputs(): VerdictInputs {
  const claim: Claim = {
    id: "TEST-001",
    actor: "CryptoBrew",
    action: "Charged 14.50 USDC for latte",
    timestamp: "2026-08-29T14:30:00Z",
    context: "Customer disputes—claims not in city",
  };

  const artifacts: ArtifactInput[] = [
    {
      id: "A1",
      type: "receipt_screenshot",
      source: "customer",
      provenance: "FIRST_PARTY",
      content: "CryptoBrew receipt: 14.50 USDC at 2026-08-29T14:30:00Z",
      timestamp: "2026-08-29T14:30:00Z",
      metadata: { amount: 14.5, location: "Chicago" },
    },
    {
      id: "A2",
      type: "location_log",
      source: "telco",
      provenance: "THIRD_PARTY",
      content: "GPS: 40.7128°N, 74.0060°W at 2026-08-29T14:30:00Z",
      timestamp: "2026-08-29T14:30:00Z",
      metadata: { location: "NYC" },
    },
    {
      id: "A3",
      type: "social_post",
      source: "vendor",
      provenance: "FIRST_PARTY",
      content: "Closed for renovations all week. See you Sept 1!",
      timestamp: "2026-08-28T09:00:00Z",
      metadata: { platform: "Twitter" },
    },
  ];

  return {
    roundId: "TEST-001",
    claim,
    artifacts,
    seed: 42069,
    observationBoundary: "all_at_once",
  };
}

export function getChallengeInputs(): VerdictInputs {
  const base = getStandardInputs();
  return {
    ...base,
    challenge: {
      kind: "device_person_gap",
      edgeId: "edge-A1-A2",
      artifactId: "A2",
      reasoning: "GPS only proves device location, not physical presence",
      proposedAlternative: "Device could be left behind or spoofed",
      timestamp: Date.now(),
    },
  };
}
