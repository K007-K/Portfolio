// Lightweight CSS-animated aurora gradient background with mouse tracking
import { useEffect, useRef } from 'react'

export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      container.style.setProperty('--mouse-x', `${x}%`)
      container.style.setProperty('--mouse-y', `${y}%`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Primary aurora blob — follows mouse */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] animate-aurora-drift"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          left: 'var(--mouse-x)',
          top: 'var(--mouse-y)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.8s ease-out, top 0.8s ease-out',
        }}
      />
      {/* Secondary blob — drifts independently */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-aurora-drift-2"
        style={{
          background: 'radial-gradient(circle, #4F6BF6 0%, transparent 70%)',
          right: '-10%',
          top: '20%',
        }}
      />
      {/* Tertiary blob — warm accent */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] animate-aurora-drift-3"
        style={{
          background: 'radial-gradient(circle, #FF3B30 0%, transparent 70%)',
          left: '10%',
          bottom: '10%',
        }}
      />
      {/* Noise texture overlay for grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
