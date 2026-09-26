import { profile } from '../data/profile'
import { isPlaceholder } from './placeholders'
import type { OutputLine } from './terminal'

export interface RunConfig {
  projectName: string
  command: string
  lines: OutputLine[]
  /** If set, opens this URL in a new tab once the terminal output finishes. */
  externalUrl?: string
}

const line = (text: string, delay = 0, tone?: OutputLine['tone']): OutputLine => ({ text, tone, delay })

const CURATED: RunConfig[] = [
  {
    projectName: 'Loan Approval Prediction',
    command: 'open notebook',
    externalUrl: 'https://colab.research.google.com/drive/1CTVuf42zJiOLG52V1LFORrGaRz-ojgb9',
    lines: [
      line('Opening Loan Approval Prediction in Google Colab...', 200, 'muted'),
      line('✓ Launching notebook', 250, 'success'),
    ],
  },
  {
    projectName: 'Machine Translation of Bangla Regional Dialects',
    command: 'open notebook',
    externalUrl: 'https://colab.research.google.com/drive/1kMxlB1xkpFuM09RLOBBUBEiBKIY8PTsw',
    lines: [
      line('Opening Machine Translation of Bangla Regional Dialects in Google Colab...', 200, 'muted'),
      line('✓ Launching notebook', 250, 'success'),
    ],
  },
]

function genericConfig(name: string, technologies: string[]): RunConfig {
  return {
    projectName: name,
    command: `run ${name.toLowerCase().replace(/\s+/g, '-')}`,
    lines: [
      line(`Initializing ${name}...`, 150, 'muted'),
      ...(technologies.length > 0
        ? [line(`Loading: ${technologies.join(', ')}...`, 200, 'muted')]
        : []),
      line(`Running ${name}...`, 250, 'muted'),
      line('✓ Done', 200, 'success'),
    ],
  }
}

export function getRunConfig(projectName: string, technologies: string[]): RunConfig {
  return CURATED.find((c) => c.projectName === projectName) ?? genericConfig(projectName, technologies)
}

export const runnableProjects = () => profile.projects.filter((p) => !isPlaceholder(p.name))

export function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}