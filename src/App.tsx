import { profile } from "./data/profile"

const swatches = [
  "bg-surface",
  "bg-panel",
  "bg-editor",
  "bg-terminal",
  "bg-line",
  "bg-accent",
  "bg-accent-2",
]

export default function App() {
  return (
    <main className="min-h-full bg-surface p-8">
      <h1 className="text-2xl font-semibold text-ink">{profile.name}</h1>
      <p className="mt-1 text-ink-dim">{profile.role}</p>
      <p className="mt-6 font-mono text-sm text-accent">rakat@workspace:</p>
      <p className="mt-1 font-mono text-sm text-accent-2">
        {profile.interests.join(" · ")}
      </p>
      <div className="mt-6 flex gap-2">
        {swatches.map((cls) => (
          <div
            key={cls}
            className={`h-10 w-10 rounded border border-line ${cls}`}
            title={cls}
          />
        ))}
      </div>
    </main>
  )
}