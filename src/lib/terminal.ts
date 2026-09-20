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
const notice = (text: string): CommandResult => ({ lines: [line(text, 'muted')] })

const bullets = (items: string[], fallback?: string): OutputLine[] => {
  if (items.length > 0) return items.map((item) => line(`  - ${item}`))
  return fallback ? [line(`  ${fallback}`, 'muted')] : []
}

// Puts one blank line between blocks of output.
const joinBlocks = (blocks: OutputLine[][]): OutputLine[] =>
  blocks.flatMap((block, index) => (index > 0 ? [line(''), ...block] : block))

// ---------- print("...") and console.log("...") ----------
// A tiny, safe reader. It only understands quoted text, numbers, true, false and null,
// separated by commas. It never runs anything you type.

function parseLiterals(source: string): string[] | null {
  const values: string[] = []
  let i = 0

  const skipSpaces = () => {
    while (i < source.length && /\s/.test(source[i])) i++
  }

  skipSpaces()
  if (i >= source.length) return values // print() with nothing inside

  while (true) {
    skipSpaces()
    const ch = source[i]

    if (ch === '"' || ch === "'" || ch === '`') {
      let text = ''
      i++
      while (i < source.length && source[i] !== ch) {
        if (source[i] === '\\' && i + 1 < source.length) {
          const next = source[i + 1]
          text += next === 'n' ? '\n' : next === 't' ? '\t' : next
          i += 2
        } else {
          text += source[i]
          i++
        }
      }
      if (i >= source.length) return null // the quote was never closed
      i++ // skip the closing quote
      values.push(text)
    } else {
      const match = /^(-?\d+(?:\.\d+)?|true|false|null)/.exec(source.slice(i))
      if (!match) return null
      values.push(match[0])
      i += match[0].length
    }

    skipSpaces()
    if (i >= source.length) return values
    if (source[i] !== ',') return null
    i++
  }
}

const PARSE_ERROR: CommandResult = {
  lines: [
    line('Unable to parse expression.', 'error'),
    line('Try:', 'muted'),
    line('print("Hello")'),
  ],
}

function printValues(source: string): CommandResult {
  const values = parseLiterals(source)
  if (!values) return PARSE_ERROR
  return { lines: values.join(' ').split('\n').map((text) => line(text)) }
}

// ---------- portfolio commands ----------

function about(): CommandResult {
  return {
    lines: [
      line(profile.name, 'info'),
      line(`${profile.role} · ${profile.location}`),
      line(''),
      line('Interests', 'info'),
      ...bullets(profile.interests),
      line(''),
      line('Currently learning', 'info'),
      ...bullets(profile.currentlyLearning),
    ],
  }
}

function projects(): CommandResult {
  if (profile.projects.length === 0) return notice('No projects yet. Add them in src/data/profile.ts')

  return {
    lines: joinBlocks(
      profile.projects.map((project, index) => {
        const number = String(index + 1).padStart(2, '0')
        return [
          line(`${number}  ${project.name}`, 'info'),
          line(`    ${project.description}`),
          ...(project.technologies.length > 0
            ? [line(`    ${project.technologies.join(' · ')}`, 'muted')]
            : []),
          line(`    cat projects/project-${number}.tsx`, 'muted'),
        ]
      }),
    ),
  }
}

function skills(): CommandResult {
  const { technical, tools } = profile.skills
  return {
    lines: [
      line('Technical', 'info'),
      ...bullets(technical, '(none listed yet)'),
      line(''),
      line('Tools', 'info'),
      ...bullets(tools, '(none listed yet)'),
    ],
  }
}

function experience(): CommandResult {
  if (profile.experience.length === 0) return notice('No experience listed yet.')

  return {
    lines: joinBlocks(
      profile.experience.map((item) => [
        line(`${item.role} — ${item.organization}`, 'info'),
        line(item.period, 'muted'),
        ...bullets(item.highlights),
      ]),
    ),
  }
}

function education(): CommandResult {
  if (profile.education.length === 0) return notice('No education listed yet.')

  return {
    lines: joinBlocks(
      profile.education.map((item) => [
        line(item.institution, 'info'),
        line(item.degree),
        line(item.period, 'muted'),
        ...bullets(item.details),
      ]),
    ),
  }
}

