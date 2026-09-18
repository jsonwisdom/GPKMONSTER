/**
 * GPKMONSTER Kernel v0.3.2-RC3
 * Constitutional Types — Integer-Native, Append-Only
 * 
 * LAW: NUMERIC_STATE = SAFE_INTEGER_ONLY
 * LAW: NON_INTEGER_VALUES = FORBIDDEN
 * LAW: NaN / Infinity = FORBIDDEN
 */

export type BasisPoints = number & { __brand: "BasisPoints" };

export function assertBasisPoints(value: number): asserts value is BasisPoints {
  if (!Number.isSafeInteger(value) || value < 0 || value > 10000) {
    throw new Error(
      `Invalid basis points: ${value}. Must be safe integer in range 0..10000.`
    );
  }
}

export function toBasisPoints(numerator: number, denominator: number): BasisPoints {
  if (denominator === 0) return 5000 as BasisPoints;
  const raw = Math.floor((numerator * 10000) / denominator);
  const clamped = Math.max(0, Math.min(10000, raw));
  assertBasisPoints(clamped);
  return clamped as BasisPoints;
}

export type VerdictStatus = "SUPPORTED" | "CONTRADICTED" | "HOLD";
export type Provenance = "FIRST_PARTY" | "THIRD_PARTY" | "UNKNOWN";
export type Representation = "UTF8_TEXT" | "BINARY";

export type ArtifactType =
  | "receipt_screenshot"
  | "screenshot"
  | "bank_statement"
  | "location_log"
  | "social_post"
  | "transaction_record"
  | "photograph"
  | "video"
  | "audio"
  | "document"
  | "metadata_log"
  | "unknown";

export type ChallengeKind =
  | "device_person_gap"
  | "source_authenticity"
  | "clock_skew"
  | "chain_of_custody"
  | "conflicting_artifacts"
  | "missing_context"
  | "inference_strength"
  | "provenance_gap"
  | "logical_fallacy";

export type EdgeRelation =
  | "supports"
  | "contradicts"
  | "independent"
  | "weakens";

export interface Claim {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  context: string;
  metadata?: Record<string, unknown>;
}

export interface ArtifactInput {
  id: string;
  type: ArtifactType;
  source: string;
  provenance: Provenance;
  content: string | Uint8Array;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export type CanonicalMetadata = Record<string, string | number | boolean | null>;

export interface CanonicalArtifact {
  id: string;
  kind: ArtifactType;
  representation: Representation;
  rawBytesAvailable: boolean;
  rawContentSha256: string;
  metadata: CanonicalMetadata;
}

export interface EvidenceNode {
  nodeId: string;
  artifactId: string;
  kind: string;
  confidenceBasisPoints: BasisPoints;
}

export interface EvidenceEdge {
  edgeId: string;
  sourceId: string;
  targetId: string;
  relation: EdgeRelation;
  strengthBasisPoints: BasisPoints;
}

export interface EvidenceGraph {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
}

export interface ReasoningStep {
  stepIndex: number;
  edgeId: string;
  artifactId: string;
  observation: string;
  inference: string;
  conclusion: string;
  confidenceBasisPoints: BasisPoints;
  challenged: boolean;
  challengeResult?: {
    accepted: boolean;
    kernelResponse: string;
    learningPoint: string;
  };
}

export interface CanonicalChallenge {
  kind: ChallengeKind;
  edgeId: string;
  artifactId: string;
  reasoning: string;
  proposedAlternative: string;
}

export interface ReceiptPayload {
  roundId: string;
  version: number;
  seed: number;
  parentReceiptHash: string | null;
  claim: {
    id: string;
    actor: string;
    action: string;
    timestamp: string;
    context: string;
  };
  artifacts: CanonicalArtifact[];
  verdict: {
    status: VerdictStatus;
    confidenceBasisPoints: BasisPoints;
    reasoningSummary: string;
  };
  challenge: CanonicalChallenge | null;
  evidenceGraph: EvidenceGraph;
  reasoning: ReasoningStep[];
  notProven: string[];
  missingEvidence: string[];
  observationBoundary: string;
}

export interface ArtifactDisplay {
  normalizedContent?: string;
  displayMetadata: CanonicalMetadata;
  binaryInfo?: {
    sizeBytes: number;
    mimeType?: string;
    summary: string;
  };
}

export interface ReceiptEnvelope {
  createdAt: string;
  runtime: "node" | "browser" | "deno" | "unknown";
  kernelVersion: string;
  artifactDisplay: Record<string, ArtifactDisplay>;
  challengeTimestamp?: string;
  uiHints?: Record<string, unknown>;
}

export interface SealedReceipt {
  payload: ReceiptPayload;
  receiptHash: string;
  envelope: ReceiptEnvelope;
}

export interface VerdictInputs {
  roundId: string;
  claim: Claim;
  artifacts: ArtifactInput[];
  seed: number;
  observationBoundary: string;
  challenge?: {
    kind: ChallengeKind;
    edgeId: string;
    artifactId: string;
    reasoning: string;
    proposedAlternative: string;
    timestamp?: number;
  };
}

export interface AnalysisResult {
  artifactConfidence: Record<string, BasisPoints>;
  contradictions: Array<{
    artifactA: string;
    artifactB: string;
    description: string;
    severityBasisPoints: BasisPoints;
  }>;
  graph: EvidenceGraph;
  aggregateConfidence: BasisPoints;
}

export interface Verdict {
  status: VerdictStatus;
  confidenceBasisPoints: BasisPoints;
  reasoningSummary: string;
  reasoning: ReasoningStep[];
  notProven: string[];
  missingEvidence: string[];
}
