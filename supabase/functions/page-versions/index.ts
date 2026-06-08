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

    const url        = new URL(req.url)
    const page_id    = url.searchParams.get('page_id')
    const version_id = url.searchParams.get('version_id')

    switch (req.method) {
      case 'GET': {
        // GET ?page_id=xxx  → all versions for a page, newest first
        if (!page_id) return json({ error: 'page_id query param is required' }, 400)
        const { data, error } = await supabase
          .from('page_versions')
          .select('*')
          .eq('page_id', page_id)
          .order('created_at', { ascending: false })
        if (error) throw error
        return json(data)
      }

      case 'POST': {
        // POST ?version_id=xxx  → restore that version onto the live page
        // The pages snapshot trigger will capture the current state before overwriting
        if (!version_id) return json({ error: 'version_id query param is required' }, 400)

        const { data: version, error: vErr } = await supabase
          .from('page_versions')
          .select('*')
          .eq('id', version_id)
          .single()
        if (vErr) throw vErr

        const { data, error } = await supabase
          .from('pages')
          .update({
            title:   version.title,
            content: version.content,
            tags:    version.tags,
          })
          .eq('id', version.page_id)
          .select()
          .single()
        if (error) throw error
        return json(data)
      }

      default:
        return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }
  } catch (err) {
    return json({ error: (err as Error).message }, 400)
  }
})
