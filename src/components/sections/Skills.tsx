import { useRef, useEffect } from 'react'
import { skills } from '../../lib/data'

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const isHovering = useRef(false)

  // Flatten and format skills
  const allSkills = Object.values(skills).flatMap((cat) => cat.items)
  const realText = allSkills.join(' / ').toUpperCase()

  // High-performance Scrambler
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
    const scramble = (str: string) => {
      let result = ''
      for (let i = 0; i < str.length; i++) {
        if (str[i] === ' ' || str[i] === '/') {
          result += str[i]
        } else {
          result += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      return result
    }

    let frame: number
    let lastTime = 0

    const updateMatrix = (time: number) => {
      if (time - lastTime > 100) { // Update glitch every 100ms
        if (bgRef.current) {
          bgRef.current.innerText = scramble(realText)
        }
        lastTime = time
      }
      frame = requestAnimationFrame(updateMatrix)
    }
    
    frame = requestAnimationFrame(updateMatrix)
    return () => cancelAnimationFrame(frame)
  }, [realText])

  // X-Ray Lens Auto-Pilot
  useEffect(() => {
    let frame: number
    let time = 0
    
    const animateLens = () => {
      if (!containerRef.current) return
      
      // Auto-pilot sweeps the lens in a figure-8 pattern if not hovering (Great for mobile!)
      if (!isHovering.current) {
        time += 0.015
        const rect = containerRef.current.getBoundingClientRect()
        const x = (Math.sin(time) * 0.4 + 0.5) * rect.width
        const y = (Math.sin(time * 2) * 0.3 + 0.5) * rect.height
        containerRef.current.style.setProperty('--mouse-x', `${x}px`)
        containerRef.current.style.setProperty('--mouse-y', `${y}px`)
      }
      
      frame = requestAnimationFrame(animateLens)
    }
    
    frame = requestAnimationFrame(animateLens)
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    isHovering.current = true

    const rect = containerRef.current.getBoundingClientRect()
    let clientX, clientY

    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseLeave = () => {
    isHovering.current = false
  }

  return (
    <section 
      ref={containerRef} 
      id="skills" 
      className="py-32 relative bg-transparent z-10 border-y border-white/[0.04] min-h-screen flex items-center overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
    >
      <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 md:px-12 pointer-events-none">
        
        <h2 className="section-heading text-text-primary mb-12 text-center opacity-20">
          SYSTEM <span className="text-aurora-purple italic">DECODER</span>
        </h2>

        {/* The X-Ray Illusion Container */}
        <div className="relative w-full font-display font-black text-[11vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] leading-[1.1] tracking-tighter text-center break-words select-none">
          
          {/* Layer 1: The Encrypted Matrix */}
          <div 
            ref={bgRef} 
            className="w-full text-text-primary/10 transition-colors duration-1000"
          >
            {realText}
          </div>

          {/* Layer 2: The Reality X-Ray */}
          <div 
            className="absolute inset-0 w-full text-transparent bg-clip-text bg-gradient-to-br from-[#4f6bf6] via-[#ffffff] to-[#8b5cf6] z-10"
            style={{
              WebkitMaskImage: 'radial-gradient(min(40vw, 400px) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 10%, transparent 80%)',
              maskImage: 'radial-gradient(min(40vw, 400px) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 10%, transparent 80%)',
            }}
          >
            {realText}
          </div>

          {/* Optional: Lens Rim Glow */}
          <div 
            className="absolute top-0 left-0 w-full h-full z-20 mix-blend-screen opacity-50"
            style={{
              background: 'radial-gradient(min(40vw, 400px) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.1) 0%, transparent 60%)',
            }}
          />
        </div>

      </div>
    </section>
  )
}
