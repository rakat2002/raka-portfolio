import { CircleUser, Settings, type LucideIcon } from 'lucide-react'
import { ACTIVITIES, type ActivityId } from './activities'

interface ActivityButtonProps {
  label: string
  icon: LucideIcon
  selected?: boolean
  onClick?: () => void
}

function ActivityButton({ label, icon: Icon, selected = false, onClick }: ActivityButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={selected}
      onClick={onClick}
      className={`m-1 grid h-10 w-10 place-items-center rounded-lg transition-colors ${
        selected ? 'bg-selection text-ink' : 'text-ink-faint hover:bg-highlight hover:text-ink'
      }`}
    >
      <Icon size={22} strokeWidth={1.5} />
    </button>
  )
}

interface ActivityBarProps {
  active: ActivityId
  sidebarOpen: boolean
  onSelect: (id: ActivityId) => void
}

export default function ActivityBar({ active, sidebarOpen, onSelect }: ActivityBarProps) {
  return (
    <nav
      aria-label="Activity bar"
      className="flex w-12 shrink-0 flex-col justify-between border-r border-line bg-activitybar"
    >
      <div className="flex flex-col">
        {ACTIVITIES.map(({ id, label, icon }) => (
          <ActivityButton
            key={id}
            label={label}
            icon={icon}
            selected={id === active && sidebarOpen}
            onClick={() => onSelect(id)}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <ActivityButton label="Accounts" icon={CircleUser} />
        <ActivityButton label="Manage" icon={Settings} />
      </div>
    </nav>
  )
}