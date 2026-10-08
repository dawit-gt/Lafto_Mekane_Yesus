-- Lafto Mekaneyesus (EECMY) — Initial schema
create extension if not exists "pgcrypto";

create table if not exists admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean language sql security definer set search_path = public stable
as $$ select exists (select 1 from admin_users where id = auth.uid()); $$;

create type content_status as enum ('draft', 'published', 'archived');

create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null, body_md text not null default '',
  status content_status not null default 'draft', updated_by uuid references admin_users (id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table locations (
  id uuid primary key default gen_random_uuid(), name text not null,
  address_line1 text not null, address_line2 text, city text not null, region text,
  postal_code text, country text not null default 'Ethiopia',
  latitude numeric(9, 6), longitude numeric(9, 6), directions_note text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table leaders (
  id uuid primary key default gen_random_uuid(), full_name text not null, title text not null,
  bio_md text, photo_url text, display_order int not null default 0,
  status content_status not null default 'published',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table ministries (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  summary text not null, description_md text, meeting_info text, contact_name text,
  contact_email text, contact_phone text, image_url text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table sermon_series (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  description text, created_at timestamptz not null default now()
);

create table sermons (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  description text, speaker text not null, scripture text,
  series_id uuid references sermon_series (id) on delete set null, sermon_date date not null,
  thumbnail_url text, video_url text, audio_url text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  description text, image_url text, start_at timestamptz not null, end_at timestamptz,
  timezone text not null default 'Africa/Addis_Ababa',
  location_id uuid references locations (id) on delete set null,
  ministry_id uuid references ministries (id) on delete set null, registration_url text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table event_sermons (
  event_id uuid not null references events (id) on delete cascade,
  sermon_id uuid not null references sermons (id) on delete cascade,
  primary key (event_id, sermon_id)
);

create table stories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  category text check (category in ('testimony', 'ministry', 'community')),
  body_md text not null, image_url text, featured boolean not null default false,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(), title text not null, body_md text not null,
  publish_at timestamptz not null default now(), expires_at timestamptz,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(), question text not null, answer_md text not null,
  page_context text not null default 'general', display_order int not null default 0,
  status content_status not null default 'published', created_at timestamptz not null default now()
);

create table media (
  id uuid primary key default gen_random_uuid(), title text not null,
  kind text not null check (kind in ('image', 'document', 'video_embed')), url text not null,
  alt_text text, file_size_bytes bigint, uploaded_by uuid references admin_users (id),
  created_at timestamptz not null default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null, full_name text not null,
  email text, phone text, membership_status text not null default 'active'
    check (membership_status in ('active', 'inactive')),
  ministry_ids uuid[] not null default '{}', directory_visible boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  phone text, subject text, message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz not null default now()
);

create table prayer_requests (
  id uuid primary key default gen_random_uuid(), name text, email text,
  is_confidential boolean not null default true, request_text text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz not null default now()
);

create table volunteer_requests (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  phone text, ministry_interest text, availability_note text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz not null default now()
);

create table giving_settings (
  id int primary key default 1 check (id = 1),
  is_online_giving_enabled boolean not null default false,
  provider_name text, provider_url text,
  informational_note text not null default
    'Giving is currently informational only. Please see in-person or bank transfer options below.',
  updated_at timestamptz not null default now()
);
insert into giving_settings (id) values (1) on conflict (id) do nothing;

create table site_settings (
  id int primary key default 1 check (id = 1),
  service_times_md text not null default '', default_locale text not null default 'en',
  supported_locales text[] not null default '{en,am}',
  seo_default_title text, seo_default_description text,
  updated_at timestamptz not null default now()
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

create table audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references admin_users (id),
  action text not null, table_name text not null, record_id uuid, details jsonb,
  created_at timestamptz not null default now()
);

create index idx_events_start_at on events (start_at);
create index idx_events_status on events (status);
create index idx_sermons_date on sermons (sermon_date desc);
create index idx_sermons_status on sermons (status);
create index idx_announcements_publish on announcements (publish_at desc);
create index idx_stories_status on stories (status);
create index idx_ministries_status on ministries (status);
create index idx_contact_messages_status on contact_messages (status);
create index idx_prayer_requests_status on prayer_requests (status);
create index idx_volunteer_requests_status on volunteer_requests (status);
create index idx_audit_logs_table_record on audit_logs (table_name, record_id);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare t text;
begin
  for t in select unnest(array[
    'pages','locations','leaders','ministries','sermons','events',
    'stories','announcements','members','giving_settings','site_settings'
  ])
  loop
    execute format(
      'create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at();', t
    );
  end loop;
end $$;

alter table admin_users enable row level security;
alter table pages enable row level security;
alter table locations enable row level security;
alter table leaders enable row level security;
alter table ministries enable row level security;
alter table sermon_series enable row level security;
alter table sermons enable row level security;
alter table events enable row level security;
alter table event_sermons enable row level security;
alter table stories enable row level security;
alter table announcements enable row level security;
alter table faqs enable row level security;
alter table media enable row level security;
alter table members enable row level security;
alter table contact_messages enable row level security;
alter table prayer_requests enable row level security;
alter table volunteer_requests enable row level security;
alter table giving_settings enable row level security;
alter table site_settings enable row level security;
alter table audit_logs enable row level security;

create policy "admins can read admin_users" on admin_users for select using (is_admin());
create policy "admins can manage admin_users" on admin_users for all using (is_admin()) with check (is_admin());

create policy "public reads published pages" on pages for select using (status = 'published' or is_admin());
create policy "admins manage pages" on pages for insert with check (is_admin());
create policy "admins update pages" on pages for update using (is_admin()) with check (is_admin());
create policy "admins delete pages" on pages for delete using (is_admin());

create policy "public reads locations" on locations for select using (true);
create policy "admins manage locations" on locations for all using (is_admin()) with check (is_admin());

create policy "public reads published leaders" on leaders for select using (status = 'published' or is_admin());
create policy "admins manage leaders" on leaders for all using (is_admin()) with check (is_admin());

create policy "public reads published ministries" on ministries for select using (status = 'published' or is_admin());
create policy "admins manage ministries" on ministries for all using (is_admin()) with check (is_admin());

create policy "public reads sermon_series" on sermon_series for select using (true);
create policy "admins manage sermon_series" on sermon_series for all using (is_admin()) with check (is_admin());

create policy "public reads published sermons" on sermons for select using (status = 'published' or is_admin());
create policy "admins manage sermons" on sermons for all using (is_admin()) with check (is_admin());

create policy "public reads published events" on events for select using (status = 'published' or is_admin());
create policy "admins manage events" on events for all using (is_admin()) with check (is_admin());

create policy "public reads event_sermons" on event_sermons for select using (true);
create policy "admins manage event_sermons" on event_sermons for all using (is_admin()) with check (is_admin());

create policy "public reads published stories" on stories for select using (status = 'published' or is_admin());
create policy "admins manage stories" on stories for all using (is_admin()) with check (is_admin());

create policy "public reads live announcements" on announcements for select
  using (status = 'published' and publish_at <= now() and (expires_at is null or expires_at > now()) or is_admin());
create policy "admins manage announcements" on announcements for all using (is_admin()) with check (is_admin());

create policy "public reads published faqs" on faqs for select using (status = 'published' or is_admin());
create policy "admins manage faqs" on faqs for all using (is_admin()) with check (is_admin());

create policy "public reads media" on media for select using (true);
create policy "admins manage media" on media for all using (is_admin()) with check (is_admin());

create policy "members read own record" on members for select
  using (auth_user_id = auth.uid() or is_admin());
create policy "admins manage members" on members for all using (is_admin()) with check (is_admin());

create policy "anyone can submit a contact message" on contact_messages for insert with check (true);
create policy "admins read contact messages" on contact_messages for select using (is_admin());
create policy "admins manage contact messages" on contact_messages for update using (is_admin()) with check (is_admin());
create policy "admins delete contact messages" on contact_messages for delete using (is_admin());

create policy "anyone can submit a prayer request" on prayer_requests for insert with check (true);
create policy "admins read prayer requests" on prayer_requests for select using (is_admin());
create policy "admins manage prayer requests" on prayer_requests for update using (is_admin()) with check (is_admin());
create policy "admins delete prayer requests" on prayer_requests for delete using (is_admin());

create policy "anyone can submit volunteer interest" on volunteer_requests for insert with check (true);
create policy "admins read volunteer requests" on volunteer_requests for select using (is_admin());
create policy "admins manage volunteer requests" on volunteer_requests for update using (is_admin()) with check (is_admin());
create policy "admins delete volunteer requests" on volunteer_requests for delete using (is_admin());

create policy "public reads giving settings" on giving_settings for select using (true);
create policy "admins manage giving settings" on giving_settings for update using (is_admin()) with check (is_admin());

create policy "public reads site settings" on site_settings for select using (true);
create policy "admins manage site settings" on site_settings for update using (is_admin()) with check (is_admin());

create policy "admins read audit logs" on audit_logs for select using (is_admin());
create policy "admins write audit logs" on audit_logs for insert with check (is_admin());
