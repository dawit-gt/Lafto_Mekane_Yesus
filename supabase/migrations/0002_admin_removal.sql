-- Removing an admin must not be blocked by their past activity.
alter table audit_logs drop constraint if exists audit_logs_actor_id_fkey;
alter table audit_logs add constraint audit_logs_actor_id_fkey
  foreign key (actor_id) references admin_users (id) on delete set null;

alter table pages drop constraint if exists pages_updated_by_fkey;
alter table pages add constraint pages_updated_by_fkey
  foreign key (updated_by) references admin_users (id) on delete set null;

alter table media drop constraint if exists media_uploaded_by_fkey;
alter table media add constraint media_uploaded_by_fkey
  foreign key (uploaded_by) references admin_users (id) on delete set null;

-- Check: every row below should show confdeltype = 'n' (set null).
select conrelid::regclass as table_name, conname, confdeltype
from pg_constraint
where contype = 'f' and confrelid = 'admin_users'::regclass;