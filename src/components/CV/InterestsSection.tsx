import { artLink, bareUrl, interestItems } from '../../lib/cvData'
import Section from './Section'

export default function InterestsSection() {
  const items = interestItems()
  const art = artLink()
  if (items.length === 0 && !art) return null

  return (
    <Section title="Interests">
      {items.length > 0 && <p>{items.join(' · ')}</p>}
      {art && (
        <p className="mt-1.5 text-zinc-600">
          Digital art:{' '}
          <a href={art} target="_blank" rel="noreferrer"
            className="text-fuchsia-800 underline-offset-2 hover:underline"
          >
            <span className="print:hidden">View my work</span>
            <span className="hidden print:inline">{bareUrl(art)}</span>
          </a>
        </p>
      )}
    </Section>
  )
}