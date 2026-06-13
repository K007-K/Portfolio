// App root — assembles Navbar, sections, and Footer
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import RealityCanvas from './components/canvas/RealityCanvas'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import SmoothScroller from './components/SmoothScroller'
import ScrollDivider from './components/ui/ScrollDivider'
import CinematicReveal from './components/ui/CinematicReveal'

import { useState, useEffect } from 'react'

function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#050505] pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <InitialLoader />
      <SmoothScroller />
      <HelmetProvider>
        <Helmet>
          <title>Karthik Kuramdasu — Reality Engine</title>
          <meta
            name="description"
            content="Interactive Spatial Portfolio — Full-Stack Developer building scalable systems & intelligent interfaces."
          />
        </Helmet>

        <div className="min-h-screen text-text-primary selection:bg-aurora-blue selection:text-white overflow-hidden transition-colors duration-1000">
          <Navbar />

          <main>
            <Hero />
            
            <ScrollDivider />
            <CinematicReveal>
              <About />
            </CinematicReveal>
            
            <ScrollDivider />
            <CinematicReveal>
              <Skills />
            </CinematicReveal>
            
            <ScrollDivider />
            <CinematicReveal>
              <Projects />
            </CinematicReveal>
            
            <ScrollDivider />
            <CinematicReveal>
              <Contact />
            </CinematicReveal>
          </main>

          <Footer />
        </div>
      </HelmetProvider>
    </ThemeProvider>
  )
}
