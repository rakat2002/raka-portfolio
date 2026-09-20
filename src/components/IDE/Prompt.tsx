import { PROMPT_HOST, PROMPT_USER } from '../../lib/terminal'

export default function Prompt() {
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