/**
 * End-to-end tests for the pages and page-versions Edge Functions.
 *
 * Setup: add these two lines to your .env file before running:
 *   TEST_EMAIL=your-test-user@example.com
 *   TEST_PASSWORD=your-test-password
 *
 * Run: node --env-file=.env pagesServiceTest.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gnedovuvtfxuukswfnpo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZWRvdnV2dGZ4dXVrc3dmbnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTk1MTQsImV4cCI6MjA3NDk5NTUxNH0.CUOaiXhcm0tQPaTckwFL8n7R66MirzafRuHxg3Ol3cI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Helpers ──────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function pass(label) {
  console.log(`  ✓ ${label}`)
  passed++
}

function fail(label, err) {
  console.error(`  ✗ ${label}`)
  console.error(`    ${err?.message ?? err}`)
  failed++
}

async function callPages(method, params = {}, body = null) {
  const qs = new URLSearchParams(params).toString()
  return supabase.functions.invoke(`pages${qs ? '?' + qs : ''}`, {
    method,
    body: body ?? undefined,
  })
}

async function callPageVersions(method, params = {}, body = null) {
  const qs = new URLSearchParams(params).toString()
  return supabase.functions.invoke(`page-versions${qs ? '?' + qs : ''}`, {
    method,
    body: body ?? undefined,
  })
}

// ── Auth ─────────────────────────────────────────────────────────────────────

async function signIn() {
  const email    = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    console.error('Missing TEST_EMAIL or TEST_PASSWORD in environment.')
    console.error('Add them to your .env file and re-run.')
    process.exit(1)
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error(`Sign-in failed: ${error.message}`)
    process.exit(1)
  }

  console.log(`Signed in as ${email}\n`)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

let createdPageId = null

async function testCreatePage() {
  console.log('createPage')
  const { data, error } = await callPages('POST', {}, {
    slug:    'test-wiki-page',
    title:   'Test Wiki Page',
    content: '# Hello\nThis is a test.',
    tags:    ['test', 'wiki'],
  })
  if (error || !data?.id) return fail('creates a page and returns it', error ?? 'no id returned')
  createdPageId = data.id
  pass(`creates a page and returns id: ${createdPageId}`)
}

async function testGetPageById() {
  console.log('\ngetPageById')
  const { data, error } = await callPages('GET', { id: createdPageId })
  if (error || data?.id !== createdPageId) return fail('fetches page by id', error)
  pass('returns correct page')
}

async function testGetPageBySlug() {
  console.log('\ngetPageBySlug')
  const { data, error } = await callPages('GET', { slug: 'test-wiki-page' })
  if (error || data?.slug !== 'test-wiki-page') return fail('fetches page by slug', error)
  pass('returns correct page')
}

async function testListPages() {
  console.log('\nlistPages')
  const { data, error } = await callPages('GET')
  if (error || !Array.isArray(data)) return fail('returns array of pages', error)
  pass(`returns ${data.length} top-level page(s)`)

  const { data: tagged, error: tErr } = await callPages('GET', { tags: 'test' })
  if (tErr || !Array.isArray(tagged)) return fail('filters by tag', tErr)
  pass(`tag filter returns ${tagged.length} page(s)`)
}

async function testUpdatePage() {
  console.log('\nupdatePage')
  const { data, error } = await callPages('PATCH', { id: createdPageId }, {
    content: '# Updated\nThis content was updated.',
    tags:    ['test', 'wiki', 'updated'],
  })
  if (error || data?.content !== '# Updated\nThis content was updated.') {
    return fail('updates content and tags', error)
  }
  pass('content and tags updated')
}

async function testListVersions() {
  console.log('\nlistVersions')
  const { data, error } = await callPageVersions('GET', { page_id: createdPageId })
  if (error || !Array.isArray(data)) return fail('returns array of versions', error)
  pass(`returns ${data.length} version(s) (snapshot created by update trigger)`)
}

async function testRestoreVersion() {
  console.log('\nrestoreVersion')
  const { data: versions, error: vErr } = await callPageVersions('GET', { page_id: createdPageId })
  if (vErr || !versions?.length) return fail('no versions available to restore', vErr)

  const versionId = versions[0].id
  const { data, error } = await callPageVersions('POST', { version_id: versionId })
  if (error || !data?.id) return fail('restores version onto live page', error)
  pass(`restored version ${versionId}`)
}

async function testDeletePage() {
  console.log('\ndeletePage')
  const { error } = await callPages('DELETE', { id: createdPageId })
  if (error) return fail('deletes the page', error)
  pass('page deleted')

  // Confirm it's gone
  const { data } = await callPages('GET', { id: createdPageId })
  if (data?.id) return fail('page should no longer be fetchable', 'still returned data')
  pass('page no longer fetchable after deletion')
}

// ── Run ───────────────────────────────────────────────────────────────────────

await signIn()

await testCreatePage()
await testGetPageById()
await testGetPageBySlug()
await testListPages()
await testUpdatePage()
await testListVersions()
await testRestoreVersion()
await testDeletePage()

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
