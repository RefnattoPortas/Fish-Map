'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Crown, Sparkles, ArrowRight, Fish, Trophy, Zap, Star } from 'lucide-react'
import Link from 'next/link'

// ====================================
// CONFETTI ENGINE (Canvas puro, sem deps)
// ====================================
function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const colors = ['#00d4aa', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#f97316']

    interface Particle {
      x: number
      y: number
      w: number
      h: number
      color: string
      vx: number
      vy: number
      rotation: number
      rotSpeed: number
      opacity: number
      shape: 'rect' | 'circle'
    }

    // Gerar confetti
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      })
    }

    let animFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let allDone = true
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05 // gravidade
        p.rotation += p.rotSpeed
        p.opacity -= 0.002

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          allDone = false
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      if (!allDone) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    // Delay de meio segundo antes de começar o confetti
    const timer = setTimeout(() => {
      animate()
    }, 500)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef])
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showContent, setShowContent] = useState(false)

  useConfetti(canvasRef)

  useEffect(() => {
    // Delay para animação de entrada
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center relative overflow-hidden">
      {/* Canvas do Confetti */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
      />

      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className={`relative z-20 text-center max-w-lg mx-auto px-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Crown Icon */}
        <div className="relative inline-block mb-10">
          <div className="w-32 h-32 rounded-[40%] bg-gradient-to-br from-accent via-emerald-400 to-accent flex items-center justify-center text-dark shadow-[0_0_80px_rgba(0,212,170,0.4)] animate-bounce" style={{ animationDuration: '2s' }}>
            <Crown size={64} strokeWidth={2.5} />
          </div>
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center border-4 border-[#0a0f1a] shadow-xl animate-spin" style={{ animationDuration: '3s' }}>
            <Sparkles size={20} className="text-dark" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center border-4 border-[#0a0f1a] shadow-xl">
            <Star size={16} className="text-white" fill="currentColor" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9] mb-6">
          Parabéns, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-300 to-accent">
            Lenda da Pesca!
          </span>
        </h1>

        <p className="text-lg text-gray-400 font-medium mb-12 max-w-md mx-auto leading-relaxed">
          Seu acesso <strong className="text-accent">Premium</strong> está 
          oficialmente <strong className="text-white">liberado</strong>. 
          Agora você domina as águas com inteligência de verdade. 🎣
        </p>

        {/* Benefits Cards */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {[
            { icon: Fish, label: 'Radar de Iscas', color: 'from-accent/20 to-emerald-500/10' },
            { icon: Trophy, label: 'Ranking Elite', color: 'from-amber-500/20 to-orange-500/10' },
            { icon: Zap, label: 'Alertas VIP', color: 'from-purple-500/20 to-indigo-500/10' },
            { icon: Star, label: 'Status Lenda', color: 'from-rose-500/20 to-pink-500/10' },
          ].map((item) => (
            <div key={item.label} className={`p-5 rounded-3xl bg-gradient-to-br ${item.color} border border-white/5 backdrop-blur-sm`}>
              <item.icon size={24} className="mx-auto mb-2 text-white" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-3 bg-accent hover:bg-accent/80 text-dark px-12 py-6 rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-accent/30 transition-all hover:scale-105 active:scale-95 border-b-4 border-dark/20 active:border-b-0"
        >
          Explorar o Mapa <ArrowRight size={18} />
        </Link>

        <p className="mt-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
          Sua assinatura já está ativa · Obrigado pela confiança
        </p>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
