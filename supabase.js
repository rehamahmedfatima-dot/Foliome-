import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'ضع_رابط_المشروع_هنا'
const supabaseKey = 'ضع_المفتاح_هنا'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
