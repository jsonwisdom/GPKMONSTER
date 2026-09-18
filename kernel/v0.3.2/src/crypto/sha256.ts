function hasWebCrypto(): boolean {
  const g = globalThis as any;
  return typeof g !== "undefined" && "crypto" in g && "subtle" in g.crypto;
}

function hasNodeCrypto(): boolean {
  try {
    const g = globalThis as any;
    return typeof g.require === "function" && !!g.require("crypto");
  } catch (_) {
    return false;
  }
}

export async function sha256(data: string | Uint8Array): Promise<string> {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;

  if (hasWebCrypto()) {
    const g = globalThis as any;
    const hash = await g.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  if (hasNodeCrypto()) {
    const g = globalThis as any;
    const crypto = g.require("crypto");
    return crypto.createHash("sha256").update(bytes).digest("hex");
  }

  throw new Error(
    "SHA-256 not available. Please use a browser or Node.js environment."
  );
}
