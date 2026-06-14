import { useRef, useEffect } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import AuroraBackground from '../AuroraBackground'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const skillsWrapperRef = useRef<HTMLDivElement>(null)

  // Flatten all skills into a single array for the typographic cloud
  const allSkills = Object.values(skills).flatMap(cat => cat.items)

  // 1. Entrance Stagger Animation
  useGSAP(() => {
    const items = gsap.utils.toArray('.skill-item')
    
    gsap.fromTo(items, 
      {
        y: 60,
        opacity: 0,
        rotateX: -45,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    )
  }, { scope: containerRef })

  // 2. Magnetic Typography Hover Physics (Identical to Hero Section)
  useEffect(() => {
    const container = containerRef.current
    const items = gsap.utils.toArray('.skill-item') as HTMLElement[]
    
    if (!container || !items.length) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e

      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const itemCenterX = rect.left + rect.width / 2
        const itemCenterY = rect.top + rect.height / 2

        const distX = clientX - itemCenterX
        const distY = clientY - itemCenterY
        const distance = Math.sqrt(distX * distX + distY * distY)

        const maxDistance = 250 // Magnetic pull radius

        if (distance < maxDistance) {
          const pull = (maxDistance - distance) / maxDistance
          // The item pulls towards the mouse
          const pullX = distX * pull * 0.35 // 35% of the distance towards the mouse
          const pullY = distY * pull * 0.35

          gsap.to(item, {
            x: pullX,
            y: pullY,
            scale: 1 + (pull * 0.15), // Slight pop up to 1.15x
            color: '#ffffff', // Pure white core
            textShadow: '0 0 20px rgba(79, 107, 246, 0.8)', // Aurora-blue glow
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        } else {
          // Spring back to idle state
          gsap.to(item, {
            x: 0,
            y: 0,
            scale: 1,
            color: 'rgba(255, 255, 255, 0.3)', // Faded idle
            textShadow: '0 0 0px rgba(79, 107, 246, 0)',
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
          })
        }
      })
    }

    const handleMouseLeave = () => {
      items.forEach((item) => {
        gsap.to(item, { 
          x: 0, 
          y: 0, 
          scale: 1, 
          color: 'rgba(255, 255, 255, 0.3)', 
          textShadow: '0 0 0px rgba(79, 107, 246, 0)',
          duration: 0.8, 
          ease: 'elastic.out(1, 0.4)', 
          overwrite: 'auto' 
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      id="skills" 
      className="py-32 md:py-48 relative overflow-hidden bg-[#000000] min-h-screen flex flex-col justify-center z-10"
    >
      {/* Deep Aurora Background matching the Hero aesthetic */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <AuroraBackground />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Title matching Hero Section Typography */}
        <div className="mb-24 md:mb-32 flex flex-col items-center">
          <h2 className="font-hero hero-text text-[clamp(3rem,8vw,6rem)] uppercase tracking-widest text-center leading-[0.9]">
            <span className="text-white block">SKILL</span>
            <span className="text-aurora-blue block">MATRIX</span>
          </h2>
          <div className="w-16 h-px bg-aurora-blue mt-12 opacity-50" />
        </div>
        
        {/* Minimalist Typographic Cloud */}
        <div 
          ref={skillsWrapperRef}
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-16 md:gap-y-10 max-w-5xl"
          style={{ perspective: '1200px' }}
        >
          {allSkills.map((skill, i) => (
            <div 
              key={i} 
              className="skill-item inline-block cursor-crosshair transform-gpu text-[clamp(1rem,2vw,1.5rem)] font-mono tracking-[0.2em] uppercase transition-colors will-change-transform"
              style={{ color: 'rgba(255, 255, 255, 0.3)' }}
            >
              {skill}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
