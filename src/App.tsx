// Portfolio "Signal" — App root with lazy-loaded sections and smooth scroll
import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import GlobalCursor from './components/ui/GlobalCursor'
import './index.css'

// ── Lazy-loaded sections (code-split below the fold) ──
const Hero = lazy(() => import('./components/sections/Hero'))
const About = lazy(() => import('./components/sections/About'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Experience = lazy(() => import('./components/sections/Experience'))
const Contact = lazy(() => import('./components/sections/Contact'))

// ── Section loading fallback ──
function SectionFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div
        className="w-6 h-6 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: 'var(--accent)',
          borderRightColor: 'var(--accent)',
        }}
      />
    </div>
  )
}

function App() {
  // Initialize Lenis smooth scroll + GSAP ScrollTrigger integration
  useSmoothScroll()

  return (
    <HelmetProvider>
      {/* Custom cursor — desktop only */}
      <GlobalCursor />

      <main>
        <Suspense fallback={<SectionFallback />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>
    </HelmetProvider>
  )
}

export default App
