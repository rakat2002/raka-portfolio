import type { Language } from '../data/portfolioFiles'

export type TokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'storage'
  | 'constant'
  | 'type'
  | 'variable'
  | 'function'
  | 'heading'

export interface Token {
  type: TokenType
  text: string
}

const STORAGE = new Set(['const', 'let', 'var', 'function', 'class', 'interface', 'type'])
const KEYWORDS = new Set(['export', 'default', 'import', 'from', 'return', 'as'])
const CONSTANTS = new Set(['true', 'false', 'null', 'undefined'])
const TYPES = new Set(['string', 'number', 'boolean', 'any', 'void', 'unknown'])

// One regex, read left to right. Each group is one kind of piece; the order matters
// because the first group that matches wins.
const CODE_PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g

function highlightCode(line: string): Token[] {
  const tokens: Token[] = []
  let expectName = false // true right after words like `const`

  for (const match of line.matchAll(CODE_PATTERN)) {
    const [text, comment, string, number, word, space] = match

    if (space) {
      tokens.push({ type: 'plain', text })
      continue
    }

    let type: TokenType = 'plain'
    if (comment) {
      type = 'comment'
    } else if (string) {
      type = 'string'
    } else if (number) {
      type = 'constant'
    } else if (word) {
      const rest = line.slice((match.index ?? 0) + text.length)
      if (STORAGE.has(word)) type = 'storage'
      else if (KEYWORDS.has(word)) type = 'keyword'
      else if (CONSTANTS.has(word)) type = 'constant'
      else if (TYPES.has(word)) type = 'type'
      else if (expectName) type = 'variable'
      else if (/^\s*:/.test(rest)) type = 'variable' // an object key like `name:`
      else if (/^\s*\(/.test(rest)) type = 'function' // a call like `log(`
    }

    expectName = type === 'storage'
    tokens.push({ type, text })
  }

  return tokens
}

function highlightMarkdown(line: string): Token[] {
  if (/^#{1,6}\s/.test(line)) return [{ type: 'heading', text: line }]
  if (/^─+$/.test(line)) return [{ type: 'comment', text: line }]
  if (line.startsWith('$ ')) {
    return [
      { type: 'keyword', text: '$' },
      { type: 'plain', text: ' ' },
      { type: 'string', text: line.slice(2) },
    ]
  }
  const bullet = /^(\s*)(-)(\s.*)$/.exec(line)
  if (bullet) {
    return [
      { type: 'plain', text: bullet[1] },
      { type: 'keyword', text: bullet[2] },
      { type: 'plain', text: bullet[3] },
    ]
  }
  if (/^_.*_$/.test(line)) return [{ type: 'comment', text: line }]
  return [{ type: 'plain', text: line }]
}

export function highlightLine(line: string, language: Language): Token[] {
  return language === 'markdown' ? highlightMarkdown(line) : highlightCode(line)
}