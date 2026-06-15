import { useRef, useEffect } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import AuroraBackground from '../AuroraBackground'

gsap.registerPlugin(ScrollTrigger)

// Quick glitch scramble function for individual words
const scrambleText = (element: HTMLElement, originalText: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
  let iteration = 0
  const maxIterations = originalText.length
  
  if ((element as any).scrambleInterval) {
    clearInterval((element as any).scrambleInterval)
  }

  const interval = setInterval(() => {
    element.innerText = originalText
      .split('')
      .map((char, i) => {
        if (i < iteration) return char
        if (char === ' ') return ' '
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')
    
    iteration += 1 / 3
    
    if (iteration >= maxIterations) {
      clearInterval(interval)
      element.innerText = originalText
    }
  }, 30)

  ;(element as any).scrambleInterval = interval
}

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const skillsWrapperRef = useRef<HTMLDivElement>(null)

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
        opacity: 0.4, // Increased idle opacity so it's clearly visible
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

  // 2. Magnetic Typography Hover Physics & Global Parallax
  useEffect(() => {
    const container = containerRef.current
    const wrapper = skillsWrapperRef.current
    const items = gsap.utils.toArray('.skill-item') as HTMLElement[]
    
    if (!container || !wrapper || !items.length) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Global Subtle Parallax on the entire grid
      // Disable on mobile to prevent sticking/lag
      if (innerWidth >= 768) {
        const xPos = (clientX / innerWidth - 0.5) * 40
        const yPos = (clientY / innerHeight - 0.5) * 40
        
        gsap.to(wrapper, {
          x: -xPos * 0.5,
          y: -yPos * 0.5,
          rotateX: yPos * 0.2,
          rotateY: xPos * 0.2,
          duration: 1,
          ease: 'power3.out',
          overwrite: 'auto'
        })
      }

      // Individual Character Magnetic Pull & Spotlight
      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const itemCenterX = rect.left + rect.width / 2
        const itemCenterY = rect.top + rect.height / 2

        const distX = clientX - itemCenterX
        const distY = clientY - itemCenterY
        const distance = Math.sqrt(distX * distX + distY * distY)

        // Smaller spotlight radius on mobile so it focuses on the center
        const maxDistance = innerWidth < 768 ? 180 : 300 

        if (distance < maxDistance) {
          const pull = (maxDistance - distance) / maxDistance
          const pullX = distX * pull * 0.35 
          const pullY = distY * pull * 0.35

          // Trigger scramble text once when entering magnetic field
          if (item.dataset.isHovered !== 'true' && pull > 0.4) {
            item.dataset.isHovered = 'true'
            const text = item.dataset.text
            if (text) scrambleText(item, text)
          }

          gsap.to(item, {
            x: pullX,
            y: pullY,
            scale: 1 + (pull * 0.2), // Pop up slightly more
            color: '#ffffff',
            opacity: 0.4 + (pull * 0.6), // Brighten up to 1.0
            textShadow: `0 0 ${(pull * 25).toFixed(1)}px rgba(79, 107, 246, ${(pull * 0.8).toFixed(2)})`, 
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        } else {
          // Spring back and dim out
          item.dataset.isHovered = 'false'
          gsap.to(item, {
            x: 0,
            y: 0,
            scale: 1,
            color: '#ffffff',
            opacity: 0.4, // Dim background state
            textShadow: 'none',
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
          })
        }
      })
    }

    const handleMouseLeave = () => {
      // Reset global parallax
      gsap.to(wrapper, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' })
      
      // Reset items
      items.forEach((item) => {
        item.dataset.isHovered = 'false'
        gsap.to(item, { 
          x: 0, y: 0, scale: 1, color: '#ffffff', opacity: 0.4, textShadow: 'none',
          duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' 
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Mobile Virtual Mouse: Simulate a mouse hovering in the center of the screen as the user scrolls
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const virtualX = window.innerWidth / 2
        const virtualY = window.innerHeight / 2
        handleMouseMove({ clientX: virtualX, clientY: virtualY } as MouseEvent)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      id="skills" 
      className="py-32 md:py-48 relative overflow-hidden bg-[#000000] min-h-[100vh] flex flex-col justify-center z-10"
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
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-16 md:gap-y-10 max-w-5xl [transform-style:preserve-3d]"
          style={{ perspective: '1200px' }}
        >
          {allSkills.map((skill, i) => (
            <div 
              key={i} 
              data-text={skill}
              className="skill-item inline-block cursor-crosshair transform-gpu text-[clamp(1rem,2vw,1.5rem)] font-mono tracking-[0.2em] uppercase transition-colors will-change-transform"
              style={{ color: '#ffffff', opacity: 0 }}
            >
              {skill}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
