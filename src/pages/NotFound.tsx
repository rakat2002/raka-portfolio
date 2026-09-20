import { Link, useLocation } from 'react-router-dom'
import Prompt from '../components/IDE/Prompt'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <main className="grid min-h-full place-items-center bg-surface p-6 font-mono text-[13px] leading-6">
      <div className="w-full max-w-md">
        <p className="text-6xl font-semibold text-accent">404</p>
        <p className="mt-2 text-ink">File not found.</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Prompt />
          <span className="break-all text-ink">cd {pathname}</span>
        </div>
        <p className="break-all text-ink-dim">bash: cd: {pathname}: No such file or directory</p>

        <Link
          to="/"
          className="mt-8 inline-block rounded border border-edge px-3 py-1.5 text-ink transition-colors hover:bg-list-hover"
        >
          [ Back to Workspace ]
        </Link>
      </div>
    </main>
  )
}