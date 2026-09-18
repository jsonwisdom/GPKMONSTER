export function compareUtf8Bytes(a: string, b: string): number {
  const enc = new TextEncoder();
  const bytesA = enc.encode(a);
  const bytesB = enc.encode(b);
  const minLen = Math.min(bytesA.length, bytesB.length);
  for (let i = 0; i < minLen; i++) {
    if (bytesA[i] !== bytesB[i]) {
      return bytesA[i] - bytesB[i];
    }
  }
  return bytesA.length - bytesB.length;
}

export function utf8Sort<T>(arr: T[], key: (item: T) => string): T[] {
  return [...arr].sort((a, b) => compareUtf8Bytes(key(a), key(b)));
}

export function utf8SortStrings(strings: string[]): string[] {
  return [...strings].sort(compareUtf8Bytes);
}
