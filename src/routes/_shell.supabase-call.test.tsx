import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { SupabaseCallPage } from './_shell.supabase-call'

// The route module imports the real `#/lib/supabase` client, which calls
// createClient() at import time and needs live env vars. Mock it so the
// component talks to an in-memory fake instead of a network client.
vi.mock('#/lib/supabase', () => ({
  supabase: { functions: { invoke: vi.fn() } },
}))

import { supabase } from '#/lib/supabase'

const invoke = supabase.functions.invoke as ReturnType<typeof vi.fn>

// Mimics the crud-items edge function's behavior against an in-memory table,
// so the test exercises the same request/response shapes the real function returns.
function mockCrudItems(initialRows: { id: number; created_at: string; Name: string | null }[]) {
  let rows = [...initialRows]
  let nextId = Math.max(0, ...rows.map((r) => r.id)) + 1

  invoke.mockImplementation(async (name: string, options: { method: string; body?: unknown }) => {
    if (name !== 'crud-items' && !name.startsWith('crud-items?')) {
      throw new Error(`unexpected function name: ${name}`)
    }
    const url = new URL(`https://x${name.replace('crud-items', '')}`)
    const id = url.searchParams.get('id')

    switch (options.method) {
      case 'GET':
        return { data: id ? rows.filter((r) => r.id === Number(id)) : rows, error: null }
      case 'POST': {
        const body = options.body as { Name: string }
        const row = { id: nextId++, created_at: new Date().toISOString(), Name: body.Name }
        rows = [...rows, row]
        return { data: [row], error: null }
      }
      case 'PUT': {
        const body = options.body as { Name: string | null }
        rows = rows.map((r) => (r.id === Number(id) ? { ...r, Name: body.Name } : r))
        return { data: rows.filter((r) => r.id === Number(id)), error: null }
      }
      case 'DELETE':
        rows = rows.filter((r) => r.id !== Number(id))
        return { data: { success: true }, error: null }
      default:
        throw new Error(`unexpected method: ${options.method}`)
    }
  })

  return () => rows
}

beforeEach(() => {
  invoke.mockReset()
})

describe('SupabaseCallPage', () => {
  it('loads and displays rows on mount', async () => {
    mockCrudItems([{ id: 1, created_at: '2026-01-01T00:00:00Z', Name: 'Alpha' }])

    render(<SupabaseCallPage />)

    expect(await screen.findByText('Alpha')).toBeDefined()
    expect(invoke).toHaveBeenCalledWith('crud-items', { method: 'GET' })
  })

  it('creates a new row and refreshes the list', async () => {
    mockCrudItems([])

    render(<SupabaseCallPage />)
    await waitFor(() => expect(screen.getByText('No records yet — add one above.')).toBeDefined())

    fireEvent.change(screen.getByPlaceholderText('New record name'), {
      target: { value: 'Bravo' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Bravo')).toBeDefined()
    expect(invoke).toHaveBeenCalledWith('crud-items', {
      method: 'POST',
      body: { Name: 'Bravo' },
    })
    // Input clears after a successful create
    expect((screen.getByPlaceholderText('New record name') as HTMLInputElement).value).toBe('')
  })

  it('edits a row in place and saves the update', async () => {
    mockCrudItems([{ id: 1, created_at: '2026-01-01T00:00:00Z', Name: 'Alpha' }])

    render(<SupabaseCallPage />)
    await screen.findByText('Alpha')

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const editInput = screen.getByDisplayValue('Alpha')
    fireEvent.change(editInput, { target: { value: 'Alpha Updated' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Alpha Updated')).toBeDefined()
    expect(invoke).toHaveBeenCalledWith('crud-items?id=1', {
      method: 'PUT',
      body: { Name: 'Alpha Updated' },
    })
  })

  it('deletes a row', async () => {
    mockCrudItems([{ id: 1, created_at: '2026-01-01T00:00:00Z', Name: 'Alpha' }])

    render(<SupabaseCallPage />)
    await screen.findByText('Alpha')

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(invoke).toHaveBeenCalledWith('crud-items?id=1', { method: 'DELETE' }))
    expect(await screen.findByText('No records yet — add one above.')).toBeDefined()
  })

  it('surfaces the edge function error message on failure', async () => {
    invoke.mockResolvedValueOnce({
      data: null,
      error: new FunctionsHttpError(
        new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 }),
      ),
    })

    render(<SupabaseCallPage />)

    expect(await screen.findByText('Missing Authorization header')).toBeDefined()
  })

  it('disables action buttons while a mutation is in flight', async () => {
    mockCrudItems([{ id: 1, created_at: '2026-01-01T00:00:00Z', Name: 'Alpha' }])

    render(<SupabaseCallPage />)
    const row = (await screen.findByText('Alpha')).closest('tr')!

    fireEvent.click(within(row).getByRole('button', { name: 'Delete' }))

    // Buttons disable immediately (before the mocked invoke's microtask resolves)
    expect((within(row).getByRole('button', { name: 'Edit' }) as HTMLButtonElement).disabled).toBe(true)

    await waitFor(() => expect(screen.getByText('No records yet — add one above.')).toBeDefined())
  })
})
