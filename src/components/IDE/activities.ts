import { BugPlay, Blocks, Files, GitBranch, Search, type LucideIcon } from 'lucide-react'

export type ActivityId = 'explorer' | 'search' | 'source-control' | 'run' | 'extensions'

export interface Activity {
  id: ActivityId
  label: string
  icon: LucideIcon
}

export const ACTIVITIES: Activity[] = [
  { id: 'explorer', label: 'Explorer', icon: Files },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'source-control', label: 'Source Control', icon: GitBranch },
  { id: 'run', label: 'Run and Debug', icon: BugPlay },
  { id: 'extensions', label: 'Extensions', icon: Blocks },
]