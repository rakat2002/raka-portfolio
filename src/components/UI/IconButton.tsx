import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

export default function IconButton({
  label,
  className = '',
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid h-7 w-7 place-items-center rounded text-ink-dim transition-colors hover:bg-highlight hover:text-ink aria-pressed:text-accent ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}