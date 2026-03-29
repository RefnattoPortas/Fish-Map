'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Fish, Mail, Lock, Chrome, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister && !acceptedTerms) {
      setError('Você precisa aceitar os termos para continuar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = getSupabaseClient()
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })
        if (error) throw error
        setError('Verifique seu e-mail para confirmar o cadastro!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/radar')
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (isRegister && !acceptedTerms) {
      setError('Você precisa aceitar os termos para se cadastrar com Google.')
      return
    }
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
        <div className="text-center mb-2.5 flex flex-col items-center">
          <div className="w-56 h-56 flex items-center justify-center -mb-12">
            <img src="/images/logo.png" alt="Fishgada Logo" className="w-full h-full object-contain mix-blend-screen filter drop-shadow(0 0 20px rgba(0,255,255,0.2))" />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px] opacity-80 mt-0">
            A elite da pesca esportiva
          </p>
        </div>

        <div className="glass-elevated p-6 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsRegister(false)}
              className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${!isRegister ? 'text-cyan-400 border-cyan-400' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${isRegister ? 'text-cyan-400 border-cyan-400' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
            >
              Criar Conta
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            <div className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-cyan-400 transition-colors" size={16} />
                <input 
                  type="email" 
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-medium text-sm"
                  required
                />
              </div>
 
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-cyan-400 transition-colors" size={16} />
                <input 
                  type="password" 
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="flex items-start gap-3 px-1">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  required
                />
                <label htmlFor="terms" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                  Li e aceito os <Link href="/termos" className="text-cyan-400 hover:text-cyan-300 underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-cyan-400 hover:text-cyan-300 underline">Política de Privacidade</Link> do Fishgada.
                </label>
              </div>
            )}
 
            {error && <p className="text-cyan-400 text-xs font-bold text-center bg-cyan-400/10 py-2 rounded-lg">{error}</p>}
 
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-dark font-black uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 text-xs mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  {isRegister ? 'Criar minha Conta' : 'Entrar no Radar'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
 
          <div className="my-6 flex items-center gap-4 text-gray-700">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[9px] font-black uppercase tracking-widest">ou use sua conta</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
 
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-3 active:scale-95 transition-all text-xs"
          >
            <Chrome size={18} className="text-cyan-400" />
            Continuar com Google
          </button>

          {!isRegister && (
            <div className="mt-4 text-center">
               <Link href="/auth/reset" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors">
                  Esqueci minha senha
               </Link>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-cyan-500/50 hover:text-cyan-400 transition-colors">
              Voltar para o Início
           </Link>
        </div>
      </div>
    </div>
  )
}

