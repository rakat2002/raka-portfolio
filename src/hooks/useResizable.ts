import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

interface Options {
  initial: number
  min: number
  max: number
  axis: 'x' | 'y'
  /** true when dragging toward the top/left should make the element bigger (a bottom panel) */
  invert?: boolean
}

export interface ResizeHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

const KEY_STEP = 16

export function useResizable({ initial, min, max, axis, invert = false }: Options) {
  const [size, setSize] = useState(initial)
  const drag = useRef({ startPos: 0, startSize: 0 })
  const direction = invert ? -1 : 1

  const clamp = (value: number) => Math.min(max, Math.max(min, value))

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      startPos: axis === 'x' ? event.clientX : event.clientY,
      startSize: size,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const pos = axis === 'x' ? event.clientX : event.clientY
    setSize(clamp(drag.current.startSize + (pos - drag.current.startPos) * direction))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const forward = axis === 'x' ? 'ArrowRight' : 'ArrowDown'
    const backward = axis === 'x' ? 'ArrowLeft' : 'ArrowUp'
    if (event.key !== forward && event.key !== backward) return
    event.preventDefault()
    const step = (event.key === forward ? KEY_STEP : -KEY_STEP) * direction
    setSize((current) => clamp(current + step))
  }

  const handlers: ResizeHandlers = { onPointerDown, onPointerMove, onKeyDown }
  return { size, handlers }
}