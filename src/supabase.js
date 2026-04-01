import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://npcmckdudxqceaqvpdfo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wY21ja2R1ZHhxY2VhcXZwZGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MzA5MTcsImV4cCI6MjA5MDQwNjkxN30.gR1xg1rFPnR1gpf2o1fK5PsuETNaaDZbbs3BD6plXPk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
