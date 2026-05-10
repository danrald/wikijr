const articles = [
  { title: 'Getting Started', category: 'Guides', updated: 'May 5, 2026', readTime: '4 min' },
  { title: 'Architecture Overview', category: 'Design', updated: 'May 3, 2026', readTime: '8 min' },
  { title: 'API Reference', category: 'Reference', updated: 'May 1, 2026', readTime: '12 min' },
  { title: 'Deployment Guide', category: 'Ops', updated: 'Apr 28, 2026', readTime: '6 min' },
  { title: 'Troubleshooting FAQ', category: 'Support', updated: 'Apr 25, 2026', readTime: '5 min' },
]

export default function ArticlesContent() {
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
