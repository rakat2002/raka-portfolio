import { GitBranch, GitCommit } from 'lucide-react'

export default function SourceControlPanel() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto px-3 py-3 text-[13px]">
      <p className="flex items-center gap-1.5 text-ink-dim">
        <GitBranch size={13} aria-hidden="true" />
        main
      </p>

      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Changes</p>
        <p className="mt-2 text-ink-faint">No changes.</p>
      </div>

      <div className="mt-4 rounded border border-line bg-editor p-2.5">
        <p className="flex items-center gap-1.5 text-ink">
          <GitCommit size={13} aria-hidden="true" />
          Working tree clean
        </p>
        <p className="mt-1 text-[12px] text-ink-faint">
          Nothing to commit. Everything to discover.
        </p>
      </div>
    </div>
  )
}