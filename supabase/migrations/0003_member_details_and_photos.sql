-- Members: remove email, add marital status, work, children, photo.
alter table members drop column if exists email;
alter table members add column if not exists marital_status text
  check (marital_status in ('married', 'not_married'));
alter table members add column if not exists occupation text;
alter table members add column if not exists children_count int
  check (children_count >= 0 and children_count <= 50);
alter table members add column if not exists photo_path text;

-- Phone is required for every new or edited member. NOT VALID means old
-- test rows are not checked, but any row you save from now on must have one.
alter table members drop constraint if exists members_phone_required;
alter table members add constraint members_phone_required
  check (phone is not null and length(trim(phone)) > 0) not valid;

-- Private storage bucket for member photos (2 MB max, images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('member-photos', 'member-photos', false, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins read member photos" on storage.objects;
drop policy if exists "admins upload member photos" on storage.objects;
drop policy if exists "admins update member photos" on storage.objects;
drop policy if exists "admins delete member photos" on storage.objects;

create policy "admins read member photos" on storage.objects for select to authenticated
  using (bucket_id = 'member-photos' and public.is_admin());
create policy "admins upload member photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'member-photos' and public.is_admin());
create policy "admins update member photos" on storage.objects for update to authenticated
  using (bucket_id = 'member-photos' and public.is_admin())
  with check (bucket_id = 'member-photos' and public.is_admin());
create policy "admins delete member photos" on storage.objects for delete to authenticated
  using (bucket_id = 'member-photos' and public.is_admin());