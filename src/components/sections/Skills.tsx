// Skills section — infinite GSAP marquee with pause-on-hover and glow effects
import { useRef } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const tween1Ref = useRef<gsap.core.Tween | null>(null)
  const tween2Ref = useRef<gsap.core.Tween | null>(null)

  const allSkills = Object.values(skills).flatMap(cat => cat.items)
  const row1 = allSkills.slice(0, Math.ceil(allSkills.length / 2))
  const row2 = allSkills.slice(Math.ceil(allSkills.length / 2))

  useGSAP(() => {
    tween1Ref.current = gsap.to(row1Ref.current, {
      xPercent: -50,
      ease: 'none',
      duration: 40,
      repeat: -1,
    })

    tween2Ref.current = gsap.fromTo(row2Ref.current,
      { xPercent: -50 },
      {
        xPercent: 0,
        ease: 'none',
        duration: 45,
        repeat: -1,
      }
    )
  }, { scope: containerRef })

  const handleMouseEnter = () => {
    if (tween1Ref.current) gsap.to(tween1Ref.current, { timeScale: 0, duration: 0.5 })
    if (tween2Ref.current) gsap.to(tween2Ref.current, { timeScale: 0, duration: 0.5 })
  }

  const handleMouseLeave = () => {
    if (tween1Ref.current) gsap.to(tween1Ref.current, { timeScale: 1, duration: 0.8 })
    if (tween2Ref.current) gsap.to(tween2Ref.current, { timeScale: 1, duration: 0.8 })
  }

  return (
    <section ref={containerRef} id="skills" className="py-28 relative overflow-hidden bg-transparent border-y border-white/[0.04] z-10">
      <div className="mb-16 text-center">
        <h2 className="section-heading text-text-primary mb-2">
          ENGINEERING <span className="text-aurora-purple italic">ARSENAL</span>
        </h2>
      </div>

      <div
        className="flex flex-col gap-6 overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade masks */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-48 bg-gradient-to-r from-space-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-48 bg-gradient-to-l from-space-900 to-transparent z-10 pointer-events-none" />

        {/* Row 1 — moves left */}
        <div ref={row1Ref} className="flex whitespace-nowrap w-max gap-3 md:gap-5">
          {[...row1, ...row1, ...row1, ...row1].map((skill, i) => (
            <div
              key={`r1-${i}`}
              className="inline-flex items-center justify-center px-5 md:px-8 py-3 rounded-full border border-white/[0.06] bg-white/[0.02] hover:border-aurora-purple/40 hover:bg-aurora-purple/[0.06] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-default select-none group"
            >
              <span className="font-display font-medium text-sm md:text-lg tracking-wide text-text-secondary group-hover:text-text-primary uppercase transition-colors duration-300">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2 — moves right */}
        <div ref={row2Ref} className="flex whitespace-nowrap w-max gap-3 md:gap-5">
          {[...row2, ...row2, ...row2, ...row2].map((skill, i) => (
            <div
              key={`r2-${i}`}
              className="inline-flex items-center justify-center px-5 md:px-8 py-3 rounded-full border border-white/[0.06] bg-white/[0.02] hover:border-aurora-blue/40 hover:bg-aurora-blue/[0.06] hover:shadow-[0_0_25px_-5px_rgba(79,107,246,0.3)] transition-all duration-300 cursor-default select-none group"
            >
              <span className="font-display font-medium text-sm md:text-lg tracking-wide text-text-secondary group-hover:text-text-primary uppercase transition-colors duration-300">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
