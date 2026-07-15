import { Menu } from 'lucide-react'

interface TopNavProps {
  sidebarOpen: boolean
  onToggle: () => void
}

export default function TopNav({ sidebarOpen, onToggle }: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 text-[#212529]">
      <button
        onClick={onToggle}
        aria-expanded={sidebarOpen}
        className="p-2 text-[#212529] hover:bg-slate-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      <span className="font-semibold text-[#212529] tracking-tight">WikiJr</span>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 text-sm text-[#212529]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Search...
        </div>
        <div className="h-8 w-8 bg-slate-400 flex items-center justify-center text-white text-sm font-medium">
          D
        </div>
      </div>
    </header>
  )
}
