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
      {/* invisible wider hit area, so the 1px line is easy to grab */}
      <span
        className={
          vertical
            ? 'absolute inset-y-0 -left-1 -right-1'
            : 'absolute inset-x-0 -bottom-1 -top-1'
        }
      />
    </div>
  )
}