import { compareUtf8Bytes, utf8Sort, utf8SortStrings } from "./utf8";
import {
  ReceiptPayload,
  CanonicalArtifact,
  EvidenceNode,
  EvidenceEdge,
  ReasoningStep,
} from "../kernel/types";

export function canonicalizeArtifacts(artifacts: CanonicalArtifact[]): CanonicalArtifact[] {
  return utf8Sort(artifacts, (a) => a.id);
}

export function canonicalizeNodes(nodes: EvidenceNode[]): EvidenceNode[] {
  return utf8Sort(nodes, (n) => n.nodeId);
}

export function canonicalizeEdges(edges: EvidenceEdge[]): EvidenceEdge[] {
  return [...edges].sort((a, b) => {
    const source = compareUtf8Bytes(a.sourceId, b.sourceId);
    if (source !== 0) return source;
    const target = compareUtf8Bytes(a.targetId, b.targetId);
    if (target !== 0) return target;
    return compareUtf8Bytes(a.edgeId, b.edgeId);
  });
}

export function canonicalizeReasoning(steps: ReasoningStep[]): ReasoningStep[] {
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].stepIndex !== i) {
      throw new Error(`Reasoning step index mismatch: expected ${i}, got ${steps[i].stepIndex}`);
    }
  }
  return steps;
}

export function canonicalizeObject(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(canonicalizeObject);
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj).sort(compareUtf8Bytes);
  for (const key of keys) {
    sorted[key] = canonicalizeObject((obj as Record<string, unknown>)[key]);
  }
  return sorted;
}

export function canonicalizePayload(payload: ReceiptPayload): ReceiptPayload {
  const withSortedSets = {
    ...payload,
    artifacts: canonicalizeArtifacts(payload.artifacts),
    evidenceGraph: {
      nodes: canonicalizeNodes(payload.evidenceGraph.nodes),
      edges: canonicalizeEdges(payload.evidenceGraph.edges),
    },
    reasoning: canonicalizeReasoning(payload.reasoning),
    notProven: utf8SortStrings(payload.notProven),
    missingEvidence: utf8SortStrings(payload.missingEvidence),
  };
  return canonicalizeObject(withSortedSets) as ReceiptPayload;
}

export function validateCanonicalPayload(payload: ReceiptPayload): void {
  for (const artifact of payload.artifacts) {
    for (const key of Object.keys(artifact.metadata)) {
      const value = artifact.metadata[key];
      if (typeof value === "number" && !Number.isSafeInteger(value)) {
        throw new Error(`Non-safe integer in metadata: ${key} = ${value}`);
      }
    }
  }
  const confidence = payload.verdict.confidenceBasisPoints;
  if (confidence < 0 || confidence > 10000) {
    throw new Error(`Invalid confidence: ${confidence}`);
  }
  for (const step of payload.reasoning) {
    if (step.confidenceBasisPoints < 0 || step.confidenceBasisPoints > 10000) {
      throw new Error(`Invalid step confidence: ${step.confidenceBasisPoints}`);
    }
  }
  for (const node of payload.evidenceGraph.nodes) {
    if (node.confidenceBasisPoints < 0 || node.confidenceBasisPoints > 10000) {
      throw new Error(`Invalid node confidence: ${node.confidenceBasisPoints}`);
    }
  }
  for (const edge of payload.evidenceGraph.edges) {
    if (edge.strengthBasisPoints < 0 || edge.strengthBasisPoints > 10000) {
      throw new Error(`Invalid edge strength: ${edge.strengthBasisPoints}`);
    }
  }
}

export function canonicalizeChallengeText(text: string): string {
  return text.normalize("NFKC").trim().replace(/\s+/g, " ");
}

export { compareUtf8Bytes } from "./utf8";
