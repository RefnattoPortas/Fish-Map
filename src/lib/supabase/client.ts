import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  // Proteção: Limpa tokens de auth corrompidos do localStorage que causam crash interno no Supabase-js
  if (typeof window !== 'undefined') {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes('-auth-token')) {
          const val = localStorage.getItem(key)
          // Se o valor estiver escapado ou for string de JSON double-stringified, causa crash na library
          if (val && (val.startsWith('"{') || val.startsWith('"{\\"'))) {
            keysToRemove.push(key)
          }
        }
      }
      keysToRemove.forEach(k => {
        console.warn('[Supabase Cleanup] Removendo token corrompido:', k)
        localStorage.removeItem(k)
      })
    } catch (e) {}
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton para uso em client components
let _client: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!_client) {
    _client = createClient()
  }
  return _client
}
