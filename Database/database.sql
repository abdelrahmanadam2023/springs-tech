-- =====================================================
-- Springs Tech website database (Supabase / PostgreSQL)
-- Run this whole file once: Supabase > SQL Editor > New query > Run
-- Safe to run again: it will not duplicate data.
-- =====================================================

create table if not exists public.projects (
  id            bigint generated always as identity primary key,
  slug          text unique not null,
  title         text not null,
  project_type  text,                 -- e.g. ZOHO SOLUTION
  location      text,                 -- e.g. Riyadh, Saudi Arabia
  year          int,
  home_category text,                 -- e.g. Zoho • Riyadh (Home page card)
  description   text,                 -- Home page card text
  image_url     text,                 -- e.g. Images/projects/calma.jpg or a full https:// link
  show_on_home  boolean not null default true,
  is_highlighted boolean not null default false,
  is_published  boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.case_studies (
  id          bigint generated always as identity primary key,
  slug        text unique not null,
  client      text not null,          -- CALMA
  platform    text,                   -- ZOHO ONE / ODOO ERP
  tag         text,                   -- ZOHO IMPLEMENTATION
  title       text not null,
  description text,
  location    text,
  year        int,
  image_url   text,
  features    text[] not null default '{}',
  results     jsonb  not null default '[]',   -- [{"value":"25%","label":"..."}]
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id           bigint generated always as identity primary key,
  slug         text unique not null,
  category     text,
  title        text not null,
  excerpt      text,
  content      text,
  tag_label    text,                  -- big word on the image (ERP, CYBER...)
  footer_label text,                  -- small label at the bottom of the card
  author       text default 'Springs Tech',
  image_url    text,
  is_featured  boolean not null default false,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  published_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  company    text,
  email      text not null,
  phone      text,
  topic      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ---------- Security (Row Level Security) ----------
alter table public.projects         enable row level security;
alter table public.case_studies     enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "public read projects"     on public.projects;
drop policy if exists "public read case studies" on public.case_studies;
drop policy if exists "public read blog"         on public.blog_posts;
drop policy if exists "public send message"      on public.contact_messages;

-- Visitors can only READ published rows
create policy "public read projects"     on public.projects     for select to anon using (is_published);
create policy "public read case studies" on public.case_studies for select to anon using (is_published);
create policy "public read blog"         on public.blog_posts   for select to anon using (is_published);

-- Visitors can only SEND a message (never read messages)
create policy "public send message" on public.contact_messages for insert to anon
  with check (
    length(trim(name))    between 1 and 120 and
    length(trim(email))   between 5 and 200 and
    length(trim(message)) between 1 and 5000
  );

grant usage on schema public to anon;
grant select on public.projects, public.case_studies, public.blog_posts to anon;
grant insert on public.contact_messages to anon;

-- Public storage bucket for uploading your own images from the dashboard
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

-- ---------- Data (copied from the current website) ----------

insert into public.projects (slug, title, project_type, location, year, home_category, description, image_url, show_on_home, is_highlighted, sort_order) values
('andorra-village','Andorra Village','ZOHO SOLUTION','Riyadh, Saudi Arabia',2025,'Zoho • Riyadh','Zoho solution implementation for Andorra Village in Riyadh, Saudi Arabia.','Images/projects/andorra-village.jpg',true,false,1),
('calma','Calma','ZOHO SOLUTION','Riyadh, Saudi Arabia',2025,'Zoho • Riyadh','Zoho solution implementation for Calma in Riyadh, Saudi Arabia.','Images/projects/calma.jpg',true,true,2),
('aurelina','Aurelina','ODOO SOLUTION','New Cairo, Egypt',2025,'Odoo • New Cairo','Odoo solution implementation for Aurelina in New Cairo, Egypt.','Images/projects/aurelina.jpg',true,false,3),
('nobtha','Nobtha Media Production','ZOHO SOLUTION','Riyadh, Saudi Arabia',2025,'Zoho • Riyadh','Zoho solution implementation for Nobtha Media Production in Riyadh.','Images/projects/nobtha.jpg',true,false,4),
('oyo','OYO Hospitality','ODOO SOLUTION','Riyadh, Saudi Arabia',2025,'Odoo • Riyadh','Odoo solution implementation for OYO Hospitality in Riyadh.','Images/projects/oyo.jpg',true,false,5),
('amer-group','Amer Group','MALLZ POS GATEWAY','Multiple Locations, Egypt',2024,'MallZ POS Gateway • Egypt','MallZ POS Gateway solution implemented across multiple locations in Egypt.','Images/projects/amer-group.jpg',true,false,6),
('sonesta-luxor','Sonesta Luxor','MICROSOFT SOLUTION','Luxor, Egypt',2025,'Microsoft • Luxor','Microsoft solution implementation for Sonesta Luxor in Egypt.','Images/projects/sonesta-luxor.jpg',true,false,7),
('burak-restaurant','Burak Restaurant','GUEST SERVICE SOLUTION','Cairo, Egypt',2024,'Guest Service • Cairo','Guest Service Solution implemented for Burak Restaurant in Cairo.','Images/projects/burak-restaurant.jpg',true,false,8),
('kun-coworking','Kun Co-working Spaces','NETWORK INFRASTRUCTURE','Riyadh, Saudi Arabia',2025,'Network Infrastructure • Riyadh','Network infrastructure solution delivered for Kun Co-working Spaces in Riyadh.','Images/projects/kun-coworking.jpg',true,false,9)
on conflict (slug) do nothing;

insert into public.case_studies (slug, client, platform, tag, title, description, location, year, image_url, features, results, is_featured, sort_order) values
('calma','CALMA','ZOHO ONE','ZOHO IMPLEMENTATION','Calma Built a Unified Customer Engagement Platform on Zoho One','Springs Tech implemented Zoho One for Calma, connecting CRM, SalesIQ, Social, and Desk into one unified customer engagement platform.','Riyadh, Saudi Arabia',2025,'Images/case-studies/calma.jpg','{}'::text[],'[{"value": "25%", "label": "Improvement in lead conversion"}, {"value": "Minutes", "label": "Faster response to inquiries"}]'::jsonb,true,1),
('aurelina','AURELINA','ODOO ERP','ERP TRANSFORMATION','Full Odoo ERP Implementation at Aurelina','Aurelina partnered with Springs Tech to build a fully integrated Odoo ecosystem covering CRM, Accounting, Procurement, Projects, Real Estate, HR, and more.','New Cairo, Egypt',2025,'Images/case-studies/aurelina.jpg',array['CRM','Accounting','Projects','Real Estate','HR','WhatsApp Integration']::text[],'[]'::jsonb,false,2),
('nobtha','NOBTHA','ZOHO ONE','BUSINESS AUTOMATION','Zoho One Implementation at Nobtha','Springs Tech helped Nobtha Media Production replace fragmented tools and manual processes with an integrated digital environment.','Riyadh, Saudi Arabia',2025,'Images/case-studies/nobtha.jpg',array['Zoho Books','Zoho CRM','Zoho People','Zoho Projects','Zoho Workplace']::text[],'[]'::jsonb,false,3),
('oyo','OYO','ODOO ERP','HOSPITALITY','Odoo Implementation at OYO Hospitality','Springs Tech implemented Odoo Accounting, Procurement, and Approvals to strengthen financial control and operational governance across OYO''s regional operations.','Riyadh, Saudi Arabia',2025,'Images/case-studies/oyo.jpg',array['Accounting','Procurement','Approvals','Multi-location Operations']::text[],'[]'::jsonb,false,4)
on conflict (slug) do nothing;

insert into public.blog_posts (slug, category, title, excerpt, tag_label, footer_label, author, image_url, is_featured, sort_order) values
('featured','DIGITAL TRANSFORMATION','Technology Solutions That Transform Modern Businesses','Discover how integrated technology, automation, and digital transformation can help organizations improve efficiency, strengthen operations, and scale with confidence.','TECHNOLOGY INSIGHTS','Technology & Business','Springs Tech','Images/blog/featured.jpg',true,0),
('erp','ERP & BUSINESS','How ERP Solutions Help Businesses Streamline Their Operations','Learn how integrated ERP systems can connect departments, automate processes, and improve business visibility.','ERP','ERP Solutions','Springs Tech','Images/blog/erp.jpg',false,1),
('cybersecurity','CYBERSECURITY','Protecting Your Business in a Connected World','Understand the importance of threat detection, network security, access control, and data protection.','CYBER','Cybersecurity','Springs Tech','Images/blog/cybersecurity.jpg',false,2),
('odoo','ODOO','Building Smarter Business Processes With Odoo','Explore how Odoo can bring CRM, sales, accounting, inventory, HR, and other business functions together.','ODOO','Odoo ERP','Springs Tech','Images/blog/odoo.jpg',false,3),
('zoho','ZOHO','Connecting Business Teams With Zoho','See how Zoho''s connected applications can help organizations manage customers, finance, projects, and operations.','ZOHO','Zoho Solutions','Springs Tech','Images/blog/zoho.jpg',false,4),
('network','NETWORK INFRASTRUCTURE','Building Reliable Network Infrastructure','From network design and switching to wireless connectivity and security, infrastructure is the foundation of connected businesses.','NETWORK','Infrastructure','Springs Tech','Images/blog/network.jpg',false,5),
('myit','IT SUPPORT','Keeping Your Business Running With Reliable IT Support','Learn how proactive IT support can reduce downtime and help employees stay focused on their work.','MYIT','myIT','Springs Tech','Images/blog/myit.jpg',false,6)
on conflict (slug) do nothing;
