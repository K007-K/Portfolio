import { useRef, useState } from 'react'
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
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    )
  }, { scope: containerRef })

  const Hexagon = ({ skill }: { skill: string }) => {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
    const [isHovered, setIsHovered] = useState(false)

    // Track mouse position specifically inside THIS hexagon for the magnetic glow
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    const clipPathStr = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
    // Give gradient a unique ID so they don't conflict across SVGs
    const gradId = `hex-grad-${skill.replace(/[^a-zA-Z0-9]/g, '')}`

    return (
      <div 
        className="hex-cell relative group cursor-crosshair w-[84px] h-[97px] md:w-[110px] md:h-[127px] lg:w-[130px] lg:h-[150px] shrink-0 transition-transform duration-500 hover:scale-105 hover:z-50"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* PURE SVG BORDER LAYER */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-500" 
          viewBox="0 0 100 115.47" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isHovered ? "rgba(34,211,238,1)" : "rgba(255,255,255,0.2)"} className="transition-all duration-500" />
              <stop offset="100%" stopColor={isHovered ? "rgba(139,92,246,1)" : "rgba(255,255,255,0.02)"} className="transition-all duration-500" />
            </linearGradient>
          </defs>
          <polygon 
            points="50,0 100,28.8675 100,86.6025 50,115.47 0,86.6025 0,28.8675" 
            fill="none" 
            stroke={`url(#${gradId})`} 
            strokeWidth="1.5" 
            style={{ transformOrigin: 'center', transform: 'scale(0.985)' }}
          />
        </svg>

        {/* PURE LIQUID GLASS BODY */}
        <div 
          className="absolute inset-[1.5px] bg-[#050505]/40 backdrop-blur-md transition-all duration-500 group-hover:bg-[#0a0a0f]/60"
          style={{ 
            clipPath: clipPathStr,
            WebkitClipPath: clipPathStr,
          }}
        >
          {/* MAGNETIC MOUSE GLOW (Vercel Style) */}
          {isHovered && (
            <div 
              className="absolute pointer-events-none transition-opacity duration-300 opacity-100"
              style={{
                width: '160px',
                height: '160px',
                left: `${mousePos.x - 80}px`,
                top: `${mousePos.y - 80}px`,
                background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(34,211,238,0.1) 40%, transparent 70%)',
              }}
            />
          )}
          
          {/* CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
            <span className="font-display font-medium tracking-[0.2em] text-[9px] md:text-[10px] lg:text-xs text-white/50 group-hover:text-white transition-colors duration-300 z-10">
              {skill.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    )
  }

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
    <section 
      ref={containerRef} 
      id="skills" 
      className="py-24 md:py-40 relative overflow-hidden bg-[#000000] z-10"
    >
      {/* THE AURORA FOUNDATION (From Hero Section) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[800px] pointer-events-none -z-10 flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] bg-aurora-purple/15 blur-[120px] rounded-full animate-aurora-shift-1" />
        <div className="absolute w-[500px] h-[500px] bg-aurora-cyan/10 blur-[100px] rounded-full animate-aurora-shift-2" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) { :root { --hex-offset: -24.25px; } }
        @media (min-width: 768px) and (max-width: 1023px) { :root { --hex-offset: -31.75px; } }
        @media (min-width: 1024px) { :root { --hex-offset: -37.5px; } }
        
        @keyframes aurora-shift-1 {
          0%, 100% { transform: translate(-10%, -10%) scale(1); }
          50% { transform: translate(10%, 10%) scale(1.1); }
        }
        @keyframes aurora-shift-2 {
          0%, 100% { transform: translate(10%, 10%) scale(1); }
          50% { transform: translate(-10%, -10%) scale(1.1); }
        }
        .animate-aurora-shift-1 { animation: aurora-shift-1 15s ease-in-out infinite; }
        .animate-aurora-shift-2 { animation: aurora-shift-2 18s ease-in-out infinite; }
      `}} />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center">
        
        {/* Fixed Title with separated glow so bg-clip-text doesn't break */}
        <h2 className="section-heading text-white text-center mb-16 md:mb-24 flex items-center justify-center gap-3">
          <span>SKILL</span>
          <span className="relative">
            {/* Soft glow behind the text */}
            <span className="absolute inset-0 bg-gradient-to-r from-aurora-cyan to-aurora-purple blur-[15px] opacity-40"></span>
            {/* The actual clipped text */}
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-purple italic">MATRIX</span>
          </span>
        </h2>
        
        <div className="relative w-full flex justify-center">
          {renderGrid(desktopRows, false)}
          {renderGrid(mobileRows, true)}
        </div>
      </div>
    </section>
  )
}
