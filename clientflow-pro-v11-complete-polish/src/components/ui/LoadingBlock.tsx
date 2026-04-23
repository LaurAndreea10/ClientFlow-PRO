export function LoadingBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="loading-card" aria-busy="true" aria-live="polite">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="skeleton-line" />
      ))}
    </div>
  )
}
