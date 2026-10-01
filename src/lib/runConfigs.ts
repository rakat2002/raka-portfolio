import { profile } from '../data/profile'
import { isPlaceholder } from './placeholders'
import type { OutputLine } from './terminal'

export interface RunConfig {
  projectName: string
  command: string
  lines: OutputLine[]
  externalUrl?: string
  loadingLabel?: string
}

const line = (text: string, delay = 0, tone?: OutputLine['tone']): OutputLine => ({ text, tone, delay })

const CURATED: RunConfig[] = [
  {
    projectName: 'Loan Approval Prediction',
    command: 'open notebook',
    externalUrl: 'https://colab.research.google.com/drive/1CTVuf42zJiOLG52V1LFORrGaRz-ojgb9',
    loadingLabel: 'Loading project CSE422: Artificial Intelligence...',
    lines: [
      line('Opening Loan Approval Prediction in Google Colab...', 200, 'muted'),
      line('✓ Launching notebook', 250, 'success'),
    ],
  },
  {
    projectName: 'Machine Translation of Bangla Regional Dialects',
    command: 'open notebook',
    externalUrl: 'https://colab.research.google.com/drive/1kMxlB1xkpFuM09RLOBBUBEiBKIY8PTsw',
    loadingLabel: 'Loading project CSE427: Machine Learning...',
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

// Opens a new tab immediately (must happen inside the original click, or popup blockers
// step in) with a small themed screen that shows a real link to the notebook. The visitor
// clicks it when ready, so Colab's own loading state is expected, not a mystery blank gap.
export function openExternal(url: string, label: string) {
  const win = window.open('', '_blank')
  if (!win) {
    window.location.href = url
    return
  }

  win.document.title = label
  win.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { height: 100%; margin: 0; background: #1d0116; }
  body {
    display: flex; align-items: center; justify-content: center;
    font-family: ui-sans-serif, system-ui, sans-serif;
  }
  .wrap { text-align: center; max-width: 320px; padding: 0 20px; }
  p.label { color: #cc7db2; font-size: 14px; margin: 0 0 18px; }
  a.open {
    display: inline-flex; align-items: center; gap: 8px;
    background: #ff00aa; color: #fff; text-decoration: none;
    font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 6px;
    transition: opacity 0.15s ease;
  }
  a.open:hover { opacity: 0.85; }
  p.hint { color: #8a6d7e; font-size: 12px; margin: 14px 0 0; }
</style>
</head>
<body>
  <div class="wrap">
    <p class="label">${label}</p>
    <a class="open" href="${url}">Open in Google Colab →</a>
    <p class="hint">Colab may take a few seconds to load once opened.</p>
  </div>
</body>
</html>`)
  win.document.close()
}