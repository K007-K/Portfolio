// Navbar — velocity-based floating HUD with entrance animation and active section
import { useState, useEffect, useRef } from 'react'
import { personalInfo } from '../lib/data'
import gsap from 'gsap'

const navLinks = [
  { label: 'About', href: '#resume' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const navRef = useRef<HTMLElement>(null)

  // Entrance animation
  useEffect(() => {
    gsap.from(navRef.current, {
      yPercent: -200,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.5,
    })
  }, [])

  // Scroll velocity hide/show + active section tracking
  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 50)

      // Velocity HUD: hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        gsap.to(navRef.current, { yPercent: -150, duration: 0.4, ease: 'power3.out' })
      } else {
        gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'power3.out' })
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
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 md:gap-8 px-6 md:px-8 py-3 rounded-full border transition-all duration-500 will-change-transform ${
        scrolled
          ? 'bg-space-900/70 border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl'
          : 'bg-transparent border-transparent'
      }`}
    >
      <a
        href="#hero"
        className="font-display font-bold text-sm text-text-primary tracking-widest uppercase hover:text-aurora-purple transition-colors duration-300"
      >
        {personalInfo.name.split(' ')[0]}
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
                  ? 'text-aurora-blue scale-105'
                  : 'text-text-secondary hover:text-text-primary hover:scale-105'
              }`}
            >
              {link.label}
            </a>
          )
        })}
      </div>

      <a
        href={personalInfo.socials.github}
        target="_blank"
        rel="noreferrer"
        className="font-display text-xs tracking-widest uppercase px-4 py-2 bg-text-primary text-space-900 rounded-full hover:bg-aurora-blue hover:text-white hover:shadow-[0_0_15px_rgba(79,107,246,0.5)] transition-all duration-300"
      >
        Github
      </a>
    </nav>
  )
}
