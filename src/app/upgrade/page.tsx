'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UpgradeRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/settings?tab=Minha Assinatura')
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0f1a]">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  )
}
