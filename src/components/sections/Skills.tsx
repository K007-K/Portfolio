import { useRef } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const skillCategories = Object.entries(skills).map(([key, value]) => ({
    id: key,
    ...value
  }))

  useGSAP(() => {
    // Entrance animation for the bento cards
    const cards = gsap.utils.toArray('.bento-card')
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      }
    })
  }, { scope: containerRef })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    cardsRef.current.forEach((card) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    })
  }

  return (
    <section ref={containerRef} id="skills" className="py-32 relative bg-transparent z-10">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="section-heading text-text-primary mb-16 text-center">
          ENGINEERING <span className="text-aurora-purple italic">ARSENAL</span>
        </h2>

        <div 
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative group"
        >
          {skillCategories.map((category, i) => {
            // Layout logic for the Bento Grid
            let spanClass = 'md:col-span-1 lg:col-span-1'
            if (i === 0) spanClass = 'md:col-span-2 lg:col-span-2' // Languages gets wide top
            if (i === 4) spanClass = 'md:col-span-2 lg:col-span-1' // Tools stretches on tablet, normal on desktop

            return (
              <div
                key={category.id}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`bento-card relative rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] overflow-hidden group/card hover:-translate-y-1 transition-all duration-500 min-h-[250px] ${spanClass}`}
              >
                {/* Active Spotlight Glow (Follows Mouse) */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                  style={{
                    background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(139,92,246,0.15), transparent 40%)'
                  }}
                />

                {/* Ambient Top Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-aurora-purple/10 rounded-full blur-[50px] pointer-events-none z-0 group-hover/card:bg-aurora-purple/20 transition-colors duration-500" />

                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-2xl shadow-inner shadow-white/[0.05]">
                      {category.icon}
                    </div>
                    <h3 className="font-display font-medium text-xl text-text-primary tracking-wide">
                      {category.label}
                    </h3>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {category.items.map((item) => (
                      <span 
                        key={item}
                        className="px-3.5 py-1.5 rounded-lg text-sm font-mono text-text-secondary bg-white/[0.02] border border-white/[0.06] group-hover/card:border-white/[0.15] group-hover/card:text-text-primary transition-colors duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
