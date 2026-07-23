export default function HomeContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-sea-ink">Welcome Home</h1>
      <p className="text-sea-ink-soft max-w-prose">
        Stay up to date with recent edits, new articles, and team activity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Articles', value: '142' },
          { label: 'Contributors', value: '28' },
          { label: 'Edits this week', value: '67' },
        ].map((stat) => (
          <div key={stat.label} className="island-shell p-6">
            <p className="text-sm text-sea-ink-soft">{stat.label}</p>
            <p className="mt-1 text-4xl font-semibold text-sea-ink">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="island-shell p-6">
        <h2 className="text-lg font-semibold text-sea-ink mb-3">Recent Activity</h2>
        <ul className="divide-y divide-line">
          {[
            { user: 'Alice', action: 'edited', page: 'Getting Started', time: '2 min ago' },
            { user: 'Bob', action: 'created', page: 'API Reference', time: '1 hr ago' },
            { user: 'Carol', action: 'commented on', page: 'Deployment Guide', time: '3 hr ago' },
          ].map((item) => (
            <li key={item.page} className="py-2 flex justify-between text-sm">
              <span>
                <span className="font-medium text-sea-ink">{item.user}</span>{' '}
                <span className="text-sea-ink-soft">{item.action}</span>{' '}
                <span className="text-lagoon-deep">{item.page}</span>
              </span>
              <span className="text-sea-ink-soft">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
