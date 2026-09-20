import { ACTIVITIES, type ActivityId } from './activities'

interface SideBarProps {
  activity: ActivityId
  width: number
}

export default function SideBar({ activity, width }: SideBarProps) {
  const title = ACTIVITIES.find((item) => item.id === activity)?.label ?? ''

  return (
    <aside aria-label={title} style={{ width }} className="flex shrink-0 flex-col bg-sidebar">
      <h2 className="flex h-9 shrink-0 items-center px-5 text-[13px] font-medium text-ink">
        {title}
      </h2>
      <div className="flex-1 overflow-auto px-5 py-2 text-sm text-ink-faint">
        The {title} view arrives in the next steps.
      </div>
    </aside>
  )
}