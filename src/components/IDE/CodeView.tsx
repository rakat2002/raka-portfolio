import { useEffect, useMemo, useRef, type KeyboardEvent, type MouseEvent } from 'react'
import type { FileNode } from '../../data/portfolioFiles'
import type { Cursor } from '../../hooks/useCursors'
import { highlightLine, type TokenType } from '../../lib/highlight'

const TOKEN_CLASS: Record<TokenType, string> = {
  plain: 'text-syn-default',
  comment: 'text-syn-comment italic',
  string: 'text-syn-string font-bold',
  keyword: 'text-syn-keyword',
  storage: 'text-syn-storage font-bold',
  constant: 'text-syn-constant',
  type: 'text-syn-support font-bold',
  variable: 'text-syn-variable italic',
  function: 'text-syn-function',
  heading: 'text-syn-function font-bold',
}

// Works out where the caret goes when an arrow key, Home or End is pressed.
function moveCursor(key: string, { line, col }: Cursor, lines: string[]): Cursor | null {
  const lengthOf = (n: number) => lines[n - 1].length

  switch (key) {
    case 'ArrowUp':
      return line > 1
        ? { line: line - 1, col: Math.min(col, lengthOf(line - 1)) }
        : { line, col: 0 }
    case 'ArrowDown':
      return line < lines.length
        ? { line: line + 1, col: Math.min(col, lengthOf(line + 1)) }
        : { line, col: lengthOf(line) }
    case 'ArrowLeft':
      if (col > 0) return { line, col: col - 1 }
      return line > 1 ? { line: line - 1, col: lengthOf(line - 1) } : { line, col }
    case 'ArrowRight':
      if (col < lengthOf(line)) return { line, col: col + 1 }
      return line < lines.length ? { line: line + 1, col: 0 } : { line, col }
    case 'Home':
      return { line, col: 0 }
    case 'End':
      return { line, col: lengthOf(line) }
    default:
      return null
  }
}

interface CodeViewProps {
  file: FileNode
  cursor: Cursor
  onCursorChange: (cursor: Cursor) => void
}

export default function CodeView({ file, cursor, onCursorChange }: CodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)

  const sourceLines = useMemo(() => file.content.split('\n'), [file])
  const lines = useMemo(
    () => sourceLines.map((text) => highlightLine(text, file.language)),
    [sourceLines, file.language],
  )

  // Keep the caret inside the file even if the content changed underneath it.
  const line = Math.min(cursor.line, sourceLines.length)
  const col = Math.min(cursor.col, sourceLines[line - 1].length)

  // Scroll so the caret's line is always visible.
  useEffect(() => {
    containerRef.current
      ?.querySelector(`[data-line="${line}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [line])

  const handleRowClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    const charWidth = probeRef.current?.getBoundingClientRect().width || 8
    const codeLeft = event.currentTarget.querySelector('code')?.getBoundingClientRect().left ?? 0
    const clicked = Math.round((event.clientX - codeLeft) / charWidth)
    const newCol = Math.max(0, Math.min(clicked, sourceLines[index].length))
    onCursorChange({ line: index + 1, col: newCol })
    containerRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    const next = moveCursor(event.key, { line, col }, sourceLines)
    if (!next) return
    event.preventDefault()
    onCursorChange(next)
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`${file.name} (read-only)`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="min-h-0 flex-1 overflow-auto bg-editor py-2 font-mono text-[13px] leading-[22px] focus-visible:outline-offset-[-2px]"
    >
      {/* Invisible one-character-wide box: measures how wide a character is. */}
      <span ref={probeRef} aria-hidden="true" className="invisible absolute left-0 top-0 w-[1ch]" />

      <div className="w-max min-w-full">
        {lines.map((tokens, index) => {
          const number = index + 1
          const current = number === line
          return (
            <div
              key={number}
              data-line={number}
              onClick={(event) => handleRowClick(event, index)}
              className={`flex ${current ? 'bg-current-line' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`sticky left-0 w-14 shrink-0 select-none pr-4 text-right ${
                  current ? 'bg-current-line text-ink' : 'bg-editor text-gutter'
                }`}
              >
                {number}
              </span>
              <code className="relative whitespace-pre pr-8">
                {tokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={TOKEN_CLASS[token.type]}>
                    {token.text}
                  </span>
                ))}
                {current && (
                  <span
                    aria-hidden="true"
                    className="caret-blink absolute bottom-0.5 top-0.5 w-0.5 bg-caret"
                    style={{ left: `${col}ch` }}
                  />
                )}
              </code>
            </div>
          )
        })}
      </div>
    </div>
  )
}