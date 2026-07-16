import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '#/lib/supabase'

export const Route = createFileRoute('/_shell/supabase-call')({
  component: SupabaseCallPage,
})

type TestRecord = {
  id: number
  created_at: string
  Name: string
}

function SupabaseCallPage() {
  const [rows, setRows] = useState<TestRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.functions.invoke('GetTestsAgain', {
      body: { name: 'Functions' },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setRows((data as { data: TestRecord[] }).data)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Call</h1>

      <button
        onClick={fetchData}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {rows && (
        <div className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                {['ID', 'Created At', 'Name'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{row.id}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{row.Name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
