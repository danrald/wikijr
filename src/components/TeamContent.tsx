const members = [
  { name: 'Alice Johnson', role: 'Admin', joined: 'Jan 2025', contributions: 84 },
  { name: 'Bob Smith', role: 'Editor', joined: 'Mar 2025', contributions: 41 },
  { name: 'Carol White', role: 'Editor', joined: 'Apr 2025', contributions: 29 },
  { name: 'David Lee', role: 'Viewer', joined: 'May 2025', contributions: 5 },
]

const roleBadge: Record<string, string> = {
  Admin: 'bg-red-50 text-red-700',
  Editor: 'bg-green-50 text-green-700',
  Viewer: 'bg-gray-100 text-gray-600',
}

export default function TeamContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Team</h1>
      <p className="text-gray-600">Manage team members and their access levels.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
              {m.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{m.name}</p>
              <p className="text-sm text-gray-500">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs mr-2 ${roleBadge[m.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {m.role}
                </span>
                Joined {m.joined}
              </p>
            </div>
            <div className="ml-auto text-right shrink-0">
              <p className="text-2xl font-semibold text-gray-900">{m.contributions}</p>
              <p className="text-xs text-gray-400">edits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
