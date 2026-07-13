-- Pages table for wiki/page content stored as markdown
create table "public"."pages" (
  "id"         uuid primary key default gen_random_uuid(),
  "slug"       text not null unique,
  "title"      text not null,
  "content"    text,
  "tags"       text[] not null default '{}',
  "author_id"  uuid references auth.users(id) on delete set null,
  "parent_id"  uuid references "public"."pages"(id) on delete set null,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

-- Keeps a full history of every edit made to a page
create table "public"."page_versions" (
  "id"         uuid primary key default gen_random_uuid(),
  "page_id"    uuid not null references "public"."pages"(id) on delete cascade,
  "title"      text not null,
  "content"    text,
  "tags"       text[] not null default '{}',
  "edited_by"  uuid references auth.users(id) on delete set null,
  "created_at" timestamptz not null default now()
);

-- Auto-update updated_at on pages whenever a row changes
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_updated_at
  before update on "public"."pages"
  for each row execute function update_updated_at();

-- Snapshot the old row into page_versions before any update
create or replace function snapshot_page_version()
returns trigger language plpgsql as $$
begin
  insert into "public"."page_versions" (page_id, title, content, tags, edited_by)
  values (old.id, old.title, old.content, old.tags, auth.uid());
  return new;
end;
$$;

create trigger pages_version_snapshot
  before update on "public"."pages"
  for each row execute function snapshot_page_version();

-- Indexes
create index on "public"."pages" (parent_id);
create index on "public"."page_versions" (page_id);
create index on "public"."pages" using gin (tags);
