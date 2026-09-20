import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/browser'
import { WELCOME_LINES, runCommand, type OutputLine } from '../lib/terminal'

export type TerminalEntry =
  | { id: number; kind: 'input'; command: string }
  | { id: number; kind: 'output'; lines: OutputLine[] }

export function useTerminal() {
  const nextId = useRef(1)
  const draft = useRef('') // what you had typed before you pressed the Up arrow
  const timers = useRef<number[]>([]) // scheduled lines that have not appeared yet

  const [entries, setEntries] = useState<TerminalEntry[]>([
    { id: 0, kind: 'output', lines: WELCOME_LINES },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [position, setPosition] = useState(0) // where we are in the history
  const [busy, setBusy] = useState(false) // true while a command is still printing

  const newId = () => nextId.current++

  // If the terminal goes away, stop any output that is still on its way.
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const cancelPending = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current.length = 0
  }

  const submit = () => {
    if (busy) return

    const command = input.trim()
    const echo: TerminalEntry = { id: newId(), kind: 'input', command }

    setInput('')
    draft.current = ''

    // Pressing Enter on an empty line just gives a fresh prompt, like a real shell.
    if (command === '') {
      setPosition(history.length)
      setEntries((current) => [...current, echo])
      return
    }

    setHistory((current) => [...current, command])
    setPosition(history.length + 1)

    const result = runCommand(command)
    if (result.clear) {
      setEntries([])
      return
    }

    const streamed = !prefersReducedMotion() && result.lines.some((item) => (item.delay ?? 0) > 0)

    // Fast path: show everything at once.
    if (!streamed) {
      const output: TerminalEntry[] =
        result.lines.length > 0 ? [{ id: newId(), kind: 'output', lines: result.lines }] : []
      setEntries((current) => [...current, echo, ...output])
      return
    }

    // Slow path: show the lines one at a time, as if a program were printing them.
    const outputId = newId()
    setEntries((current) => [...current, echo, { id: outputId, kind: 'output', lines: [] }])
    setBusy(true)

    let elapsed = 0
    result.lines.forEach((item, index) => {
      elapsed += item.delay ?? 0
      const isLast = index === result.lines.length - 1

      const timer = window.setTimeout(() => {
        setEntries((current) =>
          current.map((entry) =>
            entry.kind === 'output' && entry.id === outputId
              ? { ...entry, lines: [...entry.lines, item] }
              : entry,
          ),
        )
        if (isLast) setBusy(false)
      }, elapsed)

      timers.current.push(timer)
    })
  }

  const historyUp = () => {
    if (history.length === 0 || position === 0) return
    if (position === history.length) draft.current = input
    const next = position - 1
    setPosition(next)
    setInput(history[next])
  }

  const historyDown = () => {
    if (position >= history.length) return
    const next = position + 1
    setPosition(next)
    setInput(next === history.length ? draft.current : history[next])
  }

  const clear = () => {
    cancelPending()
    setBusy(false)
    setEntries([])
  }

  return { entries, input, setInput, submit, historyUp, historyDown, clear, busy }
}

export type TerminalState = ReturnType<typeof useTerminal>