import { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Navbar() {
  const { theme, toggleTheme, isTransitioning } = useTheme()
  const navRef = useRef<HTMLElement>(null)

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
      }
    )
  }, [])

  const glassStyles = "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all bg-white/20 dark:bg-black/30 backdrop-blur-2xl dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-0 w-full z-50 transition-all duration-500 will-change-transform pointer-events-none px-4 sm:px-6 flex justify-between items-start"
    >
      {/* Top Left: Floating KK */}
      <a
        href="#hero"
        className={`relative pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 group hover:scale-105 ${glassStyles}`}
      >
        <span className="font-display font-bold text-lg text-text-primary tracking-widest uppercase group-hover:text-text-secondary transition-colors duration-300">
          KK
        </span>
      </a>

      {/* Top Right: Theme Toggle */}
      <button
        onClick={toggleTheme}
        disabled={isTransitioning}
        className={`relative pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 group hover:scale-105 disabled:opacity-50 ${glassStyles}`}
        aria-label="Toggle Reality Theme"
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5 text-text-primary group-hover:text-text-secondary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-text-primary group-hover:text-text-secondary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </nav>
  )
}
