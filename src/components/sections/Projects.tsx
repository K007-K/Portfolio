// Projects section — dark bento grid with fixed GSAP reveals and hover glow
import { useRef } from 'react'
import { projects } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.project-card')

    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        rotateX: 4,
        duration: 0.9,
        ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      })
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="projects" className="py-32 relative bg-transparent z-10">
      <div className="section-container">
        <h2 className="section-heading text-text-primary">
          SELECTED <span className="text-aurora-blue italic">WORKS</span>
        </h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
          {projects.map((project, i) => {
            const isWide = i % 3 === 0
            const spanClass = isWide ? 'md:col-span-7' : 'md:col-span-5'

            return (
              <div
                key={project.title}
                className={`project-card relative group rounded-3xl p-8 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-aurora-blue/30 hover:shadow-[0_0_50px_-20px_rgba(79,107,246,0.2)] flex flex-col justify-between min-h-[320px] ${spanClass}`}
                style={{ perspective: '800px' }}
              >
                {/* Faded project number */}
                <span className="absolute top-4 right-6 font-display font-black text-[100px] leading-none text-white/[0.03] select-none pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-aurora-blue/[0.06] via-transparent to-aurora-purple/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex-1">
                  <h3 className="font-display font-semibold tracking-tight text-2xl md:text-3xl mb-4 text-text-primary group-hover:text-aurora-blue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-lg">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border border-white/[0.08] bg-white/[0.02] text-text-secondary group-hover:border-aurora-blue/20 transition-colors duration-300"
                      >
                        <span className="w-1 h-1 rounded-full bg-aurora-blue/60" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action links */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/[0.06] relative z-10">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub repo for ${project.title}`}
                      className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-aurora-blue transition-all duration-300 group/link"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span className="font-mono text-xs">Source</span>
                      <svg className="w-3 h-3 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo of ${project.title}`}
                      className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-aurora-purple transition-all duration-300 group/link"
                    >
                      <span className="font-mono text-xs">Live</span>
                      <svg className="w-3 h-3 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
