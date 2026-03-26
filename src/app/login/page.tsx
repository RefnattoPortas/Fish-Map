'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Fish, Mail, Lock, Chrome, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Google.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0f1a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-56 h-56 mb-[-1rem]">
            <img src="/images/logo.png" alt="Fishgada Logo" className="w-full h-full object-contain mix-blend-screen filter drop-shadow(0 0 20px rgba(0,255,255,0.2))" />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            A elite da pesca esportiva
          </p>
        </div>

        <div className="glass-elevated p-8 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-dark font-black uppercase tracking-[0.3em] rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Entrar no Radar
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-gray-700">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-widest">ou entre com</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Chrome size={20} className="text-cyan-400" />
            Entrar com Google
          </button>

          <div className="mt-8 text-center space-y-4">
             <Link href="/auth/reset" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors">
                Esqueci minha senha
             </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-loose">
          Ao entrar, você concorda com nossos <br />
          <span className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors">Termos de Uso</span> e <span className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors">Privacidade</span>.
        </p>

        <div className="mt-6 text-center">
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-cyan-500/50 hover:text-cyan-400 transition-colors">
              Voltar para o mapa como visitante
           </Link>
        </div>
      </div>
    </div>
  )
}
