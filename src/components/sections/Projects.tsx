import { useState, useRef } from 'react'
import { projects } from '../../lib/data'

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLElement>(null)

  const handleToggle = (i: number) => {
    const isExpanding = activeIndex !== i
    setActiveIndex(isExpanding ? i : null)

    // Smart auto-scroll for mobile, synchronized with CSS transition
    if (isExpanding && window.innerWidth < 768) {
      setTimeout(() => {
        const wrapper = document.getElementById(`project-wrapper-${i}`)
        if (wrapper) {
          const rect = wrapper.getBoundingClientRect()
          if (rect.top < 80 || rect.bottom > window.innerHeight) {
            const scrollY = window.scrollY || window.pageYOffset
            window.scrollTo({
              top: scrollY + rect.top - 100, // Leave 100px padding at top
              behavior: 'smooth' // Native smooth scrolling is highly optimized on Android
            })
          }
        }
      }, 350) // Wait for CSS transition to reach halfway point
    }
  }

  return (
    <section ref={containerRef} id="projects" className="py-32 relative bg-transparent z-10 min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12">
        <h2 className="section-heading text-text-primary mb-16 md:mb-24 text-center">
          SELECTED <span className="text-aurora-blue italic">WORKS</span>
        </h2>

        <div className="border-b border-white/[0.04]">
          {projects.map((project, i) => {
            const isExpanded = activeIndex === i
            const isDimmed = activeIndex !== null && activeIndex !== i

            return (
              <div 
                key={project.title}
                id={`project-wrapper-${i}`}
                className={`border-t border-white/[0.04] transition-all duration-700 ${isDimmed ? 'opacity-40 grayscale-[50%]' : 'opacity-100'} group cursor-pointer`}
                onClick={() => handleToggle(i)}
              >
                {/* Accordion Header Row */}
                <div className="py-8 md:py-12 flex justify-between items-center group-hover:bg-white/[0.02] transition-colors duration-500 px-4 md:px-8">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                    <span className="font-mono text-xs md:text-sm text-text-secondary group-hover:text-aurora-blue transition-colors duration-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 
                      className="font-display font-black text-3xl md:text-5xl lg:text-6xl tracking-tighter text-transparent bg-clip-text bg-[length:200%_auto] animate-shimmer-sweep uppercase break-words max-w-4xl"
                      style={{
                        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.3) 100%)',
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  
                  <div className="hidden md:flex items-center ml-8">
                     <span className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${isExpanded ? 'text-aurora-blue' : 'text-text-secondary group-hover:text-white'}`}>
                       {isExpanded ? 'Close' : 'Explore'}
                     </span>
                  </div>
                </div>

                {/* Inner Content (CSS Grid Controlled Height - High Performance) */}
                <div 
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden px-4 md:px-8">
                    <div className="pb-12 pt-4">
                      {/* Heavy backdrop-blur is disabled on mobile entirely to prevent Android hanging */}
                      <div className="interactive-physics w-full rounded-3xl overflow-hidden bg-space-800/80 md:bg-space-800/30 dark:bg-gradient-to-br dark:from-white/[0.04] dark:to-white/[0.08] md:backdrop-blur-xl border border-space-border dark:border-white/10 p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row gap-12 lg:gap-16 cursor-default">
                        
                        <div className="flex-1">
                          <span className="font-mono text-[10px] tracking-widest uppercase text-aurora-blue mb-6 block">
                            Project Overview
                          </span>
                          <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-10">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-3">
                            {project.tech.map((t) => (
                              <span 
                                key={t} 
                                className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] uppercase tracking-wider text-text-primary backdrop-blur-md shadow-inner"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Links */}
                        <div className="lg:w-64 flex flex-col gap-4 justify-center">
                          {project.github && (
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-full px-6 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-xs flex items-center justify-between hover:scale-[1.02] hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] group/link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                View Source
                              </div>
                              <svg className="w-4 h-4 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7-7m7-7H3"></path></svg>
                            </a>
                          )}
                          {project.live && (
                             <a 
                               href={project.live} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="w-full px-6 py-4 rounded-2xl border border-white/20 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-between hover:bg-white/10 transition-colors duration-300"
                               onClick={(e) => e.stopPropagation()}
                             >
                               Live Demo
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                             </a>
                          )}
                        </div>

                        {/* Ambient Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(79,107,246,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
