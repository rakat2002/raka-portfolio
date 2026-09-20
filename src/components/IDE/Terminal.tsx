import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { TerminalState } from '../../hooks/useTerminal'
import { PROMPT_HOST, PROMPT_USER, type LineTone } from '../../lib/terminal'

const TONE_CLASS: Record<LineTone, string> = {
  plain: 'text-ink-dim',
  success: 'text-syn-variable',
  info: 'text-accent-2',
  error: 'text-accent',
  muted: 'text-ink-faint',
}

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-accent">
        {PROMPT_USER}@{PROMPT_HOST}
      </span>
      <span className="text-ink-faint">:</span>
      <span className="text-accent-2">~</span>
      <span className="text-ink-faint">$</span>
    </span>
  )
}

interface TerminalProps {
  terminal: TerminalState
}

export default function Terminal({ terminal }: TerminalProps) {
  const { entries, input, setInput, submit, historyUp, historyDown, clear } = terminal
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Always show the newest output.
  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [entries])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submit()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      historyUp()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      historyDown()
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      clear()
    }
  }

  // Clicking anywhere focuses the input, unless the person is selecting text.
  const focusInput = () => {
    if (window.getSelection()?.toString()) return
    inputRef.current?.focus()
  }

  return (
    <div
      ref={scrollRef}
      onClick={focusInput}
      className="min-h-0 flex-1 cursor-text overflow-auto p-3 font-mono text-[13px] leading-6"
    >
      <div role="log" aria-label="Terminal output" aria-live="polite">
        {entries.map((entry) =>
          entry.kind === 'input' ? (
            <div key={entry.id} className="flex gap-2">
              <Prompt />
              <span className="break-words text-ink">{entry.command}</span>
            </div>
          ) : (
            <div key={entry.id}>
              {entry.lines.map((item, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap break-words ${TONE_CLASS[item.tone ?? 'plain']}`}
                >
                  {item.text || '\u00a0'}
                </div>
              ))}
            </div>
          ),
        )}
      </div>

      <div className="flex items-center gap-2">
        <Prompt />
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Terminal input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-ink caret-caret outline-none"
        />
      </div>
    </div>
  )
}