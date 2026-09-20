import { Link } from 'react-router-dom'
import { profile } from '../data/profile'

export default function CV() {
  return (
    <main className="page-in min-h-full bg-white p-10 text-zinc-900">
      <Link to="/" className="text-sm text-fuchsia-700 underline">
        ← Back to Workspace
      </Link>
      <h1 className="mt-6 text-3xl font-semibold">{profile.name}</h1>
      <p className="mt-1 text-zinc-600">{profile.role}</p>
      <p className="mt-8 text-sm text-zinc-500">The full CV arrives in the next step.</p>
    </main>
  )
}