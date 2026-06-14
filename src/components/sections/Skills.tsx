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
      duration: 40,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.ambient-orb-pulse', {
      scale: 1.4,
      opacity: 0.9,
      duration: 3,
      yoyo: true,
      stagger: {
        amount: 2,
        from: "random"
      },
      repeat: -1,
      ease: 'sine.inOut'
    })

    // Honeycomb Assembly Animation
    gsap.fromTo('.hex-cell', 
      {
        opacity: 0,
        scale: 0.2,
        y: 100,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        stagger: {
          amount: 1.5,
          from: "center",
          grid: "auto"
        },
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, { scope: containerRef })

  const Hexagon = ({ skill }: { skill: string }) => (
    <div className="hex-cell relative group cursor-crosshair transition-all duration-500 hover:scale-[1.15] hover:z-50 w-[94px] h-[108px] md:w-[124px] md:h-[143px] lg:w-[144px] lg:h-[166px]">
      
      {/* 
        OUTER GLOW (Hover State)
        A bright, blurred orb that ignites behind the hexagon on hover.
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-aurora-blue/0 blur-xl transition-all duration-500 group-hover:bg-aurora-blue/80 group-hover:w-[130%] group-hover:h-[130%]" />

      {/* 
        OUTER THICK GLASS BEVEL
        Uses a bright white gradient to simulate the light catching the physical edge of cut glass.
      */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-black/80 flex items-center justify-center p-[1px] md:p-[2px] transition-all duration-500 group-hover:from-aurora-blue group-hover:via-aurora-purple/80 group-hover:to-transparent"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* 
          CORE FROSTY GLASS BODY
          Highly transparent so the bright background orbs shine through, but with blur to refract the light.
        */}
        <div 
          className="relative w-full h-full bg-space-950/20 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center transition-all duration-500 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] group-hover:bg-space-900/40 group-hover:shadow-[inset_0_0_40px_rgba(79,107,246,0.4),inset_0_2px_10px_rgba(255,255,255,0.4)]"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {/* Laser Top Edge Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80 group-hover:via-white group-hover:h-[3px] group-hover:w-[60%] group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-500" />
          
          {/* Skill Text */}
          <span className="font-display font-bold tracking-[0.15em] text-[9px] md:text-xs text-white/90 drop-shadow-md group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)] z-10">
            {skill.toUpperCase()}
          </span>
          
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
            <div key={colIndex} className="px-[3px]">
              <Hexagon skill={skill} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <section ref={containerRef} id="skills" className="py-24 md:py-40 relative overflow-hidden bg-[#020202] z-10 perspective-[2000px]">
      
      {/* 
        DYNAMIC VOLUMETRIC LIGHTING 
        Massive, highly saturated orbs that mix-blend with the deep black background. 
        As they spin and pulse, the frosted glass hexagons will bend and reveal their colors.
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center mix-blend-screen">
        <div className="ambient-orb relative w-[600px] h-[600px] md:w-[1200px] md:h-[1200px] opacity-100">
          <div className="ambient-orb-pulse absolute top-[10%] left-[20%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-500/40 rounded-full blur-[80px] md:blur-[150px]" />
          <div className="ambient-orb-pulse absolute bottom-[10%] right-[20%] w-[350px] h-[350px] md:w-[700px] md:h-[700px] bg-purple-600/40 rounded-full blur-[100px] md:blur-[180px]" />
          <div className="ambient-orb-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-blue-600/30 rounded-full blur-[100px] md:blur-[150px]" />
        </div>
      </div>

      {/* Responsive variables for the precise mathematical honeycomb offset */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) { :root { --hex-offset: -27px; } }
        @media (min-width: 768px) and (max-width: 1023px) { :root { --hex-offset: -35.75px; } }
        @media (min-width: 1024px) { :root { --hex-offset: -41.5px; } }
      `}} />

      <div className="w-full max-w-[1300px] mx-auto px-4 md:px-12 relative z-20 flex flex-col items-center">
        <h2 className="section-heading text-white text-center mb-20 md:mb-32 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          SKILL <span className="text-aurora-cyan italic drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">MATRIX</span>
        </h2>
        
        <div className="relative w-full flex justify-center [transform-style:preserve-3d]">
          {renderGrid(desktopRows, false)}
          {renderGrid(mobileRows, true)}
        </div>
      </div>
    </section>
  )
}
