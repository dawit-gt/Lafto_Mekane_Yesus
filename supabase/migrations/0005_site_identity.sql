-- 0005: church name and Telegram link become editable in Admin -> Settings.
-- Safe to run more than once.

alter table site_settings
  add column if not exists church_name text,
  add column if not exists church_name_am text,
  add column if not exists telegram_group_url text;