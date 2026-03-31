'use client'

import { useState, useEffect } from 'react'
import { Plus, MoreVertical, Share, X, LayoutGrid, Chrome, Apple, Smartphone, Info } from 'lucide-react'

interface PwaInstallOverlayProps {
  onClose: () => void
}

export default function PwaInstallOverlay({ onClose }: PwaInstallOverlayProps) {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android')
  const [isStandalone, setIsStandalone] = useState(false)
  const [hasDismissed, setHasDismissed] = useState(false)

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios')
    } else {
      setPlatform('android')
    }

    // Detect standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
    setIsStandalone(isStandaloneMode)

    // Check if dismissed before
    const dismissed = localStorage.getItem('fishgada_pwa_prompt_dismissed')
    if (dismissed === 'true') {
      setHasDismissed(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('fishgada_pwa_prompt_dismissed', 'true')
    onClose()
  }

  // If already standalone or dismissed, we don't return anything (though the parent should handle rendering)
  // However, for safety, let's just render the content if called.

  return (
    <div className="fixed inset-0 z-[6000] bg-[#0a0f1a]/80 backdrop-blur-2xl animate-in fade-in duration-500 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl glass shadow-[0_0_80px_rgba(34,211,238,0.15)] rounded-[32px] border border-cyan-500/20 overflow-hidden flex flex-col">
        
        {/* Glow Background Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              🔥 Instale o Fishgada e Pesque sem Limites!
            </h2>
            <p className="text-gray-300 font-medium text-lg leading-tight">
              Tenha a Fishdex offline e o mapa em tela cheia no seu celular.
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="flex w-full bg-white/5 p-1 rounded-2xl border border-white/10 mb-8">
            <button 
              onClick={() => setPlatform('android')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black uppercase text-xs tracking-widest ${platform === 'android' ? 'bg-cyan-500 text-dark shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-white'}`}
            >
              <Chrome size={16} />
              No Android
            </button>
            <button 
              onClick={() => setPlatform('ios')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black uppercase text-xs tracking-widest ${platform === 'ios' ? 'bg-cyan-500 text-dark shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-white'}`}
            >
              <Apple size={16} />
              No iPhone
            </button>
          </div>

          {/* Instructions Content */}
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center mb-10 min-h-[160px]">
            <div className="space-y-6">
              {platform === 'android' ? (
                <>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 shrink-0">1</div>
                    <p className="text-gray-200 font-bold leading-tight">
                      Toque no ícone de três pontinhos <span className="inline-flex items-center justify-center w-6 h-6 bg-white/10 rounded-md align-middle"><MoreVertical size={14} className="text-cyan-400" /></span> no canto superior do Chrome.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 shrink-0">2</div>
                    <p className="text-gray-200 font-bold leading-tight">
                      Selecione <span className="text-cyan-400">"Instalar aplicativo"</span> ou <span className="text-cyan-400">"Adicionar à tela inicial"</span>.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 shrink-0">1</div>
                    <p className="text-gray-200 font-bold leading-tight">
                      Toque no ícone de compartilhar <span className="inline-flex items-center justify-center w-6 h-6 bg-white/10 rounded-md align-middle"><Share size={14} className="text-cyan-400" /></span> na barra inferior do Safari.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 shrink-0">2</div>
                    <p className="text-gray-200 font-bold leading-tight">
                      Role para baixo e toque em <span className="text-cyan-400">"Adicionar à Tela de Início"</span>.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* App Icon Preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 p-2 glass rounded-[24px] border border-cyan-500/30 relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full" />
                <img 
                  src="/images/iconapp.png" 
                  alt="Fishgada" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" 
                />
              </div>
              <p className="text-[10px] font-black uppercase text-cyan-500/60 tracking-widest">Favicon Neon</p>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleClose}
            className="w-full py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"
          >
            Bora Pescar!
          </button>
        </div>

        {/* Close Button Hint */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
            <X size={20} />
        </button>
      </div>
    </div>
  )
}
