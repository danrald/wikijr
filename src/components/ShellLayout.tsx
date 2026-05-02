import { useState, useEffect } from 'react'
import TopNav from './TopNav'
import SideNav from './SideNav'

interface ShellLayoutProps {
  children: React.ReactNode
}

export default function ShellLayout({ children }: ShellLayoutProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    setSidebarOpen(mq.matches)

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      setSidebarOpen(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setSidebarOpen((prev) => !prev)
  const closeOnMobile = () => {
    if (!isDesktop) setSidebarOpen(false)
  }

  return (
    <div className="bg-gray-100 overflow-x-hidden">
      <TopNav sidebarOpen={sidebarOpen} onToggle={toggle} />
      <SideNav open={sidebarOpen} />
      <main
        className={`pt-16 transition-all duration-300 min-h-screen ${
          sidebarOpen && isDesktop ? 'ml-48' : 'ml-0'
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
      <div
        onClick={closeOnMobile}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
          sidebarOpen && !isDesktop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </div>
  )
}
