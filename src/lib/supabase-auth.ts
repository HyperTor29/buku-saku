import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

// Create a Supabase client that uses the Clerk session token
export async function createSupabaseClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: 'supabase' })
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )
}

// Create a Supabase client for server-side operations
export async function createSupabaseServerClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: 'supabase' })
  
  if (!token) {
    throw new Error('No Supabase token found')
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )
}