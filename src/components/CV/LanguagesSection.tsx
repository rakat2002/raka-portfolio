import { languageItems } from '../../lib/cvData'
import Section from './Section'

export default function LanguagesSection() {
  const items = languageItems()
  if (items.length === 0) return null

  return (
    <Section title="Languages">
      <p>{items.join(' · ')}</p>
    </Section>
  )
}