function contact(): CommandResult {
  return {
    lines: [
      line('Contact', 'info'),
      line(`  email     ${profile.email}`),
      line(`  github    ${profile.github}`),
      line(`  linkedin  ${profile.linkedin}`),
    ],
  }
}

// ---------- shell commands ----------

function help(): CommandResult {
  const rows: [string, string][] = [
    ...COMMANDS.map((command): [string, string] => [command.name, command.description]),
    ['print("hi")', 'Print text (console.log("hi") works too)'],
  ]
  const width = Math.max(...rows.map(([name]) => name.length)) + 2

  return {
    lines: [
      line('Available commands:', 'info'),
      ...rows.map(([name, description]) => line(`  ${name.padEnd(width)}${description}`)),
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

function git(args: string[]): CommandResult {
  if (args[0] === 'status') {
    return {
      lines: [
        line('On branch main'),
        line('Your portfolio is clean.', 'success'),
        line('Nothing to commit.'),
        line('Everything to discover.', 'info'),
      ],
    }
  }
  if (!args[0]) return notice('usage: git <command>  (try: git status)')
  return failure(`git: '${args[0]}' is not a git command.`)
}

function neofetch(): CommandResult {
  const title = `${PROMPT_USER}@${PROMPT_HOST}`
  const fields: [string, string][] = [
    ['Role', profile.role],
    ['Focus', profile.interests.slice(0, 2).join(' / ')],
    ['Shell', `${PROMPT_USER}-shell`],
    ['Files', String(filesByPath.size)],
    ['Status', 'Building'],
  ]

  return {
    lines: [
      line(`${PROMPT_USER.toUpperCase()}.DEV`, 'info'),
      line(title),
      line('─'.repeat(title.length), 'muted'),
      ...fields.map(([label, value]) => line(`${`${label}:`.padEnd(9)}${value}`)),
    ],
  }
}

function coffee(): CommandResult {
  return {
    lines: [
      line('☕ Brewing motivation...', 'muted'),
      line(`${'█'.repeat(20)} 100%`, 'info'),
      line('Ready to code.', 'success'),
    ],
  }
}

function sudo(args: string[]): CommandResult {
  if (args.length === 0) return notice('usage: sudo <command>')

  if (args.join(' ').toLowerCase() === `hire ${PROMPT_USER}`) {
    return {
      lines: [
        line('Checking permissions...', 'muted'),
        line('Nice try.', 'info'),
        line('You already have root access to this portfolio.'),
      ],
    }
  }
  return failure(`sudo: ${args[0]}: command not found`)
}

const COMMANDS: Command[] = [
  { name: 'help', description: 'Show this list', run: help },
  { name: 'about', description: 'Who I am', run: about },
  { name: 'projects', description: 'Things I have built', run: projects },
  { name: 'skills', description: 'Languages and tools', run: skills },
  { name: 'experience', description: 'Where I have worked', run: experience },
  { name: 'education', description: 'Where I study', run: education },
  { name: 'contact', description: 'How to reach me', run: contact },
  { name: 'ls', description: 'List files (try: ls projects)', run: ls },
  { name: 'cat', description: 'Print a file (try: cat README.md)', run: cat },
  { name: 'pwd', description: 'Print the working directory', run: () => plain(HOME_PATH) },
  { name: 'whoami', description: 'Show who is logged in', run: () => plain(PROMPT_USER) },
  { name: 'git', description: 'Try: git status', run: git },
  { name: 'neofetch', description: 'System summary', run: neofetch },
  { name: 'coffee', description: 'Brew some motivation', run: coffee },
  { name: 'sudo', description: 'Try your luck', run: sudo },
  {
    name: 'clear',
    description: 'Clear the terminal (Ctrl+L)',
    run: () => ({ lines: [], clear: true }),
  },
]

// ---------- the entry point ----------

const PRINT_CALL = /^(?:print|console\.log)\s*\(([\s\S]*)\)\s*;?\s*$/

export function runCommand(input: string): CommandResult {
  const text = input.trim()

  // print(...) and console.log(...) need the raw text, so they are checked first.
  if (/^(?:print|console\.log)\b/.test(text)) {
    const call = PRINT_CALL.exec(text)
    return call ? printValues(call[1]) : PARSE_ERROR
  }
  if (/^["'`]/.test(text)) return printValues(text)

  const [name, ...args] = text.split(/\s+/)
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