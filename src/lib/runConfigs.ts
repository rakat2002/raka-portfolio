import { profile } from '../data/profile'
import { isPlaceholder } from './placeholders'
import type { OutputLine } from './terminal'

export interface RunConfig {
  projectName: string
  command: string
  lines: OutputLine[]
  externalUrl?: string
  /** Shown on the interstitial tab while the external page (e.g. Colab) is still loading. */
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

// Opens a new tab immediately (avoids popup blockers, since this runs inside a click
// handler), fills it with a small themed loading screen, then hands off to the real URL
// a moment later, so the visitor never sees a blank white tab while Colab boots up.
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
  body { display: flex; align-items: center; justify-content: center; font-family: ui-sans-serif, system-ui, sans-serif; }
  .wrap { text-align: center; }
  .spinner { width: 28px; height: 28px; margin: 0 auto 16px; border-radius: 50%; border: 3px solid #52003e; border-top-color: #ff00aa; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  p { color: #cc7db2; font-size: 14px; margin: 0 0 4px; }
  p.hint { color: #8a6d7e; font-size: 12px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="spinner"></div>
    <p>${label}</p>
    <p class="hint">Opening Google Colab, this can take a few seconds...</p>
  </div>
</body>
</html>`)
  win.document.close()

  window.setTimeout(() => {
    win.location.href = url
  }, 3000)
}