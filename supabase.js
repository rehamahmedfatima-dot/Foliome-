import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'sb_publishable_WWO97Lmy0MkItdWcceMDMw_AgRgJKpN'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb2hxenlheW51YWN6YmdlcHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5ODY2OTIsImV4cCI6MjA5OTU2MjY5Mn0.4rSs9voibdeFlf9lG6hrSY-tv_yAzugFWZ6Z0WMzFco'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
