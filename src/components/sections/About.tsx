// About/Resume section — dark glassmorphism bento grid with GSAP reveals
import { useRef } from 'react'
import { aboutBullets, education, experience, achievements, certifications } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.bento-card')

    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="resume" className="py-32 bg-space-900 relative z-10">
      <div className="section-container">
        <h2 className="section-heading text-text-primary">
          ABOUT <span className="text-aurora-purple italic">ME</span>
        </h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ━━━ ABOUT (top-left) ━━━ */}
          <div className="bento-card relative group rounded-3xl p-8 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-aurora-purple/30 hover:shadow-[0_0_40px_-15px_rgba(139,92,246,0.2)]">
            {/* Faded number */}
            <span className="absolute top-4 right-6 font-display font-black text-[120px] leading-none text-white/[0.03] select-none pointer-events-none">
              01
            </span>

            <h3 className="font-display font-semibold text-xl text-text-primary mb-6 tracking-tight">
              Who I Am
            </h3>
            <ul className="space-y-4 relative z-10">
              {aboutBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-aurora-purple mt-2 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ━━━ EDUCATION (top-right) ━━━ */}
          <div className="bento-card relative group rounded-3xl p-8 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-aurora-blue/30 hover:shadow-[0_0_40px_-15px_rgba(79,107,246,0.2)]">
            <span className="absolute top-4 right-6 font-display font-black text-[120px] leading-none text-white/[0.03] select-none pointer-events-none">
              02
            </span>

            <h3 className="font-display font-semibold text-xl text-text-primary mb-6 tracking-tight">
              Education
            </h3>

            <div className="space-y-3 relative z-10">
              <p className="font-display font-semibold text-lg text-text-primary leading-snug">
                B.Tech — Computer Science
              </p>
              <p className="text-sm text-text-secondary">
                {education.institution}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="font-mono text-sm font-semibold text-aurora-blue">
                  CGPA: {education.cgpa}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-aurora-blue/10 text-aurora-blue border border-aurora-blue/20">
                  In Progress
                </span>
              </div>
              <p className="font-mono text-xs text-text-secondary/60 mt-1">
                {education.period}
              </p>
            </div>
          </div>

          {/* ━━━ WORK EXPERIENCE (bottom-left) ━━━ */}
          <div className="bento-card relative group rounded-3xl p-8 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-aurora-red/30 hover:shadow-[0_0_40px_-15px_rgba(255,59,48,0.15)]">
            <span className="absolute top-4 right-6 font-display font-black text-[120px] leading-none text-white/[0.03] select-none pointer-events-none">
              03
            </span>

            <h3 className="font-display font-semibold text-xl text-text-primary mb-6 tracking-tight">
              Experience
            </h3>

            {experience.map((exp, i) => (
              <div key={i} className="relative z-10">
                {/* Timeline dot and line */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-aurora-red border-2 border-space-900 shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
                    <div className="w-px h-full bg-gradient-to-b from-aurora-red/40 to-transparent min-h-[80px]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-display font-semibold text-base text-text-primary">{exp.role}</p>
                    <p className="text-sm text-text-secondary mt-1">{exp.company} · {exp.type}</p>
                    <span className="inline-block mt-2 mb-4 font-mono text-[11px] tracking-wider text-text-secondary/60 uppercase">
                      {exp.period}
                    </span>

                    <ul className="space-y-2.5">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                          <span className="w-1 h-1 rounded-full bg-aurora-red/60 mt-2 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ━━━ CERTIFICATIONS + ACHIEVEMENTS (bottom-right, stacked) ━━━ */}
          <div className="flex flex-col gap-5">
            {/* Certifications */}
            <div className="bento-card relative group rounded-3xl p-6 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-aurora-blue/30">
              <span className="absolute top-3 right-5 font-display font-black text-[80px] leading-none text-white/[0.03] select-none pointer-events-none">
                04
              </span>

              <h3 className="font-display font-semibold text-lg text-text-primary mb-4 tracking-tight">
                Certifications
              </h3>

              <div className="space-y-2.5 relative z-10">
                {certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-aurora-blue/20 transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-aurora-blue shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-medium text-sm text-text-primary truncate">{cert.name}</p>
                      <p className="font-mono text-xs text-text-secondary/60">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bento-card relative group rounded-3xl p-6 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-aurora-purple/30">
              <h3 className="font-display font-semibold text-lg text-text-primary mb-4 tracking-tight">
                Achievements
              </h3>

              <div className="space-y-2.5 relative z-10">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-aurora-purple/20 transition-all duration-300"
                  >
                    <span className="text-lg shrink-0">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-medium text-sm text-text-primary truncate">{a.title}</p>
                      <p className="font-mono text-xs text-text-secondary/60">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
