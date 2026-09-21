import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { profile } from '../../data/profile'

const FRAME = 'h-36 w-28 shrink-0 rounded-md border border-zinc-300 print:h-32 print:w-24'

export default function CVPhoto() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div role="img" aria-label="Profile photo placeholder" className={`${FRAME} grid place-items-center bg-zinc-100 text-zinc-400`}>
        <UserRound size={36} strokeWidth={1.25} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={112} height={144}
      onError={() => setFailed(true)} className={`${FRAME} object-cover`} />
  )
}