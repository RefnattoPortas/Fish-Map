'use client'

import { Calendar, MapPin, Users, Trophy, QrCode, CheckCircle2, Ticket, ArrowRight, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

interface TournamentTicketProps {
  tournament: any
  isParticipating: boolean
  onCheckIn: (id: string) => void
  onViewOnMap: (lat: number, lng: number, id: string) => void
}

export default function TournamentTicket({ 
  tournament, 
  isParticipating, 
  onCheckIn,
  onViewOnMap
}: TournamentTicketProps) {
  const [showQR, setShowQR] = useState(false)
  const eventDate = new Date(tournament.start_at)
  const isToday = new Date().toDateString() === eventDate.toDateString()
  const remainingSpots = (tournament.max_participants || 100) - (tournament.current_participants || 0)
  const isFull = remainingSpots <= 0 && tournament.max_participants > 0
  
  const spot = (tournament as any).fishing_resorts?.spots?.[0]
  const spotId = spot?.id

  return (
    <div className={`relative group perspective w-full ${isToday ? 'animate-neon-pulse' : ''}`}>
      <div className="flex flex-col md:flex-row glass-elevated border-none overflow-hidden rounded-[32px] transition-all duration-500 hover:translate-y-[-4px]">
        
        {/* LADO ESQUERDO: INFOS DO EVENTO */}
        <div className="flex-1 p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Trophy size={150} className="-rotate-12" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
              tournament.status === 'open' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {tournament.status === 'open' ? 'Inscrições Abertas' : 'Encerrado'}
            </span>
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <MapPin size={12} className="text-accent" />
              {spot?.title || (tournament as any).fishing_resorts?.name || 'Local Oficial'}
            </div>
            {remainingSpots > 0 && remainingSpots <= 10 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-dark text-[8px] font-black uppercase shadow-lg shadow-amber-500/20 animate-pulse">
                Últimas {remainingSpots} Vagas
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">
            {tournament.title}
          </h2>

          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-8 inline-block">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-dark">
                   <Trophy size={20} />
                </div>
                <div>
                   <p className="text-[10px] text-accent font-black uppercase tracking-widest leading-none mb-1">Premiação Estimada</p>
                   <p className="text-lg font-black text-white leading-none">
                      {tournament.prize_pool || `R$ ${(tournament.entry_fee * 50).toLocaleString()} EM PRÊMIOS`}
                   </p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Data & Hora</p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calendar size={14} className="text-accent" />
                {format(eventDate, "dd 'de' MMM, HH:mm'h'", { locale: ptBR })}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Capacidade</p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Users size={14} className="text-accent" />
                {remainingSpots} / {tournament.max_participants || '∞'}
              </div>
            </div>
            <div className="flex items-end">
               <button 
                onClick={() => spotId && onViewOnMap(0, 0, spotId)}
                className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
               >
                 <ExternalLink size={12} /> Ver no Mapa
               </button>
            </div>
          </div>
        </div>

        {/* EFEITO SERRILHADO (PERFORATION) */}
        <div className="hidden md:flex flex-col justify-around py-4 w-1 bg-transparent relative z-10">
           <div className="absolute -left-3 inset-y-0 flex flex-col justify-around gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-[#0a0f1a] -ml-3" />
              ))}
           </div>
        </div>

        {/* LADO DIREITO: STUB / BOTÃO */}
        <div className="md:w-72 bg-accent/90 backdrop-blur-md flex flex-col items-center justify-center p-8 relative border-t-2 md:border-t-0 md:border-l-2 border-dashed border-dark/20 min-h-[200px]">
          
          <div className="text-dark flex flex-col items-center text-center w-full">
            {isParticipating ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                {showQR ? (
                  <div className="bg-white p-3 rounded-2xl shadow-xl animate-in zoom-in-50 duration-300">
                    <QrCode size={120} className="text-dark" />
                    <p className="text-[8px] font-black uppercase mt-2 text-dark opacity-40">TICKET #{tournament.id.slice(0,8)}</p>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-dark/10 flex items-center justify-center mb-2">
                    <CheckCircle2 size={32} className="text-dark" />
                  </div>
                )}
                
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">Confirmado!</h3>
                   <p className="text-[10px] font-bold opacity-60 uppercase">Você está na disputa</p>
                </div>

                <button 
                  onClick={() => setShowQR(!showQR)}
                  className="w-full bg-dark text-white py-3 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  {showQR ? 'Ocultar Ticket' : 'Ver Meu Ticket'}
                </button>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-tighter opacity-50 mb-1">Taxa de Adesão</p>
                <h3 className="text-4xl font-black mb-6 tracking-tighter leading-none italic">
                  R$ {tournament.entry_fee.toFixed(2).replace('.', ',')}
                </h3>
                
                <button 
                  onClick={() => onCheckIn(tournament.id)}
                  disabled={tournament.status !== 'open' || isFull}
                  className="w-full bg-dark text-accent py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-dark/30 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:scale-100"
                >
                  {isFull ? 'Lotado' : (
                    <>
                      Garantir Vaga
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="mt-6 text-[8px] font-black text-dark/30 uppercase tracking-[0.3em]">Fishgada Official</p>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-elevated {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .animate-neon-pulse {
          animation: neon-pulse 2s infinite ease-in-out;
        }

        @keyframes neon-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 170, 0.1); }
          50% { box-shadow: 0 0 25px rgba(0, 212, 170, 0.4); }
        }
      `}</style>
    </div>
  )
}
