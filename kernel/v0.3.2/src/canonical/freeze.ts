export function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (Object.isFrozen(obj)) return obj;
  for (const key of Object.keys(obj as object)) {
    deepFreeze((obj as Record<string, unknown>)[key]);
  }
  return Object.freeze(obj);
}
