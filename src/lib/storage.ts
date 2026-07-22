const LATENCY = Number(import.meta.env.VITE_API_LATENCY_MS ?? "350");

/**
 * A tiny localStorage-backed persistence layer that fakes async network calls.
 * This gives Meticulous realistic loading states and network activity to record,
 * without needing a real backend.
 */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures (e.g. private mode quota errors).
  }
}

export function withLatency<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), LATENCY);
  });
}
