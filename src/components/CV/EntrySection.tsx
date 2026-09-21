import type { EntryData } from '../../lib/cvData'
import Section from './Section'

interface BulletsProps {
  items: string[]
}

export function Bullets({ items }: BulletsProps) {
  if (items.length === 0) return null
  return (
    <ul className="mt-1.5 list-disc space-y-0.5 pl-4 marker:text-zinc-400">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ul>
  )
}

interface EntrySectionProps {
  title: string
  entries: EntryData[]
}

export default function EntrySection({ title, entries }: EntrySectionProps) {
  if (entries.length === 0) return null

  return (
    <Section title={title}>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.key} className="break-inside-avoid">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold text-zinc-900">{entry.title}</h3>
              {entry.period && (
                <span className="shrink-0 text-xs text-zinc-500">{entry.period}</span>
              )}
            </div>
            {entry.subtitle && <p className="text-zinc-600">{entry.subtitle}</p>}
            <Bullets items={entry.bullets} />
          </div>
        ))}
      </div>
    </Section>
  )
}