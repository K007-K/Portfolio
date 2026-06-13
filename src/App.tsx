// App root — assembles Navbar, sections, and Footer
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import SmoothScroller from './components/SmoothScroller'

export default function App() {
  return (
    <>
      <SmoothScroller />
      <HelmetProvider>
      <Helmet>
        <title>Karthik Kuramdasu — Full-Stack Developer</title>
        <meta
          name="description"
          content="Full-Stack Developer building scalable systems & intelligent interfaces. React, Node.js, AI/GenAI."
        />
      </Helmet>

      <div className="min-h-screen bg-space-900 text-text-primary selection:bg-aurora-blue selection:text-space-900 overflow-hidden">
        <Navbar />

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
    </>
  )
}
