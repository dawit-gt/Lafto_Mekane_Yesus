-- 0006: the home page banner (picture and text) becomes editable in Admin -> Settings.
-- Safe to run more than once.

alter table site_settings
  add column if not exists hero_image_url text,
  add column if not exists hero_title text,
  add column if not exists hero_text text,
  add column if not exists hero_title_am text,
  add column if not exists hero_text_am text;