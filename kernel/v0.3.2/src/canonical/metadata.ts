import { CanonicalMetadata } from "../kernel/types";

export function canonicalizeMetadata(input: unknown): CanonicalMetadata {
  if (input === null || input === undefined || typeof input !== "object") {
    return {};
  }
  const result: CanonicalMetadata = {};
  const obj = input as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value === null || value === undefined) continue;
    if (typeof value === "string") {
      result[key] = value.normalize("NFKC").trim();
      continue;
    }
    if (typeof value === "boolean") {
      result[key] = value;
      continue;
    }
    if (typeof value === "number" && Number.isSafeInteger(value)) {
      result[key] = value;
      continue;
    }
  }
  return result;
}
