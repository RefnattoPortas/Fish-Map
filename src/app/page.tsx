'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import LandingPage from '@/components/landing/LandingPage'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/radar')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a0f1a] flex flex-col items-center justify-center text-white">
        <div className="w-32 h-32 mb-4 animate-pulse mix-blend-screen">
          <img src="/images/logo.png" alt="Fishgada" className="w-full h-full object-contain" />
        </div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress" style={{ width: '100%' }} />
        </div>
      </div>
    )
  }

  return <LandingPage onEnterApp={() => router.push('/radar')} />
}
