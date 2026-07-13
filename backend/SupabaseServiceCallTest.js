import { createClient } from '@supabase/supabase-js'
//const supabase = createClient("https://gnedovuvtfxuukswfnpo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZWRvdnV2dGZ4dXVrc3dmbnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTk1MTQsImV4cCI6MjA3NDk5NTUxNH0.CUOaiXhcm0tQPaTckwFL8n7R66MirzafRuHxg3Ol3cI")
const supabase = createClient("https://gnedovuvtfxuukswfnpo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZWRvdnV2dGZ4dXVrc3dmbnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTk1MTQsImV4cCI6MjA3NDk5NTUxNH0.CUOaiXhcm0tQPaTckwFL8n7R66MirzafRuHxg3Ol3cI")
const { data, error } = await supabase.functions.invoke('GetTestsAgain', {
  body: { name: 'Functions' },
})
 
console.log(data)
