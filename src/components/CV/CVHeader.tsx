import { profile } from '../../data/profile'
import { isPlaceholder } from '../../lib/placeholders'
import CVPhoto from './CVPhoto'

interface ContactLink {
  label: string
  value: string // the raw value from profile.ts
  text: string // what people see on screen
  printText: string // what is printed on paper
  href: string
  external: boolean
}

const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

// Anything still marked TODO in profile.ts is left out instead of shown to visitors.
const links: ContactLink[] = [
  {
    label: 'Email',
    value: profile.email,
    text: profile.email,
    printText: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    label: 'GitHub',
    value: profile.github,
    text: 'GitHub',
    printText: bareUrl(profile.github),
    href: profile.github,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: profile.linkedin,
    text: 'LinkedIn',
    printText: bareUrl(profile.linkedin),
    href: profile.linkedin,
    external: true,
  },
].filter((item) => !isPlaceholder(item.value))

export default function CVHeader() {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold uppercase leading-tight tracking-tight text-zinc-900">
          {profile.name}
        </h1>
        <p className="mt-1 text-[15px] font-medium text-fuchsia-800">{profile.role}</p>
        <p className="mt-0.5 text-[13px] text-zinc-600">{profile.tagline}</p>

        <p className="mt-3 text-[13px] text-zinc-600">{profile.location}</p>
        <ul className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
          {links.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-zinc-300">
                  ·
                </span>
              )}
              <a href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="text-fuchsia-800 underline-offset-2 hover:underline"
              >
                <span className="print:hidden">{item.text}</span>
                <span className="hidden print:inline">{item.printText}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <CVPhoto />
    </header>
  )
}