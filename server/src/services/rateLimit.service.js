const attempts = new Map();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export function isRateLimited(key) {
  const current = Date.now();
  const entry = attempts.get(key);

  if (!entry) return false;

  if (current > entry.expiresAt) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function addAttempt(key) {
  const current = Date.now();
  const existing = attempts.get(key);

  if (!existing || current > existing.expiresAt) {
    attempts.set(key, {
      count: 1,
      expiresAt: current + WINDOW_MS,
    });
    return;
  }

  attempts.set(key, {
    count: existing.count + 1,
    expiresAt: existing.expiresAt,
  });
}