import { useRef, useMemo } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)
  const zRef = useRef<HTMLDivElement>(null)

  const allSkills = Object.values(skills).flatMap((cat) => cat.items)

  // Generate deterministic 3D positions for skills (Cylindrical spiral)
  const nodes = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const baseRadius = isMobile ? 120 : 300
    const randomRange = isMobile ? 180 : 400
    const depthMultiplier = isMobile ? -3000 : -4500

    return allSkills.map((skill, i) => {
      // Golden ratio spiral
      const angle = i * Math.PI * 2.39996
      // Radius expands slightly as we go deeper
      const radius = baseRadius + Math.random() * randomRange + (i * (isMobile ? 2 : 5))
      // Z depth goes from 0 to deep
      const z = (i / allSkills.length) * depthMultiplier
      
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      // Random floating animation offsets
      const floatDuration = 3 + Math.random() * 4
      const floatDelay = Math.random() * -5

      return { skill, x, y, z, floatDuration, floatDelay }
    })
  }, [allSkills])

  useGSAP(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    // 1. Horizontal/Z-Axis Scrub Pinning
    gsap.to(zRef.current, {
      z: isMobile ? 3500 : 5000,
      ease: 'none',
      scrollTrigger: {
        trigger: viewportRef.current,
        start: 'top top',
        end: isMobile ? '+=2500' : '+=4000', // Shorter scroll distance for mobile
        scrub: 1,
        pin: true,
      },
    })

    // 2. Cinematic Entrance
    gsap.from('.skill-node', {
      scale: 0,
      opacity: 0,
      z: 0,
      x: 0,
      y: 0,
      duration: 2.5,
      stagger: { amount: 1.5, from: 'center' },
      ease: 'power4.out',
      scrollTrigger: {
        trigger: viewportRef.current,
        start: 'top 80%',
      },
    })

    // 3. Ambient Floating
    const floatingTweens = gsap.utils.toArray('.skill-node-inner').map((el: any) => {
      return gsap.to(el, {
        y: '+=20',
        x: '+=10',
        rotateZ: '+=5',
        duration: el.dataset.duration,
        delay: el.dataset.delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => {
      floatingTweens.forEach(t => t.kill())
    }
  }, { scope: containerRef })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!matrixRef.current) return

    const { clientX, clientY } = e
    // Normalize coordinates from -1 to 1
    const x = (clientX / window.innerWidth - 0.5) * 2
    const y = (clientY / window.innerHeight - 0.5) * 2

    // Extreme tilt
    gsap.to(matrixRef.current, {
      rotateX: -y * 25,
      rotateY: x * 25,
      duration: 1,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (!matrixRef.current) return
    gsap.to(matrixRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.5,
      ease: 'power3.out',
    })
  }

  return (
    <section ref={containerRef} id="skills" className="relative bg-transparent z-10">
      <div 
        ref={viewportRef}
        className="w-full h-screen overflow-hidden flex items-center justify-center bg-transparent"
        style={{ perspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Title Overlay (Stays fixed) */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
          <h2 className="section-heading text-text-primary drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            ENGINEERING <span className="text-aurora-purple italic">ARSENAL</span>
          </h2>
          <p className="text-text-secondary mt-4 font-mono text-sm uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            Scroll to Dive / Hover to Inspect
          </p>
        </div>

        {/* 3D Wrapper */}
        <div 
          ref={matrixRef}
          className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            ref={zRef}
            className="w-full h-full absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* The Core */}
            <div className="absolute w-40 h-40 bg-aurora-purple/20 rounded-full blur-[80px] -z-10" />

            {/* Nodes */}
            {nodes.map((node, i) => (
              <div
                key={i}
                className="skill-node absolute pointer-events-auto"
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  className="skill-node-inner inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-aurora-purple hover:bg-aurora-purple/20 hover:scale-150 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] cursor-crosshair group will-change-transform"
                  data-duration={node.floatDuration}
                  data-delay={node.floatDelay}
                >
                  <span className="font-display font-bold tracking-wider text-text-secondary group-hover:text-white uppercase transition-colors duration-300">
                    {node.skill}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
