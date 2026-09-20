import { useState, type KeyboardEvent } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { fileTree, folderPaths, type TreeNode } from '../../data/portfolioFiles'
import FileIcon from './FileIcon'

const ROW =
  'flex h-[22px] w-full items-center pr-2 text-left text-[13px] outline-none focus-visible:outline-offset-[-2px]'

interface TreeItemsProps {
  nodes: TreeNode[]
  depth: number
  expanded: Set<string>
  activePath: string | null
  onToggle: (path: string) => void
  onOpen: (path: string, pinned: boolean) => void
}

function TreeItems({ nodes, depth, expanded, activePath, onToggle, onOpen }: TreeItemsProps) {
  return (
    <>
      {nodes.map((node) => {
        if (node.kind === 'folder') {
          const open = expanded.has(node.path)
          return (
            <div key={node.path}>
              <button
                type="button"
                role="treeitem"
                aria-expanded={open}
                data-tree-row
                data-kind="folder"
                data-path={node.path}
                onClick={() => onToggle(node.path)}
                style={{ paddingLeft: 4 + depth * 12 }}
                className={`${ROW} gap-1 text-ink-dim hover:bg-list-hover hover:text-white`}
              >
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="truncate">{node.name}</span>
              </button>
              <div
                role="group"
                inert={!open}
                className={`grid transition-[grid-template-rows] duration-150 ease-out ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <TreeItems
                    nodes={node.children}
                    depth={depth + 1}
                    expanded={expanded}
                    activePath={activePath}
                    onToggle={onToggle}
                    onOpen={onOpen}
                  />
                </div>
              </div>
            </div>
          )
        }

        const active = node.path === activePath
        return (
          <button
            key={node.path}
            type="button"
            role="treeitem"
            aria-selected={active}
            data-tree-row
            data-kind="file"
            data-path={node.path}
            onClick={() => onOpen(node.path, false)}
            onDoubleClick={() => onOpen(node.path, true)}
            style={{ paddingLeft: 20 + depth * 12 }}
            className={`${ROW} gap-1.5 ${
              active ? 'bg-list-active text-white' : 'text-ink-dim hover:bg-list-hover hover:text-white'
            }`}
          >
            <FileIcon language={node.language} />
            <span className="truncate">{node.name}</span>
          </button>
        )
      })}
    </>
  )
}

interface FileExplorerProps {
  activePath: string | null
  onOpen: (path: string, pinned: boolean) => void
}

export default function FileExplorer({ activePath, onOpen }: FileExplorerProps) {
  const [expanded, setExpanded] = useState(() => new Set<string>(folderPaths))

  const toggle = (path: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rows = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-tree-row]'),
    ).filter((row) => !row.closest('[inert]'))
    const index = rows.indexOf(document.activeElement as HTMLElement)
    if (index === -1) return

    const row = rows[index]
    const isFolder = row.dataset.kind === 'folder'
    const path = row.dataset.path ?? ''
    const isOpen = expanded.has(path)
    const next = rows[Math.min(index + 1, rows.length - 1)]
    const previous = rows[Math.max(index - 1, 0)]

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      next.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      previous.focus()
    } else if (event.key === 'ArrowRight' && isFolder) {
      event.preventDefault()
      if (isOpen) {
        next.focus()
      } else {
        toggle(path)
      }
    } else if (event.key === 'ArrowLeft' && isFolder && isOpen) {
      event.preventDefault()
      toggle(path)
    }
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto pb-2">
      <div className="flex h-[22px] items-center px-2 text-[11px] font-bold uppercase tracking-wide text-ink">
        portfolio
      </div>
      <div role="tree" aria-label="Portfolio files" onKeyDown={handleKeyDown}>
        <TreeItems
          nodes={fileTree}
          depth={0}
          expanded={expanded}
          activePath={activePath}
          onToggle={toggle}
          onOpen={onOpen}
        />
      </div>
    </div>
  )
}