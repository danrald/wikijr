interface SideNavProps {
  open: boolean
}

export default function SideNav({ open }: SideNavProps) {
  return (
    <aside
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-48 bg-gray-800 text-white transform transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="p-4 space-y-2">
        <a className="block p-2 rounded hover:bg-gray-600" href="#">Home</a>
        <a className="block p-2 rounded hover:bg-gray-600" href="#">Link 1</a>
        <a className="block p-2 rounded hover:bg-gray-600" href="#">Link 2</a>
      </nav>
    </aside>
  )
}
