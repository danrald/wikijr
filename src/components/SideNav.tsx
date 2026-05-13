import { Link } from '@tanstack/react-router'

interface SideNavProps {
  open: boolean
  animate: boolean
  onNavigate?: () => void
}

const links = [
  { label: 'Home', to: '/' },
  { label: 'Articles', to: '/articles' },
  { label: 'Team', to: '/team' },
  { label: 'Supabase Call', to: '/supabase-call' },
] as const

export default function SideNav({ open, animate, onNavigate }: SideNavProps) {
  return (
    <aside
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-48 bg-gray-800 text-white transform ${
        animate ? 'transition-transform duration-300' : ''
      } ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <nav className="p-4 space-y-2">
        {links.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="block p-2 rounded hover:bg-gray-600"
            activeProps={{ className: 'block p-2 rounded bg-gray-600 font-semibold' }}
            activeOptions={{ exact: to === '/' }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
