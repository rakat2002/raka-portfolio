import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { fileTree, type FileNode, type TreeNode } from '../../data/portfolioFiles'
import FileIcon from './FileIcon'

function flattenFiles(nodes: TreeNode[]): FileNode[] {
  return nodes.flatMap((node) => (node.kind === 'file' ? [node] : flattenFiles(node.children)))
}
const ALL_FILES = flattenFiles(fileTree)

interface Match {
  file: FileNode
  line: string
  lineNumber: number
}

function search(query: string): Match[] {
  const q = query.trim().toLowerCase()
  if (q === '') return []

  const results: Match[] = []
  for (const file of ALL_FILES) {
    const nameMatches = file.name.toLowerCase().includes(q)
    const lines = file.content.split('\n')
    let found = false
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(q)) {
        results.push({ file, line: line.trim(), lineNumber: index + 1 })
        found = true
      }
    })
    if (nameMatches && !found) {
      results.push({ file, line: '(filename match)', lineNumber: 1 })
    }
  }
  return results.slice(0, 40)
}

interface SearchPanelProps {
  onOpen: (path: string, pinned: boolean) => void
}

export default function SearchPanel({ onOpen }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => search(query), [query])

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2 py-2">
      <div className="flex items-center gap-2 rounded border border-line bg-editor px-2 py-1.5">
        <Search size={13} className="shrink-0 text-ink-faint" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search portfolio"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
        />
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-auto">
        {query.trim() === '' && (
          <p className="px-1 text-[12px] text-ink-faint">Search file names and contents.</p>
        )}
        {query.trim() !== '' && results.length === 0 && (
          <p className="px-1 text-[12px] text-ink-faint">No results found.</p>
        )}
        {results.length > 0 && (
          <p className="px-1 pb-1 text-[11px] text-ink-faint">
            {results.length} result{results.length === 1 ? '' : 's'}
          </p>
        )}
        <ul className="space-y-0.5">
          {results.map((match, index) => (
            <li key={`${match.file.path}-${match.lineNumber}-${index}`}>
              <button
                type="button"
                onClick={() => onOpen(match.file.path, true)}
                className="flex w-full flex-col gap-0.5 rounded px-1.5 py-1 text-left hover:bg-list-hover"
              >
                <span className="flex items-center gap-1.5 text-[12px] text-ink">
                  <FileIcon language={match.file.language} size={12} />
                  {match.file.path}
                </span>
                <span className="truncate pl-[18px] text-[11px] text-ink-faint">{match.line}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}