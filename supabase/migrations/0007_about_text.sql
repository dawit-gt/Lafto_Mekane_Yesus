-- 0007: the About page texts become editable in Admin -> Settings.
-- Safe to run more than once.

alter table site_settings
  add column if not exists about_intro text,
  add column if not exists about_mission text,
  add column if not exists about_denomination text,
  add column if not exists about_intro_am text,
  add column if not exists about_mission_am text,
  add column if not exists about_denomination_am text;