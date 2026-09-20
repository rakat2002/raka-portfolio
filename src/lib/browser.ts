import type { MouseEvent } from 'react'

// The address of the CV page. Every "open the CV" button uses this one value.
export const CV_PATH = '/cv'

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// True for an ordinary left click. Ctrl/Cmd/Shift-clicks are left to the browser,
// so people can still open a link in a new tab.
export const isPlainLeftClick = (event: MouseEvent): boolean =>
  event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey