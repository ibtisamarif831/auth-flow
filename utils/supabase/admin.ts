import { Database } from '@/supabase/types/supabase'
import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}