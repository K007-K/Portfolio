import { useRef, useState } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
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

  const desktopRows = createChunks(allSkills, [6, 5])
  const mobileRows = createChunks(allSkills, [3, 2])

  // Mouse tracking for the background "Flashlight"
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  useGSAP(() => {
    gsap.fromTo('.hex-cell', 
      {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotateX: -30,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: {
          amount: 1.5,
          from: "center",
          grid: "auto"
        },
        ease: 'elastic.out(1, 0.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    )
  }, { scope: containerRef })

  const Hexagon = ({ skill }: { skill: string }) => {
    const hexRef = useRef<HTMLDivElement>(null)
    const [rotate, setRotate] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    // 3D Parallax Tilt Physics
    const handleHexMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hexRef.current) return
      const rect = hexRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -20 // Tilt up/down
      const rotateY = ((x - centerX) / centerX) * 20  // Tilt left/right
      
      setRotate({ x: rotateX, y: rotateY })
    }

    const handleHexMouseLeave = () => {
      setRotate({ x: 0, y: 0 })
      setIsHovered(false)
    }

    return (
      <div 
        ref={hexRef}
        onMouseMove={handleHexMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleHexMouseLeave}
        className="hex-cell relative group cursor-crosshair w-[84px] h-[97px] md:w-[110px] md:h-[127px] lg:w-[130px] lg:h-[150px] shrink-0"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.15 : 1})`,
          transition: isHovered ? 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          zIndex: isHovered ? 50 : 1
        }}
      >
        {/* Massive Hover Flare behind the hexagon */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-aurora-cyan/40 blur-[30px] transition-all duration-500 pointer-events-none ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`} />

        {/* 
          SPINNING LASER BORDER CONTAINER
          Acts as the clipping mask for the spinning conic-gradient
        */}
        <div 
          className="absolute inset-0 transition-all duration-500 overflow-hidden"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {/* Default static border so it's visible when not spinning brightly */}
          <div className="absolute inset-0 bg-white/[0.05]" />

          {/* The Spinning Conic Gradient */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] transition-all duration-500"
            style={{
              background: isHovered 
                ? 'conic-gradient(from 0deg, transparent 50%, rgba(34,211,238,1) 80%, transparent 100%)' 
                : 'conic-gradient(from 0deg, transparent 50%, rgba(139,92,246,0.2) 80%, transparent 100%)',
              animation: isHovered ? 'spin 1.5s linear infinite' : 'spin 4s linear infinite'
            }}
          />

          {/* 
            CORE FROSTED GLASS BODY
            Using padding inset to reveal the spinning border layer underneath
          */}
          <div 
            className="absolute inset-[1px] bg-[#020203]/70 backdrop-blur-2xl flex flex-col items-center justify-center p-2 text-center transition-all duration-500"
            style={{ 
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            {/* Specular Glass Highlight (Diagonal physical reflection) */}
            <div className={`absolute top-0 left-[-50%] w-[200%] h-[50%] bg-gradient-to-b from-white/[0.12] to-transparent -rotate-12 transform-gpu pointer-events-none transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-40'}`} />
            
            <span className={`font-display font-bold tracking-[0.2em] text-[8px] md:text-[10px] lg:text-xs transition-all duration-300 z-10 ${isHovered ? 'text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-110' : 'text-white/40'}`}>
              {skill.toUpperCase()}
            </span>

            {/* Inner volumetric glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-aurora-cyan/20 to-transparent pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
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
            <div key={colIndex} className="px-[2px] shrink-0">
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
      onMouseMove={handleMouseMove}
    >
      {/* 
        MOUSE-TRACKING FLASHLIGHT
        A dynamic radial gradient that follows the user's mouse, physically illuminating the dark glass.
      */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-80"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(34,211,238,0.15), transparent 80%)`
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.15), transparent 80%)`
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) { :root { --hex-offset: -24.25px; } }
        @media (min-width: 768px) and (max-width: 1023px) { :root { --hex-offset: -31.75px; } }
        @media (min-width: 1024px) { :root { --hex-offset: -37.5px; } }
      `}} />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center pointer-events-auto">
        <h2 className="section-heading text-white text-center mb-16 md:mb-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-wider">
          SKILL <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-purple italic drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">MATRIX</span>
        </h2>
        
        <div className="relative w-full flex justify-center [transform-style:preserve-3d] perspective-[2000px]">
          {renderGrid(desktopRows, false)}
          {renderGrid(mobileRows, true)}
        </div>
      </div>
    </section>
  )
}
