/**
 * Контурные 16×16 как в next/frontend/src/components/sim-tariffs/SimTariffCard.tsx
 * (круг stroke + галочка/крест линиями, без заливки фона).
 */
export function OutlineCheckCircle16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="#101010" strokeWidth="1" fill="none" />
      <path
        d="M4.5 8L7 10.5L11.5 5.5"
        stroke="#101010"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OutlineCrossCircle16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="#101010" strokeWidth="1" fill="none" />
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#101010" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
