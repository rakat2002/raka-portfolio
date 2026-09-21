import CVActions from '../components/CV/CVActions'
import CVHeader from '../components/CV/CVHeader'
import ProfileSection from '../components/CV/ProfileSection'
import { profile } from '../data/profile'
import { countPlaceholders } from '../lib/placeholders'

export default function CV() {
  const placeholders = countPlaceholders(profile)

  return (
    <div className="cv-page page-in min-h-full bg-zinc-100 px-4 py-6 text-zinc-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-[820px]">
        <CVActions />

        {import.meta.env.DEV && placeholders > 0 && (
          <p
            role="note"
            className="mb-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 print:hidden"
          >
            Development note: {placeholders} value(s) in src/data/profile.ts still start with
            "TODO". This note never appears on the live site.
          </p>
        )}

        <article className="rounded-md bg-white px-10 py-9 shadow-sm ring-1 ring-zinc-200 print:rounded-none print:p-0 print:shadow-none print:ring-0">
          <CVHeader />
          <ProfileSection />
        </article>
      </div>
    </div>
  )
}