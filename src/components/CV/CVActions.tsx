import { ArrowLeft, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'

const BUTTON =
  'inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-[13px] font-medium text-zinc-800 transition-colors hover:bg-zinc-50'

export default function CVActions() {
  return (
    <nav
      aria-label="CV actions"
      className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden"
    >
      <Link to="/" className={BUTTON}>
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Workspace
      </Link>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => window.print()} className={BUTTON}>
          <Printer size={14} aria-hidden="true" />
          Print
        </button>
      </div>
    </nav>
  )
}