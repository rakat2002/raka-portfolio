import { fileTree, filesByPath } from '../data/portfolioFiles'
import { profile } from '../data/profile'

export type LineTone = 'plain' | 'success' | 'info' | 'error' | 'muted'

export interface OutputLine {
  text: string
  tone?: LineTone
}

export interface CommandResult {
  lines: OutputLine[]
  clear?: boolean
}

interface Command {
  name: string
  description: string
  run: (args: string[]) => CommandResult
}

export const PROMPT_USER = profile.name.split(' ')[0].toLowerCase()
export const PROMPT_HOST = 'workspace'
const HOME_PATH = `/home/${PROMPT_USER}/portfolio`

export const WELCOME_LINES: OutputLine[] = [
  { text: `${PROMPT_USER}-shell 1.0 — type 'help' to see available commands.`, tone: 'muted' },
]

// ---------- small helpers ----------

const line = (text: string, tone?: LineTone): OutputLine => ({ text, tone })
const plain = (...texts: string[]): CommandResult => ({ lines: texts.map((text) => line(text)) })
const failure = (text: string): CommandResult => ({ lines: [line(text, 'error')] })

// ---------- the commands ----------

function help(): CommandResult {
  const width = Math.max(...COMMANDS.map((command) => command.name.length)) + 2
  return {
    lines: [
      line('Available commands:', 'info'),
      ...COMMANDS.map((command) => line(`  ${command.name.padEnd(width)}${command.description}`)),
    ],
  }
}

function ls(args: string[]): CommandResult {
  const target = args[0]?.replace(/\/$/, '')

  if (!target) {
    return plain(
      fileTree.map((node) => (node.kind === 'folder' ? `${node.name}/` : node.name)).join('  '),
    )
  }
  if (filesByPath.has(target)) return plain(args[0])

  const folder = fileTree.find((node) => node.kind === 'folder' && node.path === target)
  if (!folder || folder.kind !== 'folder') {
    return failure(`ls: cannot access '${args[0]}': No such file or directory`)
  }
  return plain(folder.children.map((child) => child.name).join('  '))
}

function cat(args: string[]): CommandResult {
  if (args.length === 0) return failure('cat: missing file operand')

  return {
    lines: args.flatMap((path) => {
      const file = filesByPath.get(path)
      if (!file) return [line(`cat: ${path}: No such file or directory`, 'error')]
      return file.content.split('\n').map((text) => line(text))
    }),
  }
}

const COMMANDS: Command[] = [
  { name: 'help', description: 'Show this list', run: help },
  { name: 'ls', description: 'List files (try: ls projects)', run: ls },
  { name: 'cat', description: 'Print a file (try: cat README.md)', run: cat },
  { name: 'pwd', description: 'Print the working directory', run: () => plain(HOME_PATH) },
  { name: 'whoami', description: 'Show who is logged in', run: () => plain(PROMPT_USER) },
  {
    name: 'clear',
    description: 'Clear the terminal (Ctrl+L)',
    run: () => ({ lines: [], clear: true }),
  },
]

// ---------- the entry point ----------

export function runCommand(input: string): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/)
  const command = COMMANDS.find((item) => item.name === name)

  if (!command) {
    return {
      lines: [
        line(`bash: ${name}: command not found`, 'error'),
        line("Type 'help' to see available commands.", 'muted'),
      ],
    }
  }
  return command.run(args)
}