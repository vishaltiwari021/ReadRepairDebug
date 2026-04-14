export function getRepairTimeoutMs() {
  const parsedTimeoutMs = Number(process.env.REPAIR_TIMEOUT_MS);
  return Number.isFinite(parsedTimeoutMs) && parsedTimeoutMs > 0 ? parsedTimeoutMs : 5000;
}

