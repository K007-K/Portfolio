import { useRef, ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CinematicRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function CinematicReveal({ children, delay = 0 }: CinematicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    gsap.fromTo(containerRef.current,
      {
        opacity: 0,
        filter: 'blur(20px)',
        y: 100,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="will-change-[opacity,filter,transform]">
      {children}
    </div>
  )
}
