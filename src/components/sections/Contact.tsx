// Contact section — dark elegant split layout with glowing form
import { useState, useRef, type FormEvent } from 'react'
import { personalInfo } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const contactItems = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: personalInfo.email,
    href: personalInfo.socials.email,
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: personalInfo.phone,
    href: `tel:${personalInfo.phone.replace(/\s/g, '')}`,
  },
  {
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
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: 'LinkedIn',
    href: personalInfo.socials.linkedin,
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`)
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)
    window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_self')
    setTimeout(() => {
      setSending(false)
      setFormData({ name: '', email: '', message: '' })
    }, 1000)
  }

  return (
    <section ref={containerRef} id="contact" className="py-32 bg-space-900 relative z-10">
      <div className="section-container">
        <h2 className="contact-reveal section-heading text-text-primary">
          LET'S <span className="text-aurora-blue italic">CONNECT</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div className="contact-reveal space-y-6">
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              I'm always open to discussing new opportunities, creative ideas, or just having a good conversation about technology.
            </p>

            <div className="space-y-4 mt-8">
              {contactItems.map((item) => (
                <div key={item.label} className="group flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center text-text-secondary group-hover:border-aurora-blue/30 group-hover:text-aurora-blue transition-all duration-300">
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="font-mono text-sm text-text-secondary">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-reveal rounded-3xl p-8 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
            <h3 className="font-display font-semibold text-xl text-text-primary mb-6">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-text-secondary mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-aurora-blue/40 focus:shadow-[0_0_15px_-3px_rgba(79,107,246,0.2)] transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-aurora-blue/40 focus:shadow-[0_0_15px_-3px_rgba(79,107,246,0.2)] transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  placeholder="How can I help you?"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-aurora-blue/40 focus:shadow-[0_0_15px_-3px_rgba(79,107,246,0.2)] transition-all duration-300 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full relative overflow-hidden flex items-center justify-center gap-2 bg-aurora-blue text-white font-display font-semibold text-sm py-3.5 rounded-xl hover:shadow-[0_0_25px_-5px_rgba(79,107,246,0.5)] transition-all duration-300 disabled:opacity-60 group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
