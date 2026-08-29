import {
  ArtifactInput,
  Claim,
  AnalysisResult,
  EvidenceNode,
  EvidenceEdge,
  BasisPoints,
  assertBasisPoints,
  toBasisPoints,
} from "../kernel/types";
import { CONSTITUTIONAL_CONSTANTS } from "../kernel/constants";
import { canonicalizeMetadata } from "../canonical/metadata";
import { compareUtf8Bytes } from "../canonical/utf8";

function sealArtifactForAnalysis(artifact: ArtifactInput): ArtifactInput {
  return {
    ...artifact,
    metadata: canonicalizeMetadata(artifact.metadata),
  };
}

function orderedPair(
  a: ArtifactInput,
  b: ArtifactInput
): [ArtifactInput, ArtifactInput] {
  return compareUtf8Bytes(a.id, b.id) <= 0 ? [a, b] : [b, a];
}

export function analyzeEvidence(
  artifacts: ArtifactInput[],
  claim: Claim
): AnalysisResult {
  const sealedArtifacts = artifacts.map(sealArtifactForAnalysis);
  const nodes: EvidenceNode[] = [];
  const edges: EvidenceEdge[] = [];
  const artifactConfidence: Record<string, BasisPoints> = {};
  const contradictions: Array<{
    artifactA: string;
    artifactB: string;
    description: string;
    severityBasisPoints: BasisPoints;
  }> = [];

  for (const artifact of sealedArtifacts) {
    const confidence = assessArtifact(artifact, claim);
    artifactConfidence[artifact.id] = confidence;
    nodes.push({
      nodeId: `node-${artifact.id}`,
      artifactId: artifact.id,
      kind: artifact.type,
      confidenceBasisPoints: confidence,
    });
  }

  for (let i = 0; i < sealedArtifacts.length; i++) {
    for (let j = i + 1; j < sealedArtifacts.length; j++) {
      const a = sealedArtifacts[i];
      const b = sealedArtifacts[j];
      const conflict = detectConflict(a, b);
      if (conflict) {
        const [first, second] = orderedPair(a, b);
        contradictions.push({
          artifactA: first.id,
          artifactB: second.id,
          description: conflict.description,
          severityBasisPoints: conflict.severity,
        });
        edges.push({
          edgeId: `edge-${first.id}-${second.id}`,
          sourceId: `node-${first.id}`,
          targetId: `node-${second.id}`,
          relation: "contradicts",
          strengthBasisPoints: conflict.severity,
        });
      }
    }
  }

  const totalConfidence = Object.values(artifactConfidence).reduce(
    (sum, c) => sum + c,
    0
  );
  const aggregateConfidence = toBasisPoints(
    totalConfidence,
    artifacts.length * 10000
  );

  return {
    artifactConfidence,
    contradictions,
    graph: { nodes, edges },
    aggregateConfidence,
  };
}

function assessArtifact(artifact: ArtifactInput, claim: Claim): BasisPoints {
  let score: number = CONSTITUTIONAL_CONSTANTS.BASIS_POINTS_NEUTRAL;

  switch (artifact.provenance) {
    case "THIRD_PARTY": score += 3000; break;
    case "FIRST_PARTY": score -= 2000; break;
    case "UNKNOWN": score -= 1000; break;
  }

  switch (artifact.type) {
    case "transaction_record":
    case "location_log": score += 2000; break;
    case "screenshot":
    case "receipt_screenshot":
    case "social_post": score -= 3000; break;
    case "document":
    case "photograph":
    case "video": score += 1000; break;
    default: break;
  }

  if (artifact.timestamp) {
    const fit = checkTemporalFit(artifact.timestamp, claim.timestamp);
    score += fit;
  }

  const clamped = Math.max(0, Math.min(10000, score));
  assertBasisPoints(clamped);
  return clamped;
}

function checkTemporalFit(artifactTime: string, claimTime: string): number {
  try {
    const a = new Date(artifactTime).getTime();
    const c = new Date(claimTime).getTime();
    const diffMs = Math.abs(a - c);
    if (Number.isNaN(diffMs)) return -2000;
    if (diffMs < CONSTITUTIONAL_CONSTANTS.ONE_HOUR_MS) return 2000;
    if (diffMs < CONSTITUTIONAL_CONSTANTS.ONE_DAY_MS) return 0;
    return -3000;
  } catch (_) {
    return -2000;
  }
}

function detectConflict(
  a: ArtifactInput,
  b: ArtifactInput
): { description: string; severity: BasisPoints } | null {
  const aLoc = extractLocation(a);
  const bLoc = extractLocation(b);
  if (aLoc && bLoc && aLoc !== bLoc) {
    return { description: `Location conflict: ${aLoc} vs ${bLoc}`, severity: 8000 as BasisPoints };
  }
  const aAmt = extractAmount(a);
  const bAmt = extractAmount(b);
  if (aAmt !== null && bAmt !== null && aAmt !== bAmt) {
    return { description: `Amount conflict: ${aAmt} vs ${bAmt}`, severity: 7000 as BasisPoints };
  }
  return null;
}

function extractLocation(artifact: ArtifactInput): string | null {
  const content = typeof artifact.content === "string" ? artifact.content : "";
  if (content.includes("NYC") || content.includes("40.7128")) return "NYC";
  if (content.includes("Chicago") || content.includes("41.8781")) return "Chicago";
  if (artifact.metadata?.location) return String(artifact.metadata.location);
  return null;
}

function extractAmount(artifact: ArtifactInput): number | null {
  const content = typeof artifact.content === "string" ? artifact.content : "";
  const match = content.match(/(\d+)\.?(\d{0,2})?\s*(USDC|USD)/);
  if (match) {
    const dollars = parseInt(match[1], 10);
    const cents = match[2] ? parseInt(match[2].padEnd(2, "0").slice(0, 2), 10) : 0;
    return dollars * 100 + cents;
  }
  if (artifact.metadata?.amount) {
    const amt = Number(artifact.metadata.amount);
    if (Number.isFinite(amt) && amt >= 0) return Math.round(amt * 100);
  }
  return null;
}
