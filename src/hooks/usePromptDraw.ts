import { useEffect, useRef, useState } from 'react'
import { createShuffleBag } from '../utils/shuffle'

export type DrawState =
  | { status: 'idle'; prompt: null }
  | { status: 'animating' | 'revealed'; prompt: string }

export function usePromptDraw(locations: readonly string[] | null) {
  const [bag] = useState(() => locations && createShuffleBag(locations))
  const [state, setState] = useState<DrawState>({ status: 'idle', prompt: null })
  const locked = useRef(false)
  const timers = useRef<{ interval?: number; timeout?: number }>({})

  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      window.clearInterval(activeTimers.interval)
      window.clearTimeout(activeTimers.timeout)
    }
  }, [])

  function draw(): void {
    // Close the gap before React renders the disabled button.
    if (locked.current || !bag || !locations) return
    locked.current = true
    const result = bag.draw()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState({ status: 'revealed', prompt: result })
      locked.current = false
      return
    }

    // Visual previews never draw from the bag or change the locked result.
    let previewIndex = (locations.indexOf(result) + 1) % locations.length
    setState({ status: 'animating', prompt: locations[previewIndex] })
    timers.current.interval = window.setInterval(() => {
      previewIndex = (previewIndex + 1) % locations.length
      setState({ status: 'animating', prompt: locations[previewIndex] })
    }, 90)
    timers.current.timeout = window.setTimeout(() => {
      window.clearInterval(timers.current.interval)
      timers.current.interval = undefined
      timers.current.timeout = undefined
      setState({ status: 'revealed', prompt: result })
      locked.current = false
    }, 1500)
  }

  return { state, draw }
}
