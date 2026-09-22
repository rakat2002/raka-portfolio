import { useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { EXTENSIONS } from '../../lib/extensions'
import type { useExtensions } from '../../hooks/useExtensions'

const INSTALL_MS = 700

interface ExtensionsPanelProps {
  extensions: ReturnType<typeof useExtensions>
}

export default function ExtensionsPanel({ extensions }: ExtensionsPanelProps) {
  const { isInstalled, install, uninstall, activeThemeId, setActiveThemeId } = extensions
  const [installing, setInstalling] = useState<Set<string>>(new Set())

  const handleInstall = (id: string) => {
    setInstalling((current) => new Set(current).add(id))
    window.setTimeout(() => {
      install(id)
      setInstalling((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }, INSTALL_MS)
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
      <ul className="space-y-1">
        {EXTENSIONS.map((ext) => {
          const installedNow = isInstalled(ext.id)
          const isInstallingNow = installing.has(ext.id)
          const isActiveTheme = activeThemeId === ext.id

          return (
            <li key={ext.id} className="rounded-md border border-line bg-panel p-2.5">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded bg-highlight text-accent-2">
                  <Palette size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{ext.name}</p>
                  <p className="text-[11px] text-ink-faint">{ext.publisher}</p>
                  <p className="mt-1 text-[12px] leading-snug text-ink-dim">{ext.description}</p>

                  <div className="mt-2 flex items-center gap-2">
                    {!installedNow && (
                      <button type="button" disabled={isInstallingNow} onClick={() => handleInstall(ext.id)}
                        className="rounded border border-edge/50 px-2 py-1 text-[11px] font-medium text-ink transition-colors hover:bg-highlight disabled:opacity-60"
                      >
                        {isInstallingNow ? 'Installing…' : 'Install'}
                      </button>
                    )}

                    {installedNow && (
                      <>
                        <button type="button" disabled={isActiveTheme} onClick={() => setActiveThemeId(ext.id)}
                          className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                            isActiveTheme ? 'bg-selection text-white' : 'border border-edge/50 text-ink hover:bg-highlight'
                          }`}
                        >
                          {isActiveTheme && <Check size={11} aria-hidden="true" />}
                          {isActiveTheme ? 'Active' : 'Activate'}
                        </button>
                        <button type="button" onClick={() => uninstall(ext.id)}
                          className="text-[11px] text-ink-faint underline-offset-2 hover:text-ink hover:underline"
                        >
                          Uninstall
                        </button>
                      </>
                    )}
                  </div>

                  {isInstallingNow && (
                    <div className="mt-2 h-0.5 overflow-hidden rounded bg-line">
                      <div className="launch-progress h-full bg-accent" style={{ animationDuration: `${INSTALL_MS}ms` }} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}