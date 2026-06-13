// Global Reality Context — Manages the Light/Dark mode "Reality Shift"
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const toggleTheme = () => {
    setIsTransitioning(true)
    
    // The actual theme switch happens midway through the transition shader
    setTimeout(() => {
      setTheme((prev) => {
        const next = prev === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(next)
        return next
      })
    }, 800) // 800ms aligns with the peak of our WebGL distortion wave

    // End transition
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1600)
  }

  // Ensure initial class is set
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
