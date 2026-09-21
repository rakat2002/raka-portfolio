import { profile } from '../../data/profile'
import Section from './Section'

const list = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

function summaryText(): string {
  const written = profile.summary.trim()
  if (written) return written
  if (profile.interests.length === 0) return profile.role
  return `${profile.role} interested in ${list.format(profile.interests)}.`
}

export default function ProfileSection() {
  return (
    <Section title="Profile">
      <p>{summaryText()}</p>
      {profile.currentlyLearning.length > 0 && (
        <p className="mt-2 text-zinc-600">
          <span className="font-medium text-zinc-800">Currently learning:</span>{' '}
          {list.format(profile.currentlyLearning)}.
        </p>
      )}
    </Section>
  )
}