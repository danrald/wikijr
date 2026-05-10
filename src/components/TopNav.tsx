interface TopNavProps {
  sidebarOpen: boolean
  onToggle: () => void
}

export default function TopNav({ sidebarOpen, onToggle }: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white  flex items-center px-4">
      <button
        onClick={onToggle}
        aria-expanded={sidebarOpen}
        className="text-2xl p-2 rounded hover:bg-gray-200"
      >
        ☰
      </button>
      <span className="ml-4 font-semibold">App</span>
    </header>
  )
}
