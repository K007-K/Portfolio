import { useRef } from 'react'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const allSkills = Object.values(skills).flatMap((cat) => cat.items)

  useGSAP(() => {
    const words = gsap.utils.toArray('.skill-word')

    gsap.fromTo(
      words,
      { opacity: 0.05 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=2500', // Pin for 2.5 screens
          scrub: 1,
          pin: true,
        },
      }
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="skills" className="bg-transparent relative z-10 flex items-center min-h-screen overflow-hidden py-12 border-y border-white/[0.04]">
      <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-center h-full">
        <h2 className="section-heading text-text-secondary mb-8 md:mb-12 opacity-50 tracking-widest text-sm md:text-base">
          ENGINEERING ARSENAL
        </h2>
        
        <div className="font-display font-black text-[12vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.5vw] leading-[1] tracking-tighter uppercase flex flex-wrap gap-x-3 md:gap-x-6 gap-y-1 md:gap-y-2">
          {allSkills.map((skill, i) => (
            <span key={i} className="flex items-center">
              <span className="skill-word text-text-primary transition-all duration-300 hover:text-aurora-blue cursor-default">
                {skill}
              </span>
              {i !== allSkills.length - 1 && (
                <span className="skill-word text-aurora-purple/60 ml-3 md:ml-6 font-light">
                  /
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
