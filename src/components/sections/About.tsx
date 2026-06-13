import { useRef, useEffect, useState } from 'react'
import { aboutBullets, education, experience, achievements, certifications } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef<HTMLElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPdfLoaded, setIsPdfLoaded] = useState(false)
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false)

  // Interactive Hover Physics (Experience Explosion & Glass Tickets)
  useEffect(() => {
    const interactives = document.querySelectorAll('.interactive-physics')
    
    const handleMouseMove = (e: MouseEvent, el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -3
      const rotateY = ((x - centerX) / centerX) * 3

      gsap.to(el, {
        rotateX,
        rotateY,
        scale: 1.01,
        transformPerspective: 1200,
        ease: 'power3.out',
        duration: 0.4
      })
      
      // Update holographic glare if ticket
      const glare = el.querySelector('.glare-effect') as HTMLElement
      if (glare) {
        gsap.to(glare, {
          x: x - rect.width,
          y: y - rect.height,
          opacity: 1,
          duration: 0.4
        })
      }
    }
    
    const handleMouseLeave = (el: HTMLElement) => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        ease: 'elastic.out(1, 0.4)',
        duration: 1.2
      })

      const glare = el.querySelector('.glare-effect') as HTMLElement
      if (glare) {
        gsap.to(glare, { opacity: 0, duration: 0.5 })
      }
    }

    const listeners = Array.from(interactives).map(el => {
      const moveHandler = (e: Event) => handleMouseMove(e as MouseEvent, el as HTMLElement)
      const leaveHandler = () => handleMouseLeave(el as HTMLElement)
      el.addEventListener('mousemove', moveHandler)
      el.addEventListener('mouseleave', leaveHandler)
      return { el, moveHandler, leaveHandler }
    })
    
    return () => {
      listeners.forEach(({ el, moveHandler, leaveHandler }) => {
        el.removeEventListener('mousemove', moveHandler)
        el.removeEventListener('mouseleave', leaveHandler)
      })
    }
  }, [])

  // Fast Entrance Animation
  useGSAP(() => {
    gsap.from('.stagger-enter', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })
  }, { scope: containerRef })

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Simulate loading delay for the aesthetic
  useEffect(() => {
    if (isModalOpen) {
      setIsSimulatingLoad(true)
      const timer = setTimeout(() => {
        setIsSimulatingLoad(false)
      }, 2000) // Force 2 seconds of loading animation
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  return (
    <section ref={containerRef} id="about" className="relative bg-transparent z-10 w-full overflow-hidden py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col gap-8">
        
        {/* 1. TOP ROW: ABOUT & EXPERIENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* About Text Block */}
          <div className="stagger-enter flex flex-col justify-center">
            <h2 className="font-hero text-6xl md:text-8xl uppercase tracking-tighter text-text-primary mb-8">
              The<br/>Journey
            </h2>
            <div className="flex flex-col gap-4 max-w-2xl">
              {aboutBullets.map((bullet, i) => (
                <p key={i} className="font-display text-lg md:text-xl text-text-secondary leading-relaxed">
                  {bullet}
                </p>
              ))}
            </div>
          </div>

          {/* Fluid Fold Experience Block */}
          <div className="w-full h-full flex flex-col justify-center">
            {experience.map((exp, i) => (
              <div key={i} className="stagger-enter w-full">
                <div className="interactive-physics relative w-full group p-8 md:p-12 bg-space-800/30 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent backdrop-blur-3xl border border-space-border dark:border-white/10 rounded-[2rem] cursor-crosshair overflow-hidden flex flex-col justify-start transition-all duration-500 ease-in-out shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-text-primary/20 dark:hover:border-white/30 z-20">
                
                {/* Title Section */}
                <div className="relative z-10 transition-transform duration-500 ease-in-out group-hover:-translate-y-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-text-primary shadow-[0_0_10px_currentColor] animate-pulse" />
                    <span className="font-display font-bold text-[11px] tracking-[0.4em] uppercase text-text-secondary">
                      Experience
                    </span>
                  </div>
                  <h4 className="font-display font-black text-5xl md:text-6xl text-text-primary tracking-tighter leading-none mb-4 transition-all duration-500 group-hover:scale-[1.02] origin-left drop-shadow-sm">
                    {exp.company}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="font-display font-semibold text-xl text-text-primary/90 group-hover:text-text-primary transition-colors duration-500">{exp.role}</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-space-border dark:bg-white/20" />
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 border border-space-border dark:border-white/10 rounded-full bg-space-800 dark:bg-black/40 text-text-secondary group-hover:border-text-primary/20 transition-all duration-500">
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* The Reveal Fold */}
                <div className="relative z-10 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out mt-0 group-hover:mt-6">
                  <div className="overflow-hidden space-y-3">
                    {exp.highlights.map((h, j) => (
                      <div 
                        key={j} 
                        className="font-display text-sm md:text-base text-text-secondary group-hover:text-text-primary/95 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 leading-snug flex items-start gap-3"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-text-secondary/50 group-hover:bg-text-primary group-hover:shadow-[0_0_8px_currentColor] transition-all duration-500" />
                        <p>{h}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glare-effect absolute top-0 left-0 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-0 pointer-events-none mix-blend-screen transition-opacity duration-300" />
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BOTTOM ROW: CREDENTIALS & RESUME */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          
          {/* Education Ticket */}
          <div className="stagger-enter w-full h-full">
            <div className="interactive-physics relative w-full h-full aspect-square md:aspect-auto rounded-[2rem] overflow-hidden bg-space-800/30 dark:bg-gradient-to-tr dark:from-white/[0.02] dark:to-white/[0.05] backdrop-blur-3xl border border-space-border dark:border-white/10 p-8 flex flex-col justify-between group shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-text-primary/20 dark:hover:border-white/30 transition-all duration-500 min-h-[350px]">
              <div className="relative z-10">
              <span className="font-mono text-[10px] tracking-widest uppercase text-text-secondary border border-space-border dark:border-white/10 bg-space-800/50 dark:bg-black/40 px-4 py-1.5 rounded-full group-hover:border-text-primary/20 transition-colors duration-500">
                {education.period}
              </span>
              <h4 className="font-display font-black text-3xl text-text-primary mt-8 leading-tight group-hover:scale-[1.02] origin-left transition-transform duration-500 drop-shadow-sm">
                {education.institution}
              </h4>
              <p className="text-base text-text-secondary mt-3 font-medium">{education.degree}</p>
            </div>
            
            <div className="relative z-10 flex justify-between items-end">
              <div className="text-6xl font-hero tracking-tighter text-text-primary drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-500">
                {education.cgpa.split('/')[0]}
              </div>
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-text-secondary/40 group-hover:text-text-primary/60 transition-colors duration-500"><circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 20h20M20 10v20" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <div className="glare-effect absolute top-0 left-0 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-0 pointer-events-none mix-blend-screen transition-opacity duration-300" />
          </div>
          </div>

          {/* Certifications & Hackathons Stack */}
          <div className="stagger-enter flex flex-col gap-6">
            
            {/* SIH Certification */}
            <div className="interactive-physics relative w-full flex-[0.4] rounded-[2rem] overflow-hidden bg-space-800/30 dark:bg-gradient-to-bl dark:from-white/[0.02] dark:to-white/[0.05] backdrop-blur-3xl border border-space-border dark:border-white/10 p-6 flex flex-col justify-center group shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-text-primary/20 dark:hover:border-white/30 transition-all duration-500">
              <div className="relative z-10">
                <span className="font-mono text-[10px] tracking-widest uppercase text-text-secondary mb-3 block">
                  Certification
                </span>
                <h4 className="font-display font-bold text-xl text-text-primary group-hover:scale-[1.02] origin-left transition-transform duration-500">
                  Smart India Hackathon (SIH) Semi-Finalist
                </h4>
              </div>
              <div className="glare-effect absolute top-0 left-0 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-0 pointer-events-none mix-blend-screen transition-opacity duration-300" />
            </div>

            {/* Hackathon Digital Badges */}
            <div className="interactive-physics relative w-full flex-[0.6] rounded-[2rem] overflow-hidden bg-space-800/30 dark:bg-gradient-to-br dark:from-white/[0.02] dark:to-white/[0.05] backdrop-blur-3xl border border-space-border dark:border-white/10 p-6 flex flex-col group shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-text-primary/20 dark:hover:border-white/30 transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <span className="font-mono text-[10px] tracking-widest uppercase text-text-secondary mb-4 block">
                  Hackathon Conquests
                </span>
                <div className="flex flex-wrap gap-3">
                  {["Tata Elxsi Hackathon", "24-Hour Hackathon (GVP)", "VoyageHack 3.0"].map((hackathon, i) => (
                    <div key={i} className="font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-space-border dark:border-white/10 rounded-full bg-space-800/50 dark:bg-white/[0.03] text-text-primary/80 group-hover:border-text-primary/40 dark:group-hover:bg-white/10 group-hover:text-text-primary transition-all duration-500 flex items-center gap-2 shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 group-hover:bg-text-primary group-hover:shadow-[0_0_8px_currentColor]" />
                      {hackathon}
                    </div>
                  ))}
                </div>
              </div>
              <div className="glare-effect absolute top-0 left-0 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-0 pointer-events-none mix-blend-screen transition-opacity duration-300" />
            </div>
          </div>

          {/* Magnetic Resume Button */}
          <div className="stagger-enter xl:col-span-1 md:col-span-2 w-full h-full">
            <button 
              onClick={() => {
                setIsModalOpen(true);
                setIsPdfLoaded(false);
              }}
              className="interactive-physics group relative w-full h-full min-h-[350px] rounded-[2rem] border border-space-border dark:border-white/10 bg-space-800/30 dark:bg-gradient-to-t dark:from-white/[0.02] dark:to-white/[0.05] backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-text-primary/30 dark:hover:border-white/30 transition-all duration-500 block text-left"
            >
            <div className="absolute inset-0 bg-text-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)]" />
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase text-text-secondary group-hover:text-space-800 mb-6 transition-colors duration-500">
                Full Document
              </span>
              <h3 className="font-hero text-7xl uppercase leading-none text-text-primary group-hover:text-space-900 transition-colors duration-500 tracking-tighter drop-shadow-md group-hover:drop-shadow-none">
                View<br/>Résumé
              </h3>
              
              <div className="mt-10 w-14 h-14 rounded-full border border-space-border dark:border-white/30 group-hover:border-space-900/30 flex items-center justify-center transition-colors duration-500 bg-space-800/30 dark:bg-white/5 group-hover:bg-space-900/10">
                <svg className="w-6 h-6 text-text-primary group-hover:text-space-900 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            </button>
          </div>

        </div>
      </div>

      {/* macOS Style Resume Modal with Printing Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/60" 
              onClick={() => setIsModalOpen(false)} 
            />
            
            {/* macOS Window Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 w-full max-w-3xl h-[85vh] bg-[#1e1e1e] border border-white/10 rounded-xl flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              
              {/* macOS Traffic Light Header */}
              <div className="flex items-center px-4 h-12 border-b border-black/50 bg-[#2d2d2d] relative shrink-0 z-20 shadow-md">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:bg-[#ff5f56]/80 flex items-center justify-center group"
                    aria-label="Close"
                  >
                    <svg className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <button className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-default" />
                  <button className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-default" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 font-display font-medium text-white/50 text-xs tracking-wider">
                  Kuramdasu_Karthik.pdf
                </div>
                {/* Download Button */}
                <div className="absolute right-4 flex items-center">
                  <a 
                    href="/Kuramdasu_Karthik.pdf" 
                    download="Karthik_Kuramdasu_Resume.pdf"
                    className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white/90 hover:bg-white/10 transition-all duration-300"
                    title="Download Resume"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </a>
                </div>
              </div>

              {/* Body / Printer Slot */}
              <div className="relative flex-1 bg-[#121212] w-full flex justify-center overflow-hidden">
                
                {/* Printing Animation Wrapper */}
                <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: "100%" }}
                  transition={{ 
                    duration: 1.5, 
                    ease: [0.25, 1, 0.5, 1], // Custom slow-down printing ease
                    delay: 0.2
                  }}
                  className="relative w-full max-w-[850px] bg-white origin-top overflow-hidden shadow-2xl"
                >
                  <iframe 
                    src="/Kuramdasu_Karthik.pdf#toolbar=0&navpanes=0&view=Fit" 
                    className="absolute top-0 left-0 w-full h-full border-none"
                    title="Resume"
                  />
                  
                  {/* Glowing Laser line (Printer scanner effect) */}
                  <motion.div 
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 1.5, duration: 0.3 }}
                    className="absolute bottom-0 left-0 w-full h-1 bg-aurora-blue shadow-[0_0_20px_10px_rgba(79,107,246,0.3)] z-10"
                  />
                </motion.div>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
