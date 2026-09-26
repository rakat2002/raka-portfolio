import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/browser'
import { WELCOME_LINES, runCommand, type OutputLine } from '../lib/terminal'

export type TerminalEntry =
  | { id: number; kind: 'input'; command: string }
  | { id: number; kind: 'output'; lines: OutputLine[] }

export function useTerminal() {
  const nextId = useRef(1)
  const draft = useRef('')
  const timers = useRef<number[]>([])

  const [entries, setEntries] = useState<TerminalEntry[]>([
    { id: 0, kind: 'output', lines: WELCOME_LINES },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [position, setPosition] = useState(0)
  const [busy, setBusy] = useState(false)

  const newId = () => nextId.current++

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const cancelPending = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current.length = 0
  }

  const streamOutput = (command: string, lines: OutputLine[]) => {
    const echo: TerminalEntry = { id: newId(), kind: 'input', command }
    const streamed = !prefersReducedMotion() && lines.some((item) => (item.delay ?? 0) > 0)

    if (!streamed) {
      const output: TerminalEntry[] = lines.length > 0 ? [{ id: newId(), kind: 'output', lines }] : []
      setEntries((current) => [...current, echo, ...output])
      return
    }

    const outputId = newId()
    setEntries((current) => [...current, echo, { id: outputId, kind: 'output', lines: [] }])
    setBusy(true)

    let elapsed = 0
    lines.forEach((item, index) => {
      elapsed += item.delay ?? 0
      const isLast = index === lines.length - 1

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

  const submit = () => {
    if (busy) return

    const command = input.trim()
    setInput('')
    draft.current = ''

    if (command === '') {
      setPosition(history.length)
      setEntries((current) => [...current, { id: newId(), kind: 'input', command }])
      return
    }

    setHistory((current) => [...current, command])
    setPosition(history.length + 1)

    const result = runCommand(command)
    if (result.clear) {
      setEntries([])
      return
    }
    streamOutput(command, result.lines)
  }

  const runProgram = (command: string, lines: OutputLine[]) => {
    if (busy) return
    setHistory((current) => [...current, command])
    setPosition(history.length + 1)
    streamOutput(command, lines)
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

  return { entries, input, setInput, submit, historyUp, historyDown, clear, busy, runProgram }
}

export type TerminalState = ReturnType<typeof useTerminal>