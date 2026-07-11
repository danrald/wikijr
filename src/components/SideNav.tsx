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
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-56 bg-slate-900 border-r border-slate-700 transform ${
        animate ? 'transition-transform duration-300' : ''
      } ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <nav className="p-3 space-y-1">
        {links.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            activeProps={{ className: 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-500' }}
            activeOptions={{ exact: to === '/' }}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
