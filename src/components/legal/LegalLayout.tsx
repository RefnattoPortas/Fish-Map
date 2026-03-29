'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface LegalLayoutProps {
  title: string
  children: React.ReactNode
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white selection:bg-cyan-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Voltar</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Fishgada" className="w-8 h-8 object-contain mix-blend-screen" />
            <span className="font-black tracking-tighter text-xl italic text-cyan-400">FISHGADA</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-12 uppercase tracking-tight italic">
            {title}
          </h1>
          
          <div className="space-y-8 text-white/70 leading-relaxed font-medium prose prose-invert prose-cyan max-w-none">
            {children}
          </div>
        </article>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
            © 2026 Fishgada — Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
             <Link href="/termos" className="text-white/40 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Termos</Link>
             <Link href="/privacidade" className="text-white/40 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Privacidade</Link>
             <Link href="/responsabilidade" className="text-white/40 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Responsabilidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
