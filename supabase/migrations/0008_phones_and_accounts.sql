alter table site_settings
  add column if not exists contact_phones jsonb not null default '[]'::jsonb;

alter table giving_settings
  add column if not exists accounts jsonb not null default '[]'::jsonb;