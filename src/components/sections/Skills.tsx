import { useRef, useMemo } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Pill = ({ item, icon }: { item: string; icon: string }) => (
  <div className="group px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl whitespace-nowrap flex items-center gap-3 transition-all duration-500 hover:-translate-y-2 hover:scale-110 hover:bg-aurora-purple/20 hover:border-aurora-purple/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_40px_rgba(139,92,246,0.4)] cursor-crosshair will-change-transform">
    <span className="text-xl md:text-2xl drop-shadow-md group-hover:rotate-12 transition-transform duration-300">{icon}</span>
    <span className="font-display font-medium tracking-wide text-text-secondary group-hover:text-white transition-colors duration-300">
      {item}
    </span>
  </div>
)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  
  // Flatten skills and attach their parent category icon
  const allSkills = useMemo(() => {
    return Object.values(skills).flatMap(cat => 
      cat.items.map(item => ({ item, icon: cat.icon }))
    )
  }, [])

  // Create the 3 distinct rows (doubled for seamless infinite looping)
  const row1 = useMemo(() => [...allSkills, ...allSkills], [allSkills])
  const row2 = useMemo(() => {
    const reversed = [...allSkills].reverse()
    return [...reversed, ...reversed]
  }, [allSkills])
  const row3 = useMemo(() => {
    const offset = [...allSkills.slice(5), ...allSkills.slice(0, 5)]
    return [...offset, ...offset]
  }, [allSkills])

  useGSAP(() => {
    // Row 1 goes Left
    gsap.to('.marquee-row-1', {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: 'none'
    })
    
    // Row 2 goes Right (Start at -50% and move to 0%)
    gsap.fromTo('.marquee-row-2', 
      { xPercent: -50 },
      { xPercent: 0, repeat: -1, duration: 40, ease: 'none' }
    )

    // Row 3 goes Left (Slightly faster)
    gsap.to('.marquee-row-3', {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: 'none'
    })

    // Subtle entrance animation
    gsap.from('.marquee-wrapper', {
      opacity: 0,
      rotate: 0,
      scale: 0.9,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="skills" className="py-32 relative bg-transparent z-10 overflow-hidden min-h-[70vh] flex flex-col justify-center">
      
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 relative z-20">
        <h2 className="section-heading text-text-primary text-center">
          ENGINEERING <span className="text-aurora-purple italic">ARSENAL</span>
        </h2>
      </div>

      {/* The Diagonal Wrapper */}
      <div 
        className="marquee-wrapper relative w-[110vw] -ml-[5vw] flex flex-col gap-6 md:gap-8 rotate-[-4deg] scale-105"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
        }}
      >
        {/* Row 1 */}
        <div className="marquee-row-1 flex gap-6 md:gap-8 w-max hover:[animation-play-state:paused]">
          {row1.map((skill, i) => (
            <Pill key={`r1-${i}`} item={skill.item} icon={skill.icon} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="marquee-row-2 flex gap-6 md:gap-8 w-max">
          {row2.map((skill, i) => (
            <Pill key={`r2-${i}`} item={skill.item} icon={skill.icon} />
          ))}
        </div>

        {/* Row 3 */}
        <div className="marquee-row-3 flex gap-6 md:gap-8 w-max">
          {row3.map((skill, i) => (
            <Pill key={`r3-${i}`} item={skill.item} icon={skill.icon} />
          ))}
        </div>
      </div>
      
      {/* Ambient Backlight to make the glass pop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-aurora-purple/5 rounded-[100%] blur-[120px] pointer-events-none -z-10" />

    </section>
  )
}
