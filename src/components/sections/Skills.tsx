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
    // Honeycomb Assembly Animation
    gsap.fromTo('.hex-cell', 
      {
        opacity: 0,
        scale: 0,
        y: 60,
        rotateZ: -15,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateZ: 0,
        duration: 0.9,
        stagger: {
          amount: 1.5,
          from: "center",
          grid: "auto"
        },
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, { scope: containerRef })

  const Hexagon = ({ skill }: { skill: string }) => (
    <div className="hex-cell relative group cursor-crosshair transition-transform duration-500 hover:scale-110 hover:z-50 w-[94px] h-[108px] md:w-[124px] md:h-[143px] lg:w-[144px] lg:h-[166px]">
      
      {/* 
        Vertical Hexagon Clip Path 
        Aspect ratio constraint: W = H * 0.866
      */}
      <div 
        className="absolute inset-0 bg-space-800/40 backdrop-blur-xl flex items-center justify-center p-3 text-center transition-all duration-500 border-2 border-transparent group-hover:bg-aurora-purple/20"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* Inner glass layer to create border effect within clip-path */}
        <div 
          className="absolute inset-[1px] bg-white/[0.02] flex items-center justify-center p-2 transition-all duration-500 group-hover:bg-white/[0.05] group-hover:shadow-[inset_0_0_30px_rgba(139,92,246,0.3)]"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          <span className="font-display font-medium text-[10px] md:text-xs lg:text-sm text-text-secondary group-hover:text-white transition-colors duration-300 drop-shadow-md">
            {skill}
          </span>
        </div>
      </div>
      
      {/* Outer Glow on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-aurora-purple/40 -z-10"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      />
    </div>
  )

  const renderGrid = (rows: string[][], isMobile: boolean) => (
    <div className={`flex-col items-center justify-center w-full ${isMobile ? 'flex md:hidden' : 'hidden md:flex'}`}>
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center"
          style={{ 
            // Negative margin pulls the next row up by exactly 25% of the hexagon height 
            // so the points interlock perfectly.
            // Mobile H = 108px -> 25% = 27px
            // Tablet H = 143px -> 25% = 35.75px
            // Desktop H = 166px -> 25% = 41.5px
            marginTop: rowIndex === 0 ? '0' : 'var(--hex-offset)',
          }}
        >
          {row.map((skill, colIndex) => (
            <div key={colIndex} className="px-[2px]"> {/* 2px horizontal gap */}
              <Hexagon skill={skill} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <section ref={containerRef} id="skills" className="py-24 md:py-36 relative overflow-hidden bg-transparent z-10">
      
      {/* Responsive variables for the negative margin offset */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) { :root { --hex-offset: -27px; } }
        @media (min-width: 768px) and (max-width: 1023px) { :root { --hex-offset: -35.75px; } }
        @media (min-width: 1024px) { :root { --hex-offset: -41.5px; } }
      `}} />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 relative z-20 flex flex-col items-center">
        <h2 className="section-heading text-text-primary text-center mb-16 md:mb-24">
          SKILL <span className="text-aurora-purple italic">MATRIX</span>
        </h2>
        
        <div className="relative w-full flex justify-center">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-aurora-purple/10 blur-[100px] rounded-full pointer-events-none" />
          
          {renderGrid(desktopRows, false)}
          {renderGrid(mobileRows, true)}
        </div>
      </div>
    </section>
  )
}
