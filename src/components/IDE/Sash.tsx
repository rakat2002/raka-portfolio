import type { ResizeHandlers } from '../../hooks/useResizable'

interface SashProps {
  orientation: 'vertical' | 'horizontal'
  label: string
  handlers: ResizeHandlers
}

export default function Sash({ orientation, label, handlers }: SashProps) {
  const vertical = orientation === 'vertical'
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      tabIndex={0}
      {...handlers}
      className={`relative z-10 shrink-0 touch-none bg-edge outline-none transition-colors hover:bg-accent focus-visible:bg-accent ${
        vertical ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize'
      }`}
    >
      {/* Invisible wider hit area, so the thin line is easy to grab. Taller on touch/horizontal. */}
      <span
        className={
          vertical
            ? 'absolute inset-y-0 -left-1 -right-1'
            : 'absolute inset-x-0 -bottom-2 -top-2 md:-bottom-1 md:-top-1'
        }
      />
      {/* Visible grab handle, phone-only, for the panel's horizontal resize. */}
      {!vertical && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-edge md:hidden"
        />
      )}
    </div>
  )
}