import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Creates a Supabase client scoped to the caller's JWT so RLS policies apply
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    switch (req.method) {
      case 'GET': {
        const query = supabase.from('items').select('*')
        if (id) query.eq('id', id)
        const { data, error } = await query
        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'POST': {
        const body = await req.json()
        const { data, error } = await supabase.from('items').insert(body).select()
        if (error) throw error
        return new Response(JSON.stringify(data), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'PUT': {
        if (!id) throw new Error('id query param is required')
        const body = await req.json()
        const { data, error } = await supabase.from('items').update(body).eq('id', id).select()
        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'DELETE': {
        if (!id) throw new Error('id query param is required')
        const { error } = await supabase.from('items').delete().eq('id', id)
        if (error) throw error
        return new Response(null, { status: 204, headers: corsHeaders })
      }

      default:
        return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
