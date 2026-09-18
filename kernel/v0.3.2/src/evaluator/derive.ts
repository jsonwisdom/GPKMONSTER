import {
  AnalysisResult,
  Verdict,
  VerdictStatus,
  ReasoningStep,
} from "../kernel/types";
import { CONSTITUTIONAL_CONSTANTS } from "../kernel/constants";

export function deriveVerdict(
  analysis: AnalysisResult,
  _inputs: { roundId: string; seed: number }
): Verdict {
  const { aggregateConfidence, contradictions, graph } = analysis;

  let status: VerdictStatus;
  const thresholds = CONSTITUTIONAL_CONSTANTS.THRESHOLDS;

  if (aggregateConfidence >= thresholds.SUPPORT) {
    status = "SUPPORTED";
  } else if (aggregateConfidence <= thresholds.CONTRADICT) {
    status = "CONTRADICTED";
  } else {
    status = "HOLD";
  }

  const reasoning: ReasoningStep[] = [];
  let stepIndex = 0;

  for (const node of graph.nodes) {
    const artifactId = node.artifactId;
    const outgoingEdges = graph.edges.filter((e) => e.sourceId === node.nodeId);
    for (const edge of outgoingEdges) {
      const targetNode = graph.nodes.find((candidate) => candidate.nodeId === edge.targetId);
      const targetArtifactId = targetNode?.artifactId ?? artifactId;

      reasoning.push({
        stepIndex: stepIndex++,
        edgeId: edge.edgeId,
        artifactId: targetArtifactId,
        observation: `Artifact ${targetArtifactId} is the target of ${edge.edgeId}`,
        inference: `Relation: ${edge.relation} (strength: ${edge.strengthBasisPoints}/10000)`,
        conclusion: edge.relation === "contradicts"
          ? `Artifact ${artifactId} contradicts ${targetArtifactId}`
          : `Artifact ${artifactId} ${edge.relation} ${targetArtifactId}`,
        confidenceBasisPoints: edge.strengthBasisPoints,
        challenged: false,
      });
    }
  }

  if (reasoning.length === 0) {
    reasoning.push({
      stepIndex: 0,
      edgeId: "edge-none",
      artifactId: "none",
      observation: "No evidence relationships found",
      inference: "Insufficient evidence",
      conclusion: "Cannot determine verdict with confidence",
      confidenceBasisPoints: CONSTITUTIONAL_CONSTANTS.BASIS_POINTS_NEUTRAL,
      challenged: false,
    });
  }

  const summary =
    status === "SUPPORTED"
      ? `Evidence supports the claim (${aggregateConfidence}/10000)`
      : status === "CONTRADICTED"
      ? `Evidence contradicts the claim (${aggregateConfidence}/10000)`
      : `Insufficient evidence to determine (${aggregateConfidence}/10000)`;

  const notProven: string[] = [];
  const missingEvidence: string[] = [];

  for (const node of graph.nodes) {
    if (node.confidenceBasisPoints < 4000) {
      notProven.push(`Artifact ${node.artifactId}: low confidence (${node.confidenceBasisPoints}/10000)`);
    }
  }

  if (contradictions.length > 0) {
    missingEvidence.push(
      `${contradictions.length} contradictions detected — additional evidence needed`
    );
  }

  return {
    status,
    confidenceBasisPoints: aggregateConfidence,
    reasoningSummary: summary,
    reasoning,
    notProven,
    missingEvidence,
  };
}
