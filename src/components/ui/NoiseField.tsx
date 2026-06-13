// NoiseField — Full-viewport reactive simplex noise canvas background
import { useEffect, useRef, useCallback } from 'react'
import { createNoise3D } from 'simplex-noise'

export default function NoiseField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const scrollVelocityRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const timeRef = useRef(0)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const noise3D = createNoise3D()

    // Performance: render at 50% resolution, CSS scales up 2x
    const resize = () => {
      const dpr = 0.5 // Half resolution for performance
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    // Track scroll velocity
    const trackScroll = () => {
      const currentY = window.scrollY
      const delta = Math.abs(currentY - lastScrollYRef.current)
      // Clamp to 0–100px/frame, smooth with lerp
      const clampedDelta = Math.min(delta, 100)
      scrollVelocityRef.current += (clampedDelta - scrollVelocityRef.current) * 0.1
      lastScrollYRef.current = currentY
    }

    window.addEventListener('scroll', trackScroll, { passive: true })

    // Accent color: #d4f57a → RGB(212, 245, 122)
    const accentR = 212
    const accentG = 245
    const accentB = 122

    const animate = () => {
      const w = canvas.width
      const h = canvas.height

      // Map scroll velocity to noise frequency
      // Slow scroll = 0.003 (calm), fast scroll = 0.008 (turbulent)
      const velocity = scrollVelocityRef.current
      const frequency = 0.003 + (velocity / 100) * 0.005

      // Time-based drift
      timeRef.current += 0.0005

      const imageData = ctx.createImageData(w, h)
      const data = imageData.data

      // Sample at lower resolution for extra performance (every 2nd pixel)
      const step = 2
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const noiseVal = noise3D(
            x * frequency,
            y * frequency,
            timeRef.current
          )

          // Normalize from [-1, 1] to [0, 1]
          const normalized = (noiseVal + 1) * 0.5

          // Base color: #080808 (8, 8, 8)
          // Shift toward accent at 5% opacity based on noise value
          const accentIntensity = normalized * 0.05
          const r = Math.floor(8 + (accentR - 8) * accentIntensity)
          const g = Math.floor(8 + (accentG - 8) * accentIntensity)
          const b = Math.floor(8 + (accentB - 8) * accentIntensity)

          // Fill the step×step block
          for (let dy = 0; dy < step && y + dy < h; dy++) {
            for (let dx = 0; dx < step && x + dx < w; dx++) {
              const idx = ((y + dy) * w + (x + dx)) * 4
              data[idx] = r
              data[idx + 1] = g
              data[idx + 2] = b
              data[idx + 3] = 255
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Decay scroll velocity when not scrolling
      scrollVelocityRef.current *= 0.95

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', trackScroll)
    }
  }, [])

  useEffect(() => {
    const cleanup = render()

    return () => {
      cancelAnimationFrame(rafRef.current)
      cleanup?.()
    }
  }, [render])

  return (
    <>
      {/* Noise canvas — fixed, full viewport, behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          pointerEvents: 'none',
          imageRendering: 'auto',
          transform: 'scale(1)', // Canvas is already sized via dpr, CSS fills viewport
        }}
        aria-hidden="true"
      />

      {/* PatternCraft dot grid overlay at 4% opacity */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 0.04,
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
    </>
  )
}
