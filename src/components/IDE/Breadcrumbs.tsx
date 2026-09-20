import { ChevronRight } from 'lucide-react'
import type { FileNode } from '../../data/portfolioFiles'
import FileIcon from './FileIcon'

interface BreadcrumbsProps {
  file: FileNode
}

export default function Breadcrumbs({ file }: BreadcrumbsProps) {
  const segments = ['portfolio', ...file.path.split('/')]

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex h-[22px] shrink-0 items-center overflow-x-auto bg-breadcrumb px-3 text-xs text-ink-dim"
    >
      <ol className="flex items-center whitespace-nowrap">
        {segments.map((segment, index) => {
          const last = index === segments.length - 1
          return (
            <li
              key={`${index}-${segment}`}
              aria-current={last ? 'page' : undefined}
              className="flex items-center"
            >
              {index > 0 && (
                <ChevronRight size={12} aria-hidden="true" className="mx-0.5 text-ink-faint" />
              )}
              {last && <FileIcon language={file.language} size={13} />}
              <span className={last ? 'ml-1 text-white' : ''}>{segment}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}