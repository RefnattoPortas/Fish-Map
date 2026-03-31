'use client'

import { useState, useEffect } from 'react'
import { Crown, Sparkles, Fish, X, CheckCircle2, ChevronRight, Trophy, MapPin, Anchor, Flame, Medal } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface WelcomeOverlayProps {
  onClose: () => void
}

export default function WelcomeOverlay({ onClose }: WelcomeOverlayProps) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = async () => {
    setIsExiting(true)
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const untypedSupabase = supabase as any
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await untypedSupabase
          .from('profiles')
          .update({ is_first_login: false })
          .eq('id', user.id)
      }
      setTimeout(() => onClose(), 500)
    } catch (err) {
      console.error('Erro ao marcar primeiro login:', err)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const screens = [
    {
      title: "Sua Coleção Viva",
      text: "Capture peixes nos pesqueiros parceiros e complete sua Fishdex. São mais de 150 espécies para você colecionar como um mestre!",
      icon: <Anchor className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />,
      visual: (
        <div className="relative w-full h-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full" />
            <Fish className="absolute -left-4 top-0 w-12 h-12 text-cyan-500/20 rotate-12" />
            <Fish className="absolute right-0 bottom-4 w-16 h-16 text-cyan-500/10 -rotate-12" />
            <Fish className="absolute left-1/4 bottom-0 w-8 h-8 text-cyan-500/30 rotate-45" />
            <Anchor className="relative z-10 w-24 h-24 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-bounce" />
        </div>
      )
    },
    {
      title: "Suba no Ranking",
      text: "Cada captura confirmada te dá pontos. Dispute o topo do ranking do seu pesqueiro favorito e ganhe badges exclusivos.",
      icon: <Trophy className="w-20 h-20 text-orange-400" />,
      visual: (
        <div className="relative w-full h-40 flex flex-col items-center justify-center">
            <div className="flex items-end gap-3 mb-4">
                <div className="w-12 h-16 bg-white/5 border-x border-t border-white/10 rounded-t-lg relative">
                    <div className="absolute inset-0 bg-orange-500/5 blur-xl" />
                </div>
                <div className="w-16 h-24 bg-orange-500/20 border-x border-t border-orange-500/30 rounded-t-xl relative flex items-start justify-center pt-2">
                    <div className="absolute inset-0 bg-orange-500/10 blur-2xl" />
                    <Medal className="text-orange-400 animate-pulse" size={24} />
                </div>
                <div className="w-12 h-12 bg-white/5 border-x border-t border-white/10 rounded-t-lg relative" />
            </div>
            <div className="px-4 py-1 rounded-full bg-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Mestre dos Tambas</span>
            </div>
        </div>
      )
    },
    {
      title: "Encontre o Melhor Ponto",
      text: "Use nosso mapa para localizar pesqueiros, ver fotos das últimas capturas e conferir promoções exclusivas para usuários Fishgada.",
      icon: <MapPin className="w-20 h-20 text-cyan-400" />,
      visual: (
        <div className="relative w-full h-40 flex items-center justify-center">
            {/* Mesh Grid */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="grid grid-cols-6 grid-rows-4 w-full h-full border-cyan-500/20 gap-0 border-l border-t">
                    {Array.from({length: 24}).map((_, i) => (
                        <div key={i} className="border-r border-b border-cyan-500/10" />
                    ))}
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/40 blur-3xl rounded-full animate-pulse" />
                <MapPin className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] relative z-10" />
            </div>
        </div>
      )
    },
    {
      title: "Você é um Pioneiro!",
      text: "Aproveite 3 meses de acesso Pro totalmente grátis. Registre suas fotos, acompanhe suas métricas e domine os lagos!",
      icon: <Sparkles className="w-20 h-20 text-orange-400" />,
      visual: (
        <div className="relative w-full h-40 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-orange-500/5 blur-[100px] rounded-full" />
            <div className="relative group">
                <div className="absolute -inset-4 bg-orange-500/20 blur-xl rounded-full scale-110 animate-pulse" />
                <div className="relative bg-black/40 backdrop-blur-md px-8 py-6 rounded-3xl border border-orange-500/30 flex flex-col items-center gap-1 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                    <span className="text-4xl font-black text-orange-400 italic tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse">3 MESES</span>
                    <span className="text-2xl font-black text-white italic uppercase tracking-[0.2em] opacity-80">GRÁTIS</span>
                </div>
            </div>
        </div>
      )
    }
  ]

  return (
    <div className={`fixed inset-0 z-[5000] transition-all duration-500 ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Deep Navy Background with Animated Waves */}
      <div className="absolute inset-0 bg-[#0a0f1a] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 Q 25 45, 50 50 T 100 50 V 100 H 0 Z" fill="white" className="animate-[wave_8s_ease-in-out_infinite]" />
            <path d="M0 60 Q 25 55, 50 60 T 100 60 V 100 H 0 Z" fill="white" className="animate-[wave_12s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
            <path d="M0 70 Q 25 65, 50 70 T 100 70 V 100 H 0 Z" fill="white" className="animate-[wave_10s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
          </svg>
        </div>
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative min-h-full p-4 sm:p-6 md:p-12 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40">
        
        {/* Main Card */}
        <div className="relative w-full max-w-2xl p-8 sm:p-12 glass-elevated shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[40px] border border-white/10 text-center overflow-hidden animate-in zoom-in-95 duration-500">
          
          <div className="relative z-10 flex flex-col items-center gap-8 min-h-[480px]">
             
             {/* Dynamic Content Transition Container */}
             <div key={step} className="w-full flex-1 flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
                {screens[step].visual}

                <div className="mt-8 space-y-4">
                    <h2 className={`text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-tight ${step % 2 === 0 ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-orange-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}>
                    {screens[step].title}
                    </h2>
                    <p className="text-xl text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                    {screens[step].text}
                    </p>
                </div>
             </div>

             {/* Footer / Controls */}
             <div className="w-full space-y-6">
                
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2">
                    {screens.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 transition-all duration-500 rounded-full ${i === step ? 'w-8 bg-cyan-500' : 'w-2 bg-white/20'}`} 
                        />
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {step < totalSteps - 1 ? (
                        <>
                            <button 
                                onClick={handleNext}
                                className="flex-1 btn-primary py-6 text-lg font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(0,212,170,0.3)] bg-cyan-500 text-black"
                            >
                                Próximo
                            </button>
                            <button 
                                onClick={handleSkip}
                                className="sm:w-32 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
                            >
                                Pular
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleComplete}
                            disabled={loading}
                            className="w-full btn-primary py-6 text-xl font-black uppercase tracking-[0.4em] shadow-[0_0_60px_rgba(245,158,11,0.4)] bg-orange-500 hover:bg-orange-400 text-black border-none animate-pulse"
                        >
                            {loading ? 'Preparando Tudo...' : 'Começar Minha Jornada'}
                        </button>
                    )}
                </div>
             </div>

          </div>

          {/* Decorative Corner Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl transition-colors duration-1000 ${step % 2 === 0 ? 'bg-cyan-500/20' : 'bg-orange-500/20'}`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 blur-3xl transition-colors duration-1000 ${step % 2 === 0 ? 'bg-blue-500/20' : 'bg-red-500/20'}`} />

        </div>
      </div>

    </div>
  )
}
