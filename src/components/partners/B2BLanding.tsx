'use client'

import { MapPin, Trophy, Bell, ArrowRight, X, Star, CheckCircle2 } from 'lucide-react'

interface B2BLandingProps {
  onClose: () => void
  onStart: () => void
}

export default function B2BLanding({ onClose, onStart }: B2BLandingProps) {
  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="glass-elevated fade-in-up w-full max-w-lg rounded-[40px] border border-white/10 overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full -mr-20 -mt-20 shrink-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full -ml-20 -mb-20 shrink-0" />

        <div className="relative p-8 md:p-12 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Programa de Parceiros</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                Seu Pesqueiro <br /><span className="text-accent">Destaque Elite</span>
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="text-gray-500" size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {[
              { 
                icon: MapPin, 
                title: 'Visibilidade Total', 
                desc: 'Pin exclusivo dourado no mapa com ícone de casinha e destaque nos filtros.',
                color: 'text-amber-500'
              },
              { 
                icon: Trophy, 
                title: 'Gestão de Eventos', 
                desc: 'Crie torneios oficiais com inscrições, regras e ranking em tempo real.',
                color: 'text-accent'
              },
              { 
                icon: Bell, 
                title: 'Alertas Inteligentes', 
                desc: 'Notifique pescadores da região quando houver reposição ou peixe ativo.',
                color: 'text-blue-400'
              }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className={`mt-1 p-2.5 rounded-2xl bg-white/5 border border-white/10 ${benefit.color}`}>
                  <benefit.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">{benefit.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button 
              onClick={onStart}
              className="w-full bg-accent hover:bg-accent-secondary text-dark font-black py-4 rounded-3xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(0,212,170,0.3)]"
            >
              Começar meu Cadastro Grátis <ArrowRight size={20} />
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-4 font-medium uppercase tracking-widest">
              Anúncio básico gratuito. Funções premium sob consulta.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-elevated {
          background: rgba(13, 20, 31, 0.85);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  )
}
