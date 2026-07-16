import { useState, useEffect, useLayoutEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import TopNav from './TopNav'
import SideNav from './SideNav'

// SSR-safe: useLayoutEffect in browser, useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface ShellLayoutProps {
  children?: React.ReactNode
}

export default function ShellLayout({ children }: ShellLayoutProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [animate, setAnimate] = useState(false)

  // Runs synchronously before first paint — sidebar snaps to correct position
  // without animating, avoiding the open-on-mount flash.
  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    setSidebarOpen(mq.matches)
  }, [])

  // Runs after first paint — safe to enable transitions now.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      setSidebarOpen(e.matches)
    }
    mq.addEventListener('change', handler)
    setAnimate(true)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setSidebarOpen((prev) => !prev)
  const closeOnMobile = () => {
    if (!isDesktop) setSidebarOpen(false)
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <TopNav sidebarOpen={sidebarOpen} onToggle={toggle} />
      <SideNav open={sidebarOpen} animate={animate} onNavigate={closeOnMobile} />
      <main
        className={`pt-16 transition-all duration-300 min-h-screen ${
          sidebarOpen && isDesktop ? 'ml-56' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children ?? <Outlet />}
        </div>
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
