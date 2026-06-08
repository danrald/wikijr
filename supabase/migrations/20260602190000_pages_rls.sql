-- Enable RLS on both tables
alter table "public"."pages" enable row level security;
alter table "public"."page_versions" enable row level security;

-- pages: authenticated users can read, create, update, and delete any page
create policy "authenticated users can read pages"
  on "public"."pages" for select
  to authenticated
  using (true);

create policy "authenticated users can create pages"
  on "public"."pages" for insert
  to authenticated
  with check (true);

create policy "authenticated users can update pages"
  on "public"."pages" for update
  to authenticated
  using (true);

create policy "authenticated users can delete pages"
  on "public"."pages" for delete
  to authenticated
  using (true);

-- page_versions: authenticated users can only read versions
-- Inserts are handled exclusively by the snapshot trigger (SECURITY DEFINER below)
create policy "authenticated users can read page versions"
  on "public"."page_versions" for select
  to authenticated
  using (true);

-- Re-create the snapshot trigger function as SECURITY DEFINER so it can insert
-- into page_versions even though direct inserts are blocked by RLS
create or replace function snapshot_page_version()
returns trigger language plpgsql security definer as $$
begin
  insert into "public"."page_versions" (page_id, title, content, tags, edited_by)
  values (old.id, old.title, old.content, old.tags, auth.uid());
  return new;
end;
$$;
