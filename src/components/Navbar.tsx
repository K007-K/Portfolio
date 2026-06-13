import { useState, useEffect, useRef } from 'react'
import { personalInfo } from '../lib/data'
import { useTheme } from '../context/ThemeContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { GlassFilter } from './ui/liquid-glass-button'

const navLinks = [
  { label: 'About', href: '#resume' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { theme, toggleTheme, isTransitioning } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isIntroFinished, setIsIntroFinished] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0

  useGSAP(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { yPercent: -200, opacity: 0 },
      { 
        yPercent: 0, 
        opacity: 1, 
        duration: 1.5, 
        ease: 'power4.out', 
        delay: 0.5,
        onComplete: () => setIsIntroFinished(true)
      }
    )

    const handleScroll = () => {
      // Don't hijack the navbar position if the intro animation is still playing
      if (!isIntroFinished) return;

      const currentScrollY = window.scrollY
      
      // Update background and border on scroll
      if (currentScrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Hide/Show logic based on velocity (velocity > 10 hides, < -10 shows)
      // and only if we've scrolled past the hero section
      if (currentScrollY > 500) {
        if (currentScrollY > lastScrollY + 10) {
          // Scrolling down quickly
          gsap.to(navRef.current, { yPercent: -150, duration: 0.3, ease: 'power2.inOut' })
        } else if (currentScrollY < lastScrollY - 10) {
          // Scrolling up quickly
          gsap.to(navRef.current, { yPercent: 0, duration: 0.3, ease: 'power2.out' })
        }
      } else {
        // Always show near top
        gsap.to(navRef.current, { yPercent: 0, duration: 0.3, ease: 'power2.out' })
      }
      
      lastScrollY = currentScrollY

      // Track active section
      const sections = navLinks.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full transition-all duration-500 will-change-transform w-[90%] max-w-4xl"
    >
      <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
        transition-all bg-white/20 dark:bg-black/30 backdrop-blur-2xl
        dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />

      <div className="relative z-10 flex items-center justify-between gap-4 md:gap-8 px-6 md:px-8 py-3 w-full h-full">
        <a
          href="#hero"
          className="font-display font-bold text-lg text-text-primary tracking-widest uppercase hover:text-text-secondary transition-colors duration-300"
        >
          KK
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '')
            const isActive = activeSection === sectionId

            return (
              <a
                key={link.label}
                href={link.href}
                className={`font-display text-xs tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? 'text-text-primary scale-105'
                    : 'text-text-secondary hover:text-text-primary hover:scale-105'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle / Reality Shift Button */}
          <button
            onClick={toggleTheme}
            disabled={isTransitioning}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-text-primary hover:bg-text-primary hover:text-space-900 transition-all duration-300 disabled:opacity-50"
            aria-label="Toggle Reality Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <a
            href={personalInfo.socials.github}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs tracking-widest uppercase px-4 py-2 bg-text-primary text-space-900 rounded-full hover:bg-aurora-blue hover:text-white hover:shadow-[0_0_15px_rgba(79,107,246,0.5)] transition-all duration-300"
          >
            Github
          </a>
        </div>
      </div>
    </nav>
  )
}
