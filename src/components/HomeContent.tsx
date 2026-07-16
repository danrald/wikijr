export default function HomeContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Welcome Home</h1>
      <p className="text-gray-600 dark:text-slate-400 max-w-prose">
        Stay up to date with recent edits, new articles, and team activity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Articles', value: '142' },
          { label: 'Contributors', value: '28' },
          { label: 'Edits this week', value: '67' },
        ].map((stat) => (
          <div key={stat.label} className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 text-4xl font-semibold text-gray-900 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-3">Recent Activity</h2>
        <ul className="divide-y divide-gray-100 dark:divide-slate-800">
          {[
            { user: 'Alice', action: 'edited', page: 'Getting Started', time: '2 min ago' },
            { user: 'Bob', action: 'created', page: 'API Reference', time: '1 hr ago' },
            { user: 'Carol', action: 'commented on', page: 'Deployment Guide', time: '3 hr ago' },
          ].map((item) => (
            <li key={item.page} className="py-2 flex justify-between text-sm">
              <span>
                <span className="font-medium text-gray-900 dark:text-slate-100">{item.user}</span>{' '}
                <span className="text-gray-500 dark:text-slate-400">{item.action}</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">{item.page}</span>
              </span>
              <span className="text-gray-400 dark:text-slate-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
