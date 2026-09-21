import { achievementItems } from '../../lib/cvData'
import { Bullets } from './EntrySection'
import Section from './Section'

export default function AchievementsSection() {
  const items = achievementItems()
  if (items.length === 0) return null

  return (
    <Section title="Achievements">
      <Bullets items={items} />
    </Section>
  )
}