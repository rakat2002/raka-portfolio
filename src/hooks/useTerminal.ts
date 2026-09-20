import { useRef, useState } from 'react'
import { WELCOME_LINES, runCommand, type OutputLine } from '../lib/terminal'

export type TerminalEntry =
  | { id: number; kind: 'input'; command: string }
  | { id: number; kind: 'output'; lines: OutputLine[] }

export function useTerminal() {
  const nextId = useRef(1)
  const draft = useRef('') // what you had typed before you pressed the Up arrow

  const [entries, setEntries] = useState<TerminalEntry[]>([
    { id: 0, kind: 'output', lines: WELCOME_LINES },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [position, setPosition] = useState(0) // where we are in the history

  const newId = () => nextId.current++

  const submit = () => {
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

    const output: TerminalEntry[] =
      result.lines.length > 0 ? [{ id: newId(), kind: 'output', lines: result.lines }] : []
    setEntries((current) => [...current, echo, ...output])
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

  const clear = () => setEntries([])

  return { entries, input, setInput, submit, historyUp, historyDown, clear }
}

export type TerminalState = ReturnType<typeof useTerminal>