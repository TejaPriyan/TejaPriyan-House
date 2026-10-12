import { useRef, useCallback, useEffect } from 'react'

/**
 * Virtual joystick for mobile touch controls.
 * Returns dx, dz in [-1, 1] range via the store.
 */
export function useTouch(stRef) {
  const ongoingRef = useRef(null)

  const handleStart = useCallback((e) => {
    // only track touches on the left half of the screen (movement)
    const t = e.changedTouches[0]
    if (t.clientX < window.innerWidth * 0.5) {
      ongoingRef.current = { id: t.identifier, sx: t.clientX, sy: t.clientY }
    }
  }, [])

  const handleMove = useCallback((e) => {
    if (!ongoingRef.current) return
    const t = Array.from(e.changedTouches).find(
      (c) => c.identifier === ongoingRef.current.id
    )
    if (!t) return
    const dx = (t.clientX - ongoingRef.current.sx) / 60
    const dy = (t.clientY - ongoingRef.current.sy) / 60
    stRef.current.touchDx = Math.max(-1, Math.min(1, dx))
    stRef.current.touchDz = Math.max(-1, Math.min(1, dy))
  }, [stRef])

  const handleEnd = useCallback((e) => {
    if (!ongoingRef.current) return
    const t = Array.from(e.changedTouches).find(
      (c) => c.identifier === ongoingRef.current.id
    )
    if (t) {
      ongoingRef.current = null
      stRef.current.touchDx = 0
      stRef.current.touchDz = 0
    }
  }, [stRef])

  useEffect(() => {
    const opts = { passive: false }
    document.addEventListener('touchstart', handleStart, opts)
    document.addEventListener('touchmove', handleMove, opts)
    document.addEventListener('touchend', handleEnd)
    document.addEventListener('touchcancel', handleEnd)
    return () => {
      document.removeEventListener('touchstart', handleStart)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
      document.removeEventListener('touchcancel', handleEnd)
    }
  }, [handleStart, handleMove, handleEnd])
}

/**
 * Touch look: right-half touch drags control camera yaw/pitch.
 */
export function useTouchLook(stRef) {
  const ongoingRef = useRef(null)

  const handleStart = useCallback((e) => {
    const t = e.changedTouches[0]
    if (t.clientX >= window.innerWidth * 0.5) {
      ongoingRef.current = { id: t.identifier, lx: t.clientX, ly: t.clientY }
    }
  }, [])

  const handleMove = useCallback((e) => {
    if (!ongoingRef.current) return
    const t = Array.from(e.changedTouches).find(
      (c) => c.identifier === ongoingRef.current.id
    )
    if (!t) return
    const dx = t.clientX - ongoingRef.current.lx
    const dy = t.clientY - ongoingRef.current.ly
    stRef.current.ty -= dx * 0.004
    stRef.current.tp = Math.max(-1.2, Math.min(1.2, stRef.current.tp - dy * 0.004))
    ongoingRef.current.lx = t.clientX
    ongoingRef.current.ly = t.clientY
  }, [stRef])

  const handleEnd = useCallback((e) => {
    if (!ongoingRef.current) return
    const t = Array.from(e.changedTouches).find(
      (c) => c.identifier === ongoingRef.current.id
    )
    if (t) ongoingRef.current = null
  }, [])

  useEffect(() => {
    const opts = { passive: false }
    document.addEventListener('touchstart', handleStart, opts)
    document.addEventListener('touchmove', handleMove, opts)
    document.addEventListener('touchend', handleEnd)
    document.addEventListener('touchcancel', handleEnd)
    return () => {
      document.removeEventListener('touchstart', handleStart)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
      document.removeEventListener('touchcancel', handleEnd)
    }
  }, [handleStart, handleMove, handleEnd])
}
