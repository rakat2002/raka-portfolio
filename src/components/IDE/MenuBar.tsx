import { useEffect, useRef, useState } from 'react'

export interface MenuAction {
  label: string
  onSelect?: () => void
  href?: string
  disabled?: boolean
}

export interface MenuDef {
  id: string
  label: string
  actions: MenuAction[]
}

interface MenuBarProps {
  menus: MenuDef[]
}

export default function MenuBar({ menus }: MenuBarProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openId) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenId(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openId])

  const runAction = (action: MenuAction) => {
    if (action.disabled) return
    action.onSelect?.()
    setOpenId(null)
  }

  return (
    <nav ref={rootRef} aria-label="Application menu" className="hidden items-center md:flex">
      {menus.map((menu) => {
        const isOpen = openId === menu.id
        return (
          <div key={menu.id} className="relative">
            <button type="button" aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : menu.id)}
              className={`rounded px-2 py-1 transition-colors hover:bg-highlight ${isOpen ? 'bg-highlight' : ''}`}
            >
              {menu.label}
            </button>

            {isOpen && (
              <div role="menu" aria-label={menu.label}
                className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-md border border-edge/40 bg-panel py-1 text-[13px] text-ink shadow-lg shadow-black/40"
              >
                {menu.actions.length === 0 && (
                  <p className="px-3 py-1.5 text-ink-faint">Nothing here yet.</p>
                )}
                {menu.actions.map((action) =>
                  action.disabled ? (
                    <p key={action.label} className="px-3 py-1.5 text-ink-faint">
                      {action.label}
                    </p>
                  ) : action.href ? (
                    <a key={action.label} href={action.href}
                      target="_blank"
                      rel="noreferrer"
                      role="menuitem"
                      onClick={() => setOpenId(null)}
                      className="block px-3 py-1.5 hover:bg-list-hover hover:text-white"
                    >
                      {action.label}
                    </a>
                  ) : (
                    <button key={action.label} type="button"
                      role="menuitem"
                      onClick={() => runAction(action)}
                      className="block w-full px-3 py-1.5 text-left hover:bg-list-hover hover:text-white"
                    >
                      {action.label}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}