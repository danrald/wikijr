import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '#/lib/supabase'
import type { Database } from '#/types/database'

export const Route = createFileRoute('/_shell/supabase-call')({
  component: SupabaseCallPage,
})

type TestRecord = Database['public']['Tables']['Test']['Row']

// FunctionsHttpError carries the edge function's JSON error body in context
async function toErrorMessage(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json()
      if (body?.error) return body.error
    } catch {
      // fall through to generic message
    }
  }
  return error instanceof Error ? error.message : String(error)
}

export function SupabaseCallPage() {
  const [rows, setRows] = useState<TestRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  async function fetchData() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.functions.invoke('crud-items', {
      method: 'GET',
    })
    setLoading(false)
    if (error) {
      setError(await toErrorMessage(error))
    } else {
      setRows(data as TestRecord[])
    }
  }

  async function mutate(run: () => Promise<{ error: unknown }>) {
    setBusy(true)
    setError(null)
    const { error } = await run()
    setBusy(false)
    if (error) {
      setError(await toErrorMessage(error))
      return false
    }
    await fetchData()
    return true
  }

  async function createRow() {
    const name = newName.trim()
    if (!name) return
    const ok = await mutate(() =>
      supabase.functions.invoke('crud-items', {
        method: 'POST',
        body: { Name: name },
      }),
    )
    if (ok) setNewName('')
  }

  async function updateRow(id: number) {
    const ok = await mutate(() =>
      supabase.functions.invoke(`crud-items?id=${id}`, {
        method: 'PUT',
        body: { Name: editingName.trim() || null },
      }),
    )
    if (ok) setEditingId(null)
  }

  async function deleteRow(id: number) {
    await mutate(() =>
      supabase.functions.invoke(`crud-items?id=${id}`, {
        method: 'DELETE',
      }),
    )
  }

  function startEdit(row: TestRecord) {
    setEditingId(row.id)
    setEditingName(row.Name ?? '')
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-sea-ink">Supabase Call</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') createRow() }}
          placeholder="New record name"
          className="input"
        />
        <button
          onClick={createRow}
          disabled={busy || !newName.trim()}
          className="btn btn-primary"
        >
          Add
        </button>
        <button
          onClick={fetchData}
          disabled={loading || busy}
          className="btn btn-ghost"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {rows && (
        <div className="island-shell overflow-hidden">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-sand">
              <tr>
                {['ID', 'Created At', 'Name', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-sea-ink-soft uppercase tracking-wide text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-link-hover">
                  <td className="px-4 py-3 font-medium text-lagoon-deep">{row.id}</td>
                  <td className="px-4 py-3 text-sea-ink-soft">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sea-ink-soft">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') updateRow(row.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        className="input w-full px-2 py-1"
                      />
                    ) : (
                      row.Name
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-3 whitespace-nowrap">
                    {editingId === row.id ? (
                      <>
                        <button
                          onClick={() => updateRow(row.id)}
                          disabled={busy}
                          className="btn-link"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={busy}
                          className="btn-link btn-link-muted"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(row)}
                          disabled={busy}
                          className="btn-link"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRow(row.id)}
                          disabled={busy}
                          className="btn-link btn-link-danger"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sea-ink-soft">
                    No records yet — add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
