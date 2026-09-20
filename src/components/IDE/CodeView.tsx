import { useMemo, useState } from 'react'
import type { FileNode } from '../../data/portfolioFiles'
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

interface CodeViewProps {
  file: FileNode
}

export default function CodeView({ file }: CodeViewProps) {
  const [currentLine, setCurrentLine] = useState(1)

  const lines = useMemo(
    () => file.content.split('\n').map((line) => highlightLine(line, file.language)),
    [file],
  )

  return (
    <div
      role="region"
      aria-label={`${file.name} contents`}
      tabIndex={0}
      className="min-h-0 flex-1 overflow-auto bg-editor py-2 font-mono text-[13px] leading-[22px]"
    >
      <div className="w-max min-w-full">
        {lines.map((tokens, index) => {
          const number = index + 1
          const current = number === currentLine
          return (
            <div
              key={number}
              onClick={() => setCurrentLine(number)}
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
              <code className="whitespace-pre pr-8">
                {tokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={TOKEN_CLASS[token.type]}>
                    {token.text}
                  </span>
                ))}
              </code>
            </div>
          )
        })}
      </div>
    </div>
  )
}