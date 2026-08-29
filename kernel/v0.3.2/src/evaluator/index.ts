import {
  VerdictInputs,
  SealedReceipt,
  ReceiptPayload,
  ReceiptEnvelope,
  ArtifactDisplay,
  ArtifactInput,
  Representation,
} from "../kernel/types";
import { CONSTITUTIONAL_CONSTANTS } from "../kernel/constants";
import { analyzeEvidence } from "../evidence/analyzer";
import { deriveVerdict } from "./derive";
import { applyChallenge } from "./challenge";
import {
  canonicalizePayload,
  validateCanonicalPayload,
  canonicalizeChallengeText,
} from "../canonical/index";
import { canonicalizeMetadata } from "../canonical/metadata";
import { deepFreeze } from "../canonical/freeze";
import { sha256 } from "../crypto/sha256";

export async function issueVerdict(
  inputs: VerdictInputs,
  parent?: SealedReceipt
): Promise<SealedReceipt> {
  const version = parent ? parent.payload.version + 1 : 1;
  const parentReceiptHash = parent?.receiptHash || null;

  const analysis = analyzeEvidence(inputs.artifacts, inputs.claim);
  const initialVerdict = deriveVerdict(analysis, inputs);
  const finalVerdict = inputs.challenge
    ? applyChallenge(initialVerdict, inputs.challenge, analysis)
    : initialVerdict;

  const canonicalArtifacts = await Promise.all(
    inputs.artifacts.map(async (a) => {
      const representation: Representation = a.content instanceof Uint8Array ? "BINARY" : "UTF8_TEXT";
      const rawContentSha256 = await sha256(
        a.content instanceof Uint8Array ? a.content : new TextEncoder().encode(a.content)
      );
      return {
        id: a.id,
        kind: a.type,
        representation,
        rawBytesAvailable: a.content instanceof Uint8Array,
        rawContentSha256,
        metadata: canonicalizeMetadata(a.metadata),
      };
    })
  );

  const payload: ReceiptPayload = {
    roundId: inputs.roundId,
    version,
    seed: inputs.seed,
    parentReceiptHash,
    claim: {
      id: inputs.claim.id,
      actor: inputs.claim.actor,
      action: inputs.claim.action,
      timestamp: inputs.claim.timestamp,
      context: inputs.claim.context,
    },
    artifacts: canonicalArtifacts,
    verdict: {
      status: finalVerdict.status,
      confidenceBasisPoints: finalVerdict.confidenceBasisPoints,
      reasoningSummary: finalVerdict.reasoningSummary,
    },
    challenge: inputs.challenge
      ? {
          kind: inputs.challenge.kind,
          edgeId: inputs.challenge.edgeId,
          artifactId: inputs.challenge.artifactId,
          reasoning: canonicalizeChallengeText(inputs.challenge.reasoning),
          proposedAlternative: canonicalizeChallengeText(
            inputs.challenge.proposedAlternative
          ),
        }
      : null,
    evidenceGraph: analysis.graph,
    reasoning: finalVerdict.reasoning.map((step, i) => ({ ...step, stepIndex: i })),
    notProven: finalVerdict.notProven,
    missingEvidence: finalVerdict.missingEvidence,
    observationBoundary: inputs.observationBoundary,
  };

  const canonicalPayload = canonicalizePayload(payload);
  validateCanonicalPayload(canonicalPayload);

  const canonicalJson = JSON.stringify(canonicalPayload);
  const receiptHash = await sha256(canonicalJson);

  const envelope: ReceiptEnvelope = {
    createdAt: new Date().toISOString(),
    runtime: detectRuntime(),
    kernelVersion: CONSTITUTIONAL_CONSTANTS.KERNEL_VERSION,
    artifactDisplay: buildArtifactDisplay(inputs.artifacts),
    challengeTimestamp: inputs.challenge?.timestamp
      ? new Date(inputs.challenge.timestamp).toISOString()
      : undefined,
  };

  const sealed: SealedReceipt = {
    payload: canonicalPayload,
    receiptHash,
    envelope,
  };

  return deepFreeze(sealed);
}

function buildArtifactDisplay(
  artifacts: ArtifactInput[]
): Record<string, ArtifactDisplay> {
  const result: Record<string, ArtifactDisplay> = {};
  for (const artifact of artifacts) {
    const display: ArtifactDisplay = {
      displayMetadata: canonicalizeMetadata(artifact.metadata),
    };
    if (artifact.content instanceof Uint8Array) {
      display.binaryInfo = {
        sizeBytes: artifact.content.length,
        summary: `Binary artifact (${artifact.content.length} bytes)`,
      };
    } else {
      display.normalizedContent = artifact.content
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ");
    }
    result[artifact.id] = display;
  }
  return result;
}

function detectRuntime(): "node" | "browser" | "deno" | "unknown" {
  const g = globalThis as any;
  if (typeof g.process !== "undefined" && g.process.versions?.node) return "node";
  if (typeof g.Deno !== "undefined") return "deno";
  if (typeof g.window !== "undefined" || typeof g.document !== "undefined") return "browser";
  return "unknown";
}
