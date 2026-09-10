// Real, verifiable claim only — no invented totals. Stay count is computed
// at render time in page.tsx (live property count) rather than hardcoded
// here, so it can't silently go stale. Label is translated via
// homepage.commissionLabel, not stored here.
export const COMMISSION_STAT = { value: "0%" }
