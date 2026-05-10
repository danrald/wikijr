export type Section = 'home' | 'articles' | 'team'

interface MainContentProps {
  activeSection: Section
}

function HomeContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome Home</h1>
      <p className="text-gray-600 max-w-prose">
        Stay up to date with recent edits, new articles, and team activity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Articles', value: '142' },
          { label: 'Contributors', value: '28' },
          { label: 'Edits this week', value: '67' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-4xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h2>
        <ul className="divide-y divide-gray-100">
          {[
            { user: 'Alice', action: 'edited', page: 'Getting Started', time: '2 min ago' },
            { user: 'Bob', action: 'created', page: 'API Reference', time: '1 hr ago' },
            { user: 'Carol', action: 'commented on', page: 'Deployment Guide', time: '3 hr ago' },
          ].map((item) => (
            <li key={item.page} className="py-2 flex justify-between text-sm">
              <span>
                <span className="font-medium text-gray-900">{item.user}</span>{' '}
                <span className="text-gray-500">{item.action}</span>{' '}
                <span className="text-blue-600">{item.page}</span>
              </span>
              <span className="text-gray-400">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ArticlesContent() {
  const articles = [
    { title: 'Getting Started', category: 'Guides', updated: 'May 5, 2026', readTime: '4 min' },
    { title: 'Architecture Overview', category: 'Design', updated: 'May 3, 2026', readTime: '8 min' },
    { title: 'API Reference', category: 'Reference', updated: 'May 1, 2026', readTime: '12 min' },
    { title: 'Deployment Guide', category: 'Ops', updated: 'Apr 28, 2026', readTime: '6 min' },
    { title: 'Troubleshooting FAQ', category: 'Support', updated: 'Apr 25, 2026', readTime: '5 min' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
      <p className="text-gray-600">Browse all wiki articles.</p>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Title', 'Category', 'Last Updated', 'Read Time'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wide text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((a) => (
              <tr key={a.title} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 font-medium text-blue-600">{a.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{a.category}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{a.updated}</td>
                <td className="px-4 py-3 text-gray-500">{a.readTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TeamContent() {
  const members = [
    { name: 'Alice Johnson', role: 'Admin', joined: 'Jan 2025', contributions: 84 },
    { name: 'Bob Smith', role: 'Editor', joined: 'Mar 2025', contributions: 41 },
    { name: 'Carol White', role: 'Editor', joined: 'Apr 2025', contributions: 29 },
    { name: 'David Lee', role: 'Viewer', joined: 'May 2025', contributions: 5 },
  ]
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
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs mr-2 ${
                  m.role === 'Admin' ? 'bg-red-50 text-red-700' :
                  m.role === 'Editor' ? 'bg-green-50 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{m.role}</span>
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

export default function MainContent({ activeSection }: MainContentProps) {
  if (activeSection === 'articles') return <ArticlesContent />
  if (activeSection === 'team') return <TeamContent />
  return <HomeContent />
}
