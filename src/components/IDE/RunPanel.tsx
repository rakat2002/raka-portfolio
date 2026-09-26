import { FileText, Play } from 'lucide-react'
import { CV_PATH } from '../../lib/browser'
import { getRunConfig, runnableProjects } from '../../lib/runConfigs'
import type { TerminalState } from '../../hooks/useTerminal'

interface RunPanelProps {
  terminal: TerminalState
  onLaunchCV: () => void
  onRunProgram: () => void
}

export default function RunPanel({ terminal, onLaunchCV, onRunProgram }: RunPanelProps) {
  const projects = runnableProjects()

  const runProject = (name: string, technologies: string[]) => {
    const config = getRunConfig(name, technologies)
    onRunProgram()
    terminal.runProgram(config.command, config.lines)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-3 py-3 text-[13px]">
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Portfolio</p>
        <button type="button" onClick={onLaunchCV}
          className="flex w-full items-center gap-2 rounded border border-line bg-editor px-3 py-2 text-left text-ink transition-colors hover:bg-highlight"
        >
          <FileText size={14} className="text-accent" aria-hidden="true" />
          <span>
            <span className="block font-medium">Launch CV</span>
            <span className="block text-[11px] text-ink-faint">Opens {CV_PATH} in the professional view</span>
          </span>
        </button>
      </div>

      {projects.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Run Project</p>
          <div className="space-y-1.5">
            {projects.map((project) => (
              <button key={project.name} type="button"
                onClick={() => runProject(project.name, project.technologies)}
                className="flex w-full items-center gap-2 rounded border border-line bg-editor px-3 py-2 text-left text-ink transition-colors hover:bg-highlight"
              >
                <Play size={14} className="text-accent" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{project.name}</span>
                  <span className="block truncate text-[11px] text-ink-faint">
                    {project.technologies.slice(0, 3).join(' · ') || 'Run in terminal'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-1 text-[12px] text-ink-faint">No active debugging session.</p>
    </div>
  )
}