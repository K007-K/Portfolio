import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollDivider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 95%',
        end: 'top 40%',
        scrub: 1.5, // Super smooth scrub
      }
    })

    // Expand line width
    tl.fromTo(lineRef.current, 
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, ease: 'power2.out' },
      0
    )

    // Expand glow
    tl.fromTo(glowRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.5, ease: 'power2.out' },
      0
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto flex justify-center py-12 relative z-20 overflow-hidden">
      <div className="relative w-full h-[2px] flex justify-center items-center">
        {/* The Core Laser Line */}
        <div 
          ref={lineRef}
          className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#4f6bf6] to-transparent origin-center will-change-transform"
        />
        {/* The Surrounding Glow */}
        <div 
          ref={glowRef}
          className="absolute h-[60px] w-full bg-[radial-gradient(ellipse_at_center,rgba(79,107,246,0.25)_0%,transparent_60%)] origin-center mix-blend-screen pointer-events-none will-change-transform"
        />
      </div>
    </div>
  )
}
