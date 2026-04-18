// GlobalCursor — 12px circle + 4px trailing dot, lerp-smoothed with requestAnimationFrame
import { useEffect, useRef } from 'react'

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })
  const visible = useRef(false)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Detect touch device — hide custom cursor on mobile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      if (!visible.current) {
        visible.current = true
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
        if (dotRef.current) dotRef.current.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      visible.current = false
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (dotRef.current) dotRef.current.style.opacity = '0'
    }

    const handleMouseEnter = () => {
      visible.current = true
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
      if (dotRef.current) dotRef.current.style.opacity = '1'
    }

    const animate = () => {
      // Circle follows mouse with lerp 0.15 (faster)
      cursorPos.current.x = lerp(cursorPos.current.x, mouse.current.x, 0.15)
      cursorPos.current.y = lerp(cursorPos.current.y, mouse.current.y, 0.15)

      // Dot trails behind with lerp 0.08 (slower, creates trailing effect)
      dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.08)
      dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.08)

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x - 6}px, ${cursorPos.current.y - 6}px, 0)`
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 2}px, ${dotPos.current.y - 2}px, 0)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* 12px circle — follows closely */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: '1.5px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'difference',
        }}
        aria-hidden="true"
      />
      {/* 4px trailing dot — trails behind */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden="true"
      />
    </>
  )
}
