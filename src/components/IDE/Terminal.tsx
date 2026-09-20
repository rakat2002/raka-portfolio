import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { TerminalState } from '../../hooks/useTerminal'
import { isPlainLeftClick } from '../../lib/browser'
import { getSuggestions, type LineTone, type OutputLine } from '../../lib/terminal'
import Prompt from './Prompt'

const TONE_CLASS: Record<LineTone, string> = {
  plain: 'text-ink-dim',
  success: 'text-syn-variable',
  info: 'text-accent-2',
  error: 'text-accent',
  muted: 'text-ink-faint',
}

interface OutputRowProps {
  item: OutputLine
  onLaunch?: (href: string) => void
}

function OutputRow({ item, onLaunch }: OutputRowProps) {
  const { link } = item

  return (
    <div className={`whitespace-pre-wrap break-words ${TONE_CLASS[item.tone ?? 'plain']}`}>
      {item.text || '\u00a0'}
      {link && (
        <a
          href={link.href}
          onClick={(event) => {
            // Without a launcher, or for Ctrl/Cmd-clicks, the browser follows the link itself.
            if (!onLaunch || !isPlainLeftClick(event)) return
            event.preventDefault()
            event.stopPropagation()
            onLaunch(link.href)
          }}
          className="link-pulse rounded px-1 font-bold text-accent-2 underline decoration-accent-2/50 underline-offset-4 hover:text-white"
        >
          {link.label}
        </a>
      )}
    </div>
  )
}

interface TerminalProps {
  terminal: TerminalState
  onLaunch?: (href: string) => void
}

export default function Terminal({ terminal, onLaunch }: TerminalProps) {
  const { entries, input, setInput, submit, historyUp, historyDown, clear, busy } = terminal
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // The menu opens only when the person types, never when history fills the line.
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1) // -1 means nothing is highlighted yet

  const suggestions = open ? getSuggestions(input) : []
  const listVisible = suggestions.length > 0
  const typedLength = input.trimStart().length

  // Always show the newest output, and keep the menu in view when it opens.
  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [entries, suggestions.length])

  // Keep the highlighted row visible when the menu is longer than its box.
  useEffect(() => {
    if (active < 0) return
    document.getElementById(`terminal-suggestion-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  // When a command finishes printing, put the cursor back on the prompt.
  const wasBusy = useRef(false)
  useEffect(() => {
    if (wasBusy.current && !busy) inputRef.current?.focus()
    wasBusy.current = busy
  }, [busy])

  const closeSuggestions = () => {
    setOpen(false)
    setActive(-1)
  }

  const accept = (suggestion: string) => {
    setInput(suggestion)
    closeSuggestions()
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (listVisible) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActive((index) => (index + 1) % suggestions.length)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActive((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
        return
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        accept(suggestions[active >= 0 ? active : 0])
        return
      }
      if (event.key === 'Enter' && active >= 0) {
        event.preventDefault()
        accept(suggestions[active])
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        closeSuggestions()
        return
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      closeSuggestions()
      submit()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      closeSuggestions()
      historyUp()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      closeSuggestions()
      historyDown()
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      closeSuggestions()
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
      <div role="log" aria-label="Terminal output" aria-live="polite" aria-busy={busy}>
        {entries.map((entry) =>
          entry.kind === 'input' ? (
            <div key={entry.id} className="flex gap-2">
              <Prompt />
              <span className="break-words text-ink">{entry.command}</span>
            </div>
          ) : (
            <div key={entry.id}>
              {entry.lines.map((item, index) => (
                <OutputRow key={index} item={item} onLaunch={onLaunch} />
              ))}
            </div>
          ),
        )}
      </div>

      {/* While a command is still printing, the prompt is hidden, like in a real terminal. */}
      <div className={`flex items-center gap-2 ${busy ? 'hidden' : ''}`}>
        <Prompt />
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onKeyDown={handleKeyDown}
          onBlur={closeSuggestions}
          role="combobox"
          aria-label="Terminal input"
          aria-autocomplete="list"
          aria-expanded={listVisible}
          aria-controls={listVisible ? 'terminal-suggestions' : undefined}
          aria-activedescendant={
            listVisible && active >= 0 ? `terminal-suggestion-${active}` : undefined
          }
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-ink caret-caret outline-none"
        />
      </div>

      {listVisible && (
        <div className="mt-1 max-w-md overflow-hidden rounded-md border border-edge/40 bg-panel shadow-lg shadow-black/30">
          <ul
            id="terminal-suggestions"
            role="listbox"
            aria-label="Suggestions"
            className="max-h-44 overflow-y-auto py-1"
          >
            {suggestions.map((suggestion, index) => {
              const selected = index === active
              return (
                <li
                  key={suggestion}
                  id={`terminal-suggestion-${index}`}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => accept(suggestion)}
                  className={`cursor-pointer whitespace-pre px-3 leading-6 ${
                    selected
                      ? 'bg-list-active text-white'
                      : 'text-ink-faint hover:bg-list-hover hover:text-white'
                  }`}
                >
                  <span className={selected ? 'text-white' : 'text-ink'}>
                    {suggestion.slice(0, typedLength)}
                  </span>
                  <span>{suggestion.slice(typedLength)}</span>
                </li>
              )
            })}
          </ul>
          <p className="border-t border-line px-3 py-1 text-[11px] text-ink-faint">
            ↑↓ choose · Tab complete · Esc close
          </p>
        </div>
      )}
    </div>
  )
}