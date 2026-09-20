import { Atom, Braces, Info, type LucideIcon } from 'lucide-react'
import type { Language } from '../../data/portfolioFiles'

const ICONS: Record<Language, { icon: LucideIcon; className: string }> = {
  markdown: { icon: Info, className: 'text-ink-faint' },
  typescript: { icon: Braces, className: 'text-syn-constant' },
  tsx: { icon: Atom, className: 'text-syn-function' },
}

interface FileIconProps {
  language: Language
  size?: number
}

export default function FileIcon({ language, size = 15 }: FileIconProps) {
  const { icon: Icon, className } = ICONS[language]
  return <Icon size={size} className={`shrink-0 ${className}`} aria-hidden="true" />
}