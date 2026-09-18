import {
  Verdict,
  ChallengeKind,
  AnalysisResult,
  ReasoningStep,
  EvidenceEdge,
  assertBasisPoints,
} from "../kernel/types";
import { CONSTITUTIONAL_CONSTANTS } from "../kernel/constants";

export function applyChallenge(
  initialVerdict: Verdict,
  challenge: {
    kind: ChallengeKind;
    edgeId: string;
    artifactId: string;
    reasoning: string;
    proposedAlternative: string;
  },
  analysis: AnalysisResult
): Verdict {
  const targetIndex = initialVerdict.reasoning.findIndex(
    (step) => step.edgeId === challenge.edgeId
  );

  if (targetIndex === -1) {
    return {
      ...initialVerdict,
      reasoningSummary: `${initialVerdict.reasoningSummary} (challenge rejected: edge ${challenge.edgeId} not found)`,
    };
  }

  const targetStep = initialVerdict.reasoning[targetIndex];
  if (targetStep.artifactId !== challenge.artifactId) {
    return {
      ...initialVerdict,
      reasoningSummary: `${initialVerdict.reasoningSummary} (challenge rejected: artifact mismatch)`,
    };
  }

  const targetEdge = analysis.graph.edges.find(
    (e) => e.edgeId === challenge.edgeId
  );

  if (!targetEdge) {
    return {
      ...initialVerdict,
      reasoningSummary: `${initialVerdict.reasoningSummary} (challenge rejected: edge not in evidence graph)`,
    };
  }

  const validation = validateChallengeKind(
    challenge.kind,
    targetStep,
    targetEdge,
    challenge.artifactId,
    analysis
  );

  if (!validation.valid) {
    return {
      ...initialVerdict,
      reasoningSummary: `${initialVerdict.reasoningSummary} (challenge rejected: ${validation.reason})`,
    };
  }

  const reduction = 2000;
  let newConfidence = initialVerdict.confidenceBasisPoints - reduction;
  newConfidence = Math.max(0, Math.min(10000, newConfidence));
  assertBasisPoints(newConfidence);

  const updatedReasoning = initialVerdict.reasoning.map((step, index) => {
    if (index === targetIndex) {
      return {
        ...step,
        challenged: true,
        challengeResult: {
          accepted: true,
          kernelResponse: `Challenge of kind "${challenge.kind}" accepted. Edge re-evaluated.`,
          learningPoint: validation.learningPoint,
        },
      };
    }
    return step;
  });

  let status = initialVerdict.status;
  const thresholds = CONSTITUTIONAL_CONSTANTS.THRESHOLDS;

  if (newConfidence >= thresholds.SUPPORT) {
    status = "SUPPORTED";
  } else if (newConfidence <= thresholds.CONTRADICT) {
    status = "CONTRADICTED";
  } else {
    status = "HOLD";
  }

  return {
    status,
    confidenceBasisPoints: newConfidence,
    reasoningSummary: `Challenge accepted. New verdict: ${status} (${newConfidence}/10000)`,
    reasoning: updatedReasoning,
    notProven: initialVerdict.notProven,
    missingEvidence: initialVerdict.missingEvidence,
  };
}

interface ValidationResult {
  valid: boolean;
  reason: string;
  learningPoint: string;
}

function validateChallengeKind(
  kind: ChallengeKind,
  _step: ReasoningStep,
  edge: EvidenceEdge,
  artifactId: string,
  analysis: AnalysisResult
): ValidationResult {
  const artifactNode = analysis.graph.nodes.find(
    (n) => n.artifactId === artifactId
  );

  const validations: Record<
    ChallengeKind,
    (edge: EvidenceEdge, node: typeof artifactNode) => ValidationResult
  > = {
    device_person_gap: (e, node) => {
      const hasLocation = node?.kind === "location_log" ||
                          e.relation === "contradicts";
      return {
        valid: hasLocation,
        reason: hasLocation ? "" : "No location evidence found",
        learningPoint: "Device location ≠ person location. Challenge the inference, not the artifact.",
      };
    },
    source_authenticity: (_, node) => {
      const isScreenshot = node?.kind === "screenshot" ||
                          node?.kind === "receipt_screenshot" ||
                          node?.kind === "social_post";
      return {
        valid: isScreenshot,
        reason: isScreenshot ? "" : "Artifact is not screenshot-based",
        learningPoint: "Screenshots are not source records. Challenge provenance.",
      };
    },
    clock_skew: (_, node) => {
      const hasTimestamp = node?.kind === "location_log" ||
                           node?.kind === "transaction_record";
      return {
        valid: hasTimestamp,
        reason: hasTimestamp ? "" : "Artifact has no timestamp",
        learningPoint: "Timestamps can be manipulated. Look for subtle inconsistencies.",
      };
    },
    chain_of_custody: (_, node) => ({
      valid: node !== undefined,
      reason: node ? "" : "Artifact has no source information",
      learningPoint: "Evidence chain matters. Question how each artifact was obtained.",
    }),
    conflicting_artifacts: (e, _) => ({
      valid: e.relation === "contradicts",
      reason: e.relation === "contradicts" ? "" : "No contradictions found",
      learningPoint: "Conflicts signal further investigation, not fraud.",
    }),
    missing_context: () => ({
      valid: true,
      reason: "",
      learningPoint: "Missing context can change interpretation dramatically.",
    }),
    inference_strength: () => ({
      valid: true,
      reason: "",
      learningPoint: "Not all evidence is equal. Question confidence levels.",
    }),
    provenance_gap: () => ({
      valid: true,
      reason: "",
      learningPoint: "Unknown provenance = unknown reliability.",
    }),
    logical_fallacy: () => ({
      valid: true,
      reason: "",
      learningPoint: "Check assumptions. Does A really imply B?",
    }),
  };

  const validator = validations[kind];
  if (!validator) {
    return {
      valid: false,
      reason: `Unknown challenge kind: ${kind}`,
      learningPoint: "Use a valid ChallengeKind from the enum.",
    };
  }

  return validator(edge, artifactNode);
}
