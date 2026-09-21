import { Fragment } from 'react'
import { skillRows } from '../../lib/cvData'
import Section from './Section'

export default function SkillsSection() {
  const rows = skillRows()
  if (rows.length === 0) return null

  return (
    <Section title="Technical Skills">
      <dl className="grid grid-cols-[6.5rem_1fr] gap-y-1">
        {rows.map((row) => (
          <Fragment key={row.label}>
            <dt className="font-medium text-zinc-900">{row.label}</dt>
            <dd className="text-zinc-700">{row.items.join(', ')}</dd>
          </Fragment>
        ))}
      </dl>
    </Section>
  )
}