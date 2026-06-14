import { useRef } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  
  const allSkills = Object.values(skills).flatMap(cat => cat.items)
  
  // Chunking helper to create the honeycomb rows
  const createChunks = (arr: string[], pattern: number[]) => {
    const chunks = []
    let i = 0
    let patternIdx = 0
    while (i < arr.length) {
      const size = pattern[patternIdx % pattern.length]
      chunks.push(arr.slice(i, i + size))
      i += size
      patternIdx++
    }
    return chunks
  }

  // Desktop pattern: 6, 5, 6, 5...
  const desktopRows = createChunks(allSkills, [6, 5])
  
  // Mobile pattern: 3, 2, 3, 2...
  const mobileRows = createChunks(allSkills, [3, 2])

  useGSAP(() => {
    // Background Volumetric Lighting Animation
    gsap.to('.ambient-orb', {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.ambient-orb-pulse', {
      scale: 1.1,
      opacity: 0.8,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // Honeycomb Grid Floating Physics
    gsap.to('.honeycomb-grid', {
      y: -10,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // Honeycomb Assembly Animation
    gsap.fromTo('.hex-cell', 
      {
        opacity: 0,
        scale: 0.5,
        z: -100,
        y: 40,
        rotateX: -20,
      },
      {
        opacity: 1,
        scale: 1,
        z: 0,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        stagger: {
          amount: 1.2,
          from: "center",
          grid: "auto"
        },
        ease: 'elastic.out(1, 0.75)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, { scope: containerRef })

  const Hexagon = ({ skill }: { skill: string }) => (
    <div className="hex-cell relative group cursor-crosshair transition-transform duration-500 hover:scale-105 hover:z-50 w-[94px] h-[108px] md:w-[124px] md:h-[143px] lg:w-[144px] lg:h-[166px]">
      
      {/* 
        Outer Thick Glass Bevel 
        Creates the tangible 3D edge of the glass
      */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent flex items-center justify-center p-[2px] md:p-[3px] transition-all duration-500 group-hover:from-aurora-blue/60 group-hover:to-aurora-purple/60 group-hover:shadow-[0_0_40px_rgba(79,107,246,0.4)]"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* Core Frosted Glass Body */}
        <div 
          className="relative w-full h-full bg-[#0a0a0c]/40 backdrop-blur-3xl flex flex-col items-center justify-center p-3 text-center transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.9),inset_0_2px_15px_rgba(255,255,255,0.08)] group-hover:bg-[#131024]/60 group-hover:shadow-[inset_0_0_40px_rgba(139,92,246,0.3),inset_0_2px_20px_rgba(255,255,255,0.2)]"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {/* Laser Top Edge Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 group-hover:via-aurora-blue group-hover:opacity-100 group-hover:h-[2px] group-hover:shadow-[0_0_15px_rgba(79,107,246,1)] transition-all duration-500" />
          
          <span className="font-display font-bold tracking-[0.1em] text-[9px] md:text-[11px] lg:text-xs text-white/50 group-hover:text-white transition-colors duration-300 drop-shadow-md group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] z-10">
            {skill.toUpperCase()}
          </span>
          
          {/* Internal Volumetric Fog (appears on hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-aurora-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </div>
      
    </div>
  )

  const renderGrid = (rows: string[][], isMobile: boolean) => (
    <div className={`honeycomb-grid flex-col items-center justify-center w-full ${isMobile ? 'flex md:hidden' : 'hidden md:flex'}`}>
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center"
          style={{ 
            marginTop: rowIndex === 0 ? '0' : 'var(--hex-offset)',
          }}
        >
          {row.map((skill, colIndex) => (
            <div key={colIndex} className="px-[2px] md:px-[3px]">
              <Hexagon skill={skill} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <section ref={containerRef} id="skills" className="py-24 md:py-36 relative overflow-hidden bg-[#050505] z-10 perspective-[2000px]">
      
      {/* Dynamic Volumetric Lighting (Ambient Orbs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        {/* Deep background foundation */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        
        {/* Orbiting Orbs Wrapper */}
        <div className="ambient-orb relative w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] opacity-70">
          <div className="ambient-orb-pulse absolute top-[10%] left-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-aurora-blue/20 rounded-full blur-[100px] md:blur-[140px] mix-blend-screen" />
          <div className="ambient-orb-pulse absolute bottom-[20%] right-[10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-aurora-purple/15 rounded-full blur-[120px] md:blur-[160px] mix-blend-screen" style={{ animationDelay: '-2s' }} />
          <div className="ambient-orb-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[550px] md:h-[550px] bg-cyan-500/10 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen" style={{ animationDelay: '-1s' }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) { :root { --hex-offset: -27px; } }
        @media (min-width: 768px) and (max-width: 1023px) { :root { --hex-offset: -35.75px; } }
        @media (min-width: 1024px) { :root { --hex-offset: -41.5px; } }
      `}} />

      <div className="w-full max-w-[1300px] mx-auto px-4 md:px-12 relative z-20 flex flex-col items-center">
        <h2 className="section-heading text-white text-center mb-16 md:mb-24 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          SKILL <span className="text-aurora-purple italic drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">MATRIX</span>
        </h2>
        
        <div className="relative w-full flex justify-center [transform-style:preserve-3d]">
          {renderGrid(desktopRows, false)}
          {renderGrid(mobileRows, true)}
        </div>
      </div>
    </section>
  )
}
