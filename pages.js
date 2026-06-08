/**
 * Usage:
 *   import { createClient } from '@supabase/supabase-js'
 *   import { pagesService } from './pages.js'
 *
 *   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 *   const pages = pagesService(supabase)
 */

export function pagesService(supabase) {

  // ── Pages ────────────────────────────────────────────────────────────────

  async function createPage({ slug, title, content = null, tags = [], parent_id = null }) {
    const { data, error } = await supabase
      .from('pages')
      .insert({ slug, title, content, tags, parent_id })
      .select()
      .single()
    if (error) throw error
    return data
  }

  async function getPageById(id) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  async function getPageBySlug(slug) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  }

  // Returns top-level pages by default; pass parent_id to get children.
  // Optionally filter by tags (array containment — all tags must match).
  async function listPages({ parent_id = null, tags = [] } = {}) {
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
    return data
  }

  // Updating a page automatically snapshots the old content into page_versions
  // via the database trigger created in the migration.
  async function updatePage(id, { title, content, tags, parent_id } = {}) {
    const updates = {}
    if (title     !== undefined) updates.title     = title
    if (content   !== undefined) updates.content   = content
    if (tags      !== undefined) updates.tags      = tags
    if (parent_id !== undefined) updates.parent_id = parent_id

    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async function deletePage(id) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ── Page Versions ────────────────────────────────────────────────────────

  async function listVersions(page_id) {
    const { data, error } = await supabase
      .from('page_versions')
      .select('*')
      .eq('page_id', page_id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  // Restores a previous version's content back onto the live page.
  // This update itself will snapshot the current state before overwriting.
  async function restoreVersion(version_id) {
    const { data: version, error: vErr } = await supabase
      .from('page_versions')
      .select('*')
      .eq('id', version_id)
      .single()
    if (vErr) throw vErr

    return updatePage(version.page_id, {
      title:   version.title,
      content: version.content,
      tags:    version.tags,
    })
  }

  return {
    createPage,
    getPageById,
    getPageBySlug,
    listPages,
    updatePage,
    deletePage,
    listVersions,
    restoreVersion,
  }
}
