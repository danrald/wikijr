# Pages API

CRUD operations for the `pages` and `page_versions` tables.

## Setup

```js
import { createClient } from '@supabase/supabase-js'
import { pagesService } from './pages.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const pages = pagesService(supabase)
```

---

## Pages

### `createPage({ slug, title, content?, tags?, parent_id? })`

Insert a new page.

```js
const page = await pages.createPage({
  slug: 'getting-started',
  title: 'Getting Started',
  content: '# Hello',
  tags: ['tutorial'],
})
```

---

### `getPageById(id)`

Fetch a page by UUID.

```js
const page = await pages.getPageById('abc-123')
```

---

### `getPageBySlug(slug)`

Fetch a page by slug — use this for URL routing.

```js
const page = await pages.getPageBySlug('getting-started')
```

---

### `listPages({ parent_id?, tags? })`

List pages. Returns top-level pages by default. Pass `parent_id` to get child pages. Optionally filter by tags (all provided tags must match).

```js
// Top-level pages
const topLevel = await pages.listPages()

// Children of a page
const children = await pages.listPages({ parent_id: 'abc-123' })

// Filter by tags
const tutorials = await pages.listPages({ tags: ['tutorial'] })
```

---

### `updatePage(id, { title?, content?, tags?, parent_id? })`

Update any fields on a page. The database trigger automatically snapshots the current content into `page_versions` before applying the update.

```js
await pages.updatePage('abc-123', { content: '# Updated Content' })
```

---

### `deletePage(id)`

Delete a page. All associated versions are deleted via cascade.

```js
await pages.deletePage('abc-123')
```

---

## Page Versions

### `listVersions(page_id)`

Returns all previous versions of a page, newest first. Versions are created automatically on every update.

```js
const versions = await pages.listVersions('abc-123')
```

---

### `restoreVersion(version_id)`

Copies a version's content back onto the live page. The current state is snapshotted before being overwritten.

```js
await pages.restoreVersion('version-uuid')
```

---

## Schema Notes

- `slug` — URL-friendly identifier (e.g. `getting-started`). Must be unique.
- `tags` — stored as a Postgres `text[]` array. Filter using array containment.
- `parent_id` — self-referential foreign key for nested/hierarchical pages.
- `page_versions` — append-only history table. Never written to directly; managed by a DB trigger on `pages`.


#Tests
node --env-file=.env pagesServiceTest.js