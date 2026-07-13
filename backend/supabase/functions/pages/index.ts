import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, 401)
    }

    // Client scoped to caller's JWT so RLS policies apply
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const url = new URL(req.url)
    const id    = url.searchParams.get('id')
    const slug  = url.searchParams.get('slug')

    switch (req.method) {
      case 'GET': {
        // GET ?id=xxx  → single page by id
        if (id) {
          const { data, error } = await supabase
            .from('pages').select('*').eq('id', id).single()
          if (error) throw error
          return json(data)
        }

        // GET ?slug=xxx  → single page by slug
        if (slug) {
          const { data, error } = await supabase
            .from('pages').select('*').eq('slug', slug).single()
          if (error) throw error
          return json(data)
        }

        // GET ?parent_id=xxx&tags=a,b  → list pages
        const parent_id = url.searchParams.get('parent_id')
        const tagsParam = url.searchParams.get('tags')
        const tags      = tagsParam ? tagsParam.split(',').map(t => t.trim()) : []

        let query = supabase.from('pages').select('*')
        if (parent_id) {
          query = query.eq('parent_id', parent_id)
        } else {
          query = query.is('parent_id', null)
        }
        if (tags.length > 0) {
          query = query.contains('tags', tags)
        }

        const { data, error } = await query.order('title')
        if (error) throw error
        return json(data)
      }

      case 'POST': {
        // POST body: { slug, title, content?, tags?, parent_id? }
        const body = await req.json()
        const { data, error } = await supabase
          .from('pages')
          .insert({
            slug:      body.slug,
            title:     body.title,
            content:   body.content   ?? null,
            tags:      body.tags      ?? [],
            parent_id: body.parent_id ?? null,
          })
          .select()
          .single()
        if (error) throw error
        return json(data, 201)
      }

      case 'PATCH': {
        // PATCH ?id=xxx  body: { title?, content?, tags?, parent_id? }
        if (!id) return json({ error: 'id query param is required' }, 400)
        const body = await req.json()

        const updates: Record<string, unknown> = {}
        if (body.title     !== undefined) updates.title     = body.title
        if (body.content   !== undefined) updates.content   = body.content
        if (body.tags      !== undefined) updates.tags      = body.tags
        if (body.parent_id !== undefined) updates.parent_id = body.parent_id

        const { data, error } = await supabase
          .from('pages').update(updates).eq('id', id).select().single()
        if (error) throw error
        return json(data)
      }

      case 'DELETE': {
        // DELETE ?id=xxx
        if (!id) return json({ error: 'id query param is required' }, 400)
        const { error } = await supabase.from('pages').delete().eq('id', id)
        if (error) throw error
        return new Response(null, { status: 204, headers: corsHeaders })
      }

      default:
        return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }
  } catch (err) {
    return json({ error: (err as Error).message }, 400)
  }
})
