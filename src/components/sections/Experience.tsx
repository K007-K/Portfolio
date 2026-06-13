// Experience section — Timeline with scroll-triggered animations
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience, education, achievements } from '../../lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const eduRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Timeline items
      gsap.from(timelineRef.current?.querySelectorAll('.timeline-item') || [], {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Education card
      gsap.from(eduRef.current, {
        scrollTrigger: {
          trigger: eduRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="section-padding relative" style={{ background: 'var(--surface)' }}>
      {/* Section label */}
      <p
        className="font-mono text-[11px] uppercase tracking-[0.15em] mb-4"
        style={{ color: 'var(--accent)' }}
      >
        04 — Experience
      </p>

      <h2
        ref={headingRef}
        className="font-display font-bold tracking-tight mb-16"
        style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          color: 'var(--text)',
          letterSpacing: '-0.02em',
        }}
      >
        Where I've worked.
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Timeline — 3 cols */}
        <div ref={timelineRef} className="lg:col-span-3 relative">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[1px]"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />

          {experience.map((exp, i) => (
            <div key={i} className="timeline-item relative pl-8 pb-12 last:pb-0">
              {/* Dot on timeline */}
              <div
                className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-[3.5px]"
                style={{
                  background: 'var(--accent)',
                  boxShadow: '0 0 12px rgba(212, 245, 122, 0.3)',
                }}
              />

              {/* Period */}
              <span
                className="font-mono text-[11px] uppercase tracking-[0.1em] block mb-2"
                style={{ color: 'var(--muted2)' }}
              >
                {exp.period}
              </span>

              {/* Role + Company */}
              <h3
                className="font-display font-bold text-[22px] tracking-tight mb-1"
                style={{ color: 'var(--text)' }}
              >
                {exp.role}
              </h3>
              <p
                className="font-body text-[15px] mb-4 flex items-center gap-2"
                style={{ color: 'var(--accent)' }}
              >
                {exp.company}
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase"
                  style={{
                    background: 'rgba(212, 245, 122, 0.1)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(212, 245, 122, 0.15)',
                  }}
                >
                  {exp.type}
                </span>
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                      style={{ background: 'var(--muted2)' }}
                    />
                    <span
                      className="font-body text-[14px] leading-[1.7] font-light"
                      style={{ color: 'var(--muted)' }}
                    >
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education + Achievements — 2 cols */}
        <div ref={eduRef} className="lg:col-span-2 space-y-6">
          {/* Education card */}
          <div className="glass-panel rounded-2xl p-6">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.12em] mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Education
            </p>
            <h3
              className="font-display font-bold text-[20px] tracking-tight mb-1"
              style={{ color: 'var(--text)' }}
            >
              {education.degree}
            </h3>
            <p
              className="font-body text-[14px] mb-3"
              style={{ color: 'var(--muted)' }}
            >
              {education.institution}
            </p>
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-[12px]"
                style={{ color: 'var(--muted2)' }}
              >
                {education.period}
              </span>
              <span
                className="px-2 py-0.5 rounded-full font-mono text-[11px] font-medium"
                style={{
                  background: 'rgba(212, 245, 122, 0.12)',
                  color: 'var(--accent)',
                }}
              >
                CGPA {education.cgpa}
              </span>
            </div>
          </div>

          {/* Achievements card */}
          <div className="glass-panel rounded-2xl p-6">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.12em] mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Achievements & Hackathons
            </p>
            <ul className="space-y-3">
              {achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--accent)' }} className="text-[14px] mt-0.5">
                    ▹
                  </span>
                  <span
                    className="font-body text-[13px] leading-[1.6] font-light"
                    style={{ color: 'var(--muted)' }}
                  >
                    {a}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
