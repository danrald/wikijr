import { Separator } from '@base-ui/react/separator'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Database } from 'lucide-react'

interface SideNavProps {
  open: boolean
  animate: boolean
  onNavigate?: () => void
}

const links = [
  { label: 'Home', to: '/', icon: LayoutDashboard },
  { label: 'Supabase Call', to: '/supabase-call', icon: Database },
] as const

export default function SideNav({ open, animate, onNavigate }: SideNavProps) {
  return (
    <aside
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-56 bg-surface-strong backdrop-blur border-r border-line transform ${
        animate ? 'transition-transform duration-300' : ''
      } ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <nav className="p-3 space-y-1">
        <p className="px-3 py-1.5 text-xs uppercase tracking-wide text-sea-ink-soft">
          Navigation
        </p>
        {links.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 text-sm text-sea-ink no-underline hover:bg-link-hover transition-colors"
            activeProps={{ className: 'flex items-center gap-3 px-3 py-2 text-sm no-underline text-foam bg-lagoon-deep' }}
            activeOptions={{ exact: to === '/' }}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
        <Separator className="my-2 h-px bg-line" />
        <p className="px-3 text-xs text-sea-ink-soft">WikiJr v0.1</p>
      </nav>
    </aside>
  )
}
