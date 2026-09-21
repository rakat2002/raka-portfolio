import { Fragment } from 'react'
import { contactRows } from '../../lib/cvData'
import Section from './Section'

export default function ContactSection() {
  const rows = contactRows()
  if (rows.length === 0) return null

  return (
    <Section title="Contact">
      <dl className="grid grid-cols-[6.5rem_1fr] gap-y-1">
        {rows.map((row) => (
          <Fragment key={row.label}>
            <dt className="font-medium text-zinc-900">{row.label}</dt>
            <dd className="text-zinc-700">
              {row.href ? (
                <a href={row.href}
                  target={row.href.startsWith('http') ? '_blank' : undefined}
                  rel={row.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="text-fuchsia-800 underline-offset-2 hover:underline"
                >
                  {row.text}
                </a>
              ) : (
                row.text
              )}
            </dd>
          </Fragment>
        ))}
      </dl>
    </Section>
  )
}