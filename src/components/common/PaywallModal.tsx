'use client'

import { X, Crown, Zap, Map, FileBarChart, Download, Sparkles, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  featureName?: string
}

export default function PaywallModal({ isOpen, onClose, featureName }: PaywallModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg glass-elevated border-2 border-accent/30 rounded-[50px] shadow-[0_0_100px_rgba(0,212,170,0.2)] overflow-hidden">
        
        {/* Decorative Gold Pulse */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-12 text-center space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
               <div className="w-24 h-24 rounded-[40%] bg-accent flex items-center justify-center text-dark shadow-2xl shadow-accent/40 animate-pulse">
                  <Crown size={48} />
               </div>
               <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-[#0a0f1a]">
                  <Sparkles size={14} className="text-white" />
               </div>
            </div>
            
            <div className="space-y-2">
               <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                  Torne-se uma <span className="text-accent">Lenda</span>
               </h2>
               <p className="text-gray-400 font-medium">
                  {featureName ? `Acesse o ${featureName} e outros benefícios exclusivos.` : 'Domine as águas com o WikiFish PRO.'}
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left">
             {[
                { title: 'Heatmap de Atividade', desc: 'Veja onde as feras estão batendo agora.', icon: Zap },
                { title: 'Offline Pro Mode', desc: 'Acesse o mapa e registre capturas sem sinal.', icon: Download },
                { title: 'Relatórios Geográficos', desc: 'Métricas avançadas das melhores iscas p/ local.', icon: FileBarChart },
                { title: 'Vaga Prioritária', desc: '15min de vantagem em novos torneios.', icon: Map },
             ].map((feat) => (
                <div key={feat.title} className="flex gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-accent/20 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                      <feat.icon size={20} />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{feat.title}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{feat.desc}</p>
                   </div>
                   <CheckCircle2 size={16} className="ml-auto text-accent opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                </div>
             ))}
          </div>

          <div className="pt-6 space-y-4">
             <button className="w-full btn-primary py-6 text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all">
                Assinar Agora — R$ 19,90/mês
             </button>
             <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Cancele quando quiser · Site 100% Seguro</p>
          </div>
        </div>
      </div>
    </div>
  )
}
