export default function LaunchOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="overlay-in fixed inset-0 z-50 grid place-items-center bg-surface/95 font-mono text-[13px]"
    >
      <div className="w-72">
        <p className="text-ink-dim">→ Opening localhost:5173...</p>
        <div className="mt-3 h-0.5 overflow-hidden rounded bg-edge/30">
          <div className="launch-progress h-full bg-accent" />
        </div>
      </div>
    </div>
  )
}