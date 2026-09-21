import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {title}
      </h2>
      <div className="mt-3 text-[13px] leading-relaxed text-zinc-800">{children}</div>
    </section>
  )
}