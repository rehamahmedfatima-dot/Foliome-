const SUPABASE_URL = "sb_publishable_WWO97Lmy0MkItdWcceMDMw_AgRgJKpN";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb2hxenlheW51YWN6YmdlcHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5ODY2OTIsImV4cCI6MjA5OTU2MjY5Mn0.4rSs9voibdeFlf9lG6hrSY-tv_yAzugFWZ6Z0WMzFco";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const PORTFOLIO_DOC_ID = "main";
