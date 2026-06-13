// Hero section — cinematic character-by-character reveal with text scramble roles
import { useRef, useEffect, useState } from 'react'
import { personalInfo } from '../../lib/data'
import AuroraBackground from '../AuroraBackground'
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

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  const scrambledRole = useTextScramble(personalInfo.roles, 3000)

  // Entrance animation — plays once on load
  useGSAP(() => {
    const nameChars = nameRef.current?.querySelectorAll('.char')
    if (!nameChars) return

    const tl = gsap.timeline({ delay: 0.3 })

    // Character-by-character reveal with clipPath
    tl.from(nameChars, {
      yPercent: 120,
      rotateX: -80,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.04,
    })

    // Role text fades in
    tl.from(roleRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.3')

    // Subtitle fades in
    tl.from(subtitleRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.3')

    // Scroll indicator fades in
    tl.from(scrollIndicatorRef.current, {
      opacity: 0,
      duration: 0.8,
    }, '-=0.2')

  }, { scope: containerRef })

  // Scroll-driven parallax — text fades and scales down as user scrolls
  useGSAP(() => {
    gsap.to(nameRef.current, {
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

    gsap.to([roleRef.current, subtitleRef.current], {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '60% top',
        scrub: 1,
      },
      opacity: 0,
      y: -40,
      ease: 'none',
    })
  }, { scope: containerRef })

  const firstName = personalInfo.name.split(' ')[0].toUpperCase()

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-space-900"
    >
      <AuroraBackground />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        {/* Main name — character by character */}
        <h1
          ref={nameRef}
          className="font-display font-black text-hero text-text-primary uppercase tracking-tighter will-change-transform overflow-hidden"
          style={{ perspective: '600px' }}
        >
          {firstName.split('').map((char, i) => (
            <span
              key={i}
              className="char inline-block will-change-transform"
              style={{ transformOrigin: 'bottom center' }}
            >
              {char}
            </span>
          ))}
        </h1>

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
