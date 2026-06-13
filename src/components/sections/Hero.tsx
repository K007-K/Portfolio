import { useRef, useEffect, useState } from 'react'
import { personalInfo } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// Text scramble effect for role cycling
function useTextScramble(texts: string[], interval = 3000) {
  const [displayText, setDisplayText] = useState(texts[0])
  const indexRef = useRef(0)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

  useEffect(() => {
    const scramble = () => {
      indexRef.current = (indexRef.current + 1) % texts.length
      const target = texts[indexRef.current]
      let iteration = 0
      const maxIterations = target.length

      const timer = setInterval(() => {
        setDisplayText(
          target
            .split('')
            .map((char, i) => {
              if (i < iteration) return char
              if (char === ' ') return ' '
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )
        iteration += 1 / 2
        if (iteration >= maxIterations) {
          clearInterval(timer)
          setDisplayText(target)
        }
      }, 30)
    }

    const id = setInterval(scramble, interval)
    return () => clearInterval(id)
  }, [texts, interval])

  return displayText
}

import RealityCanvas from '../canvas/RealityCanvas'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef1 = useRef<HTMLHeadingElement>(null)
  const parallaxWrapperRef = useRef<HTMLDivElement>(null)
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  const scrambledRole = useTextScramble(personalInfo.roles, 3000)

  // Entrance animation — plays once on load
  useGSAP(() => {
    const chars1 = nameRef1.current?.querySelectorAll('.char')
    if (!chars1) return

    const tl = gsap.timeline({ delay: 0.3 })

    // Character-by-character reveal with clipPath
    tl.from(chars1, {
      yPercent: 120,
      rotateX: -60,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
      stagger: 0.08,
    })

    // Scroll indicator fades in
    tl.fromTo(scrollIndicatorRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.2'
    )

  }, { scope: containerRef })

  // Scroll-driven parallax — text fades and scales down as user scrolls
  useGSAP(() => {
    // Delay ScrollTrigger to allow entrance animation to set initial opacity: 1
    const timer = setTimeout(() => {
      gsap.to(scrollWrapperRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        scale: 0.85,
        opacity: 0,
        y: -80,
        ease: 'none',
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, { scope: containerRef })

  // Magnetic Typography Hover Physics
  useEffect(() => {
    const container = containerRef.current
    const chars1 = nameRef1.current?.querySelectorAll('.char')
    const parallaxWrap = parallaxWrapperRef.current

    if (!container || !chars1 || !parallaxWrap) return
    const allChars = Array.from(chars1)

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Global 3D Parallax for the whole word
      const xPos = (clientX / innerWidth - 0.5) * 30 // max 15px tilt
      const yPos = (clientY / innerHeight - 0.5) * 30
      
      gsap.to(parallaxWrap, {
        x: xPos,
        y: yPos,
        rotateX: -yPos * 0.5,
        rotateY: xPos * 0.5,
        duration: 1,
        ease: 'power3.out',
        overwrite: 'auto'
      })

      // Individual Character Magnetic Pull
      allChars.forEach((char) => {
        const rect = char.getBoundingClientRect()
        const charCenterX = rect.left + rect.width / 2
        const charCenterY = rect.top + rect.height / 2

        const distX = clientX - charCenterX
        const distY = clientY - charCenterY
        const distance = Math.sqrt(distX * distX + distY * distY)

        const maxDistance = 200 // Magnetic radius

        if (distance < maxDistance) {
          // Calculate pull strength (closer = stronger pull)
          const pull = (maxDistance - distance) / maxDistance
          const pullX = distX * pull * 0.4 // max 40% of distance towards cursor
          const pullY = distY * pull * 0.4

          gsap.to(char, {
            x: pullX,
            y: pullY,
            scale: 1 + (pull * 0.1), // slight pop when hovering near
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        } else {
          // Spring back to original position
          gsap.to(char, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
          })
        }
      })
    }

    const handleMouseLeave = () => {
      // Reset global parallax
      gsap.to(parallaxWrap, {
        x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1, ease: 'power3.out', overwrite: 'auto'
      })
      // Reset chars
      allChars.forEach((char) => {
        gsap.to(char, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 3D Canvas scoped specifically to the Hero section */}
      <div className="absolute inset-0 z-0">
        <RealityCanvas />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        {/* Scroll wrapper separates ScrollTrigger from mouse parallax */}
        <div ref={scrollWrapperRef} className="flex flex-col items-center">
          
          {/* Parallax wrapper for mouse interaction */}
          <div ref={parallaxWrapperRef} style={{ perspective: '1000px' }} className="flex flex-col items-center gap-0">
            {/* First Name */}
            <h1
              ref={nameRef1}
              className="font-hero hero-text text-[clamp(4rem,10vw,12rem)] uppercase tracking-normal cursor-crosshair leading-[0.85]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {'KARTHIK'.split('').map((char, i) => (
                <span key={i} className="char inline-block will-change-transform" style={{ transformOrigin: 'center center' }}>
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* Scrambled role text */}
          <div
            ref={roleRef}
            className="mt-6 flex items-center gap-3"
          >
            <div className="w-12 h-px bg-aurora-blue" />
            <span className="font-mono text-sm md:text-base text-aurora-blue tracking-[0.2em] uppercase">
              {scrambledRole}
            </span>
            <div className="w-12 h-px bg-aurora-blue" />
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-5 font-sans text-sm md:text-base text-text-secondary max-w-md leading-relaxed"
          >
            {personalInfo.tagline}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-pulse"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-secondary">
          Scroll
        </span>
        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
