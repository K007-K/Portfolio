import { useRef } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  
  const allSkills = Object.values(skills).flatMap(cat => cat.items)
  
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
    gsap.fromTo('.hex-cell', 
      {
        opacity: 0,
        y: 40,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          amount: 1,
          from: "center",
          grid: "auto"
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    )
  }, { scope: containerRef })

  const Hexagon = ({ skill }: { skill: string }) => (
    <div className="hex-cell relative group cursor-crosshair transition-all duration-500 hover:scale-105 hover:z-50 w-[84px] h-[97px] md:w-[110px] md:h-[127px] lg:w-[130px] lg:h-[150px] shrink-0">
      
      {/* Hover Aura */}
      <div className="absolute inset-0 rounded-full bg-aurora-purple/0 blur-xl transition-all duration-500 group-hover:bg-aurora-purple/30 group-hover:scale-125" />

      {/* 1px Outer Glass Border */}
      <div 
        className="absolute inset-0 bg-white/[0.08] transition-all duration-500 group-hover:bg-gradient-to-b group-hover:from-aurora-blue group-hover:to-aurora-purple"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* Core Inner Glass Body */}
        <div 
          className="absolute inset-[1px] bg-[#050505]/60 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center transition-all duration-500 group-hover:bg-[#0a0a0f]/80"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {/* Subtle Top Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[1px] bg-white/20 transition-all duration-500 group-hover:w-[50%] group-hover:bg-aurora-cyan" />
          
          <span className="font-display font-medium tracking-widest text-[9px] md:text-[10px] lg:text-xs text-white/50 group-hover:text-white transition-colors duration-300 z-10">
            {skill.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )

  const renderGrid = (rows: string[][], isMobile: boolean) => (
    <div className={`honeycomb-grid flex-col items-center w-full ${isMobile ? 'flex md:hidden' : 'hidden md:flex'}`}>
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center w-full"
          style={{ 
            marginTop: rowIndex === 0 ? '0' : 'var(--hex-offset)',
          }}
        >
          {row.map((skill, colIndex) => (
            <div key={colIndex} className="px-[2px] md:px-[3px] shrink-0">
              <Hexagon skill={skill} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <section ref={containerRef} id="skills" className="py-24 md:py-36 relative overflow-hidden bg-space-950 z-10">
      
      {/* Ultra-subtle ambient glow to separate from pitch black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-aurora-purple/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* 
        Responsive variables for perfect mathematical honeycomb interlocking.
        Mobile H = 97px -> 25% = 24.25px
        Tablet H = 127px -> 25% = 31.75px
        Desktop H = 150px -> 25% = 37.5px
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) { :root { --hex-offset: -24.25px; } }
        @media (min-width: 768px) and (max-width: 1023px) { :root { --hex-offset: -31.75px; } }
        @media (min-width: 1024px) { :root { --hex-offset: -37.5px; } }
      `}} />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center">
        <h2 className="section-heading text-white text-center mb-16 md:mb-24">
          SKILL <span className="text-aurora-purple italic">MATRIX</span>
        </h2>
        
        <div className="relative w-full flex justify-center">
          {renderGrid(desktopRows, false)}
          {renderGrid(mobileRows, true)}
        </div>
      </div>
    </section>
  )
}
