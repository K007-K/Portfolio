// Contact section — dark elegant split layout with glowing form
import { useState, useRef, type FormEvent } from 'react'
import { personalInfo } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { LiquidButton } from '../ui/liquid-glass-button'

gsap.registerPlugin(ScrollTrigger)

const contactItems = [
  {
    id: 'email',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: personalInfo.email,
    href: null, // Custom copy-to-clipboard logic
    copyValue: personalInfo.email,
  },
  {
    id: 'phone',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: personalInfo.phone,
    href: null, // Custom copy-to-clipboard logic
    copyValue: personalInfo.phone,
  },
  {
    id: 'location',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: personalInfo.location,
    href: null,
  },
  {
    id: 'linkedin',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: 'LinkedIn',
    href: personalInfo.socials.linkedin,
  },
  {
    id: 'github',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    label: 'GitHub',
    href: personalInfo.socials.github,
  }
]

// Magnetic Wrapper Component
function MagneticWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    // Calculate distance from center
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    // Apply a magnetic pull (fraction of the distance)
    x.set(distanceX * 0.3)
    y.set(distanceY * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Premium Glass Input Component
function GlassInput({ id, label, type, value, onChange, required, isTextArea = false }: any) {
  return (
    <div className="group flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary group-focus-within:text-aurora-blue transition-colors duration-300">
        {label}
      </label>
      
      <div className="relative">
        {isTextArea ? (
          <textarea
            id={id}
            required={required}
            value={value}
            onChange={onChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aurora-blue/50 focus:bg-white/[0.06] transition-all duration-300 resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] focus:shadow-[0_0_20px_-5px_rgba(79,107,246,0.2)]"
            placeholder={`Enter your ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            id={id}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aurora-blue/50 focus:bg-white/[0.06] transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] focus:shadow-[0_0_20px_-5px_rgba(79,107,246,0.2)] [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white [&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-[50000s]"
            placeholder={type === 'email' ? 'john@example.com' : `Enter your ${label.toLowerCase()}...`}
          />
        )}
      </div>
    </div>
  )
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const elements = gsap.utils.toArray<HTMLElement>('.contact-reveal')
    elements.forEach((el, i) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    })
  }, { scope: containerRef })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Portfolio Contact from ${formData.name}`,
          from_name: "Karthik Portfolio",
        }),
      })

      const result = await response.json()
      if (result.success) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section ref={containerRef} id="contact" className="py-32 bg-transparent relative z-10">
      <div className="section-container">
        <h2 className="contact-reveal section-heading text-text-primary">
          LET'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-blue to-white italic">CONNECT</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mt-12">
          {/* Tactile Contact Info */}
          <div className="contact-reveal space-y-8">
            <p className="text-text-secondary text-base leading-relaxed max-w-md">
              I'm always open to discussing new opportunities, creative ideas, or just having a good conversation about technology.
            </p>

            <div className="space-y-6 pt-4">
              {contactItems.map((item) => (
                <div key={item.id} className="relative group flex items-center gap-5">
                  <MagneticWrapper>
                    <div className="relative w-12 h-12 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md flex items-center justify-center text-text-secondary group-hover:border-aurora-blue/50 group-hover:text-aurora-blue group-hover:shadow-[0_0_15px_-3px_rgba(79,107,246,0.3)] transition-all duration-300 cursor-pointer">
                      {/* Hover Reveal Radar for Location */}
                      {item.id === 'location' && (
                        <span className="absolute inset-[-4px] rounded-[1.2rem] border border-aurora-blue opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
                      )}
                      {item.icon}
                    </div>
                  </MagneticWrapper>
                  
                  <div className="flex flex-col relative">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-text-secondary hover:text-white transition-colors duration-300"
                      >
                        {item.label}
                      </a>
                    ) : item.copyValue ? (
                      <button
                        onClick={() => handleCopy(item.id, item.copyValue!)}
                        className="font-mono text-sm text-text-secondary hover:text-white transition-colors duration-300 text-left"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="font-mono text-sm text-text-secondary">
                        {item.label}
                      </span>
                    )}

                    {/* Copied Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: copiedId === item.id ? 1 : 0, 
                        y: copiedId === item.id ? 0 : 10 
                      }}
                      className="absolute -top-6 left-0 text-xs text-aurora-blue font-bold tracking-widest uppercase pointer-events-none"
                    >
                      Copied!
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Glass Form */}
          <div className="contact-reveal relative">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-aurora-blue/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative rounded-[2rem] p-8 sm:p-10 border border-white/[0.08] bg-black/40 backdrop-blur-2xl shadow-2xl">
              <h3 className="font-display font-semibold text-2xl text-white mb-2">
                Send a Message
              </h3>
              <p className="text-text-secondary text-sm mb-8">
                I typically reply within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <GlassInput
                  id="contact-name"
                  label="Your Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                />
                <GlassInput
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
                <GlassInput
                  id="contact-message"
                  label="Message"
                  isTextArea
                  required
                  value={formData.message}
                  onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                />
                
                <div className="pt-6">
                  <LiquidButton
                    onClick={handleSubmit}
                    className="w-full text-white bg-transparent hover:bg-white/5 border-none"
                  >
                    {status === 'idle' && "Send Message"}
                    {status === 'sending' && "Transmitting..."}
                    {status === 'success' && "Message Sent!"}
                    {status === 'error' && "Error. Try Again."}
                  </LiquidButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
