import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

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

function ActionItem({ action, onDone }: { action: MenuAction; onDone: () => void }) {
  if (action.disabled) {
    return <p className="px-3 py-1.5 text-ink-faint">{action.label}</p>
  }
  if (action.href) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" role="menuitem" onClick={onDone}
        className="block px-3 py-1.5 hover:bg-list-hover hover:text-white"
      >
        {action.label}
      </a>
    )
  }
  return (
    <button type="button" role="menuitem"
      onClick={() => {
        action.onSelect?.()
        onDone()
      }}
      className="block w-full px-3 py-1.5 text-left hover:bg-list-hover hover:text-white"
    >
      {action.label}
    </button>
  )
}

// Desktop: a row of buttons, each opening its own dropdown.
function DesktopMenuBar({ menus }: MenuBarProps) {
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
                {menu.actions.map((action) => (
                  <ActionItem key={action.label} action={action} onDone={() => setOpenId(null)} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// Mobile: a single hamburger button that opens every menu's items, grouped, in one sheet.
function MobileMenuBar({ menus }: MenuBarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center md:hidden">
      <button type="button" aria-label="Menu" aria-haspopup="menu" aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid h-7 w-7 place-items-center rounded transition-colors hover:bg-highlight"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <>
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/50" />
          <div role="menu" aria-label="Application menu"
            className="fixed left-0 right-0 top-9 z-40 max-h-[70vh] overflow-y-auto bg-panel py-2 text-[13px] text-ink shadow-2xl shadow-black/50"
          >
            {menus.map((menu) => (
              <div key={menu.id} className="px-1 py-1">
                <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  {menu.label}
                </p>
                {menu.actions.length === 0 && (
                  <p className="px-3 py-1.5 text-ink-faint">Nothing here yet.</p>
                )}
                {menu.actions.map((action) => (
                  <ActionItem key={action.label} action={action} onDone={() => setOpen(false)} />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function MenuBar({ menus }: MenuBarProps) {
  return (
    <>
      <DesktopMenuBar menus={menus} />
      <MobileMenuBar menus={menus} />
    </>
  )
}