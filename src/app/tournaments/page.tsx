'use client'

import { useState, useEffect } from 'react'
import { 
  Trophy, Calendar, Users, DollarSign, MapPin, 
  ChevronRight, ArrowLeft, Ticket, CheckCircle2, Clock
} from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Tournament {
  id: string
  title: string
  description: string
  event_date: string
  entry_fee: number
  rules: string
  status: string
  max_participants: number
  resort_id: string
  fishing_resorts: {
    spots: {
      title: string
    }
  }
}

export default function TournamentsPage() {
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [participatingIds, setParticipatingIds] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  const supabase = getSupabaseClient() as any

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      await fetchTournaments()
      if (user) await fetchUserParticipations(user.id)
      setLoading(false)
    }
    init()
  }, [])

  const fetchTournaments = async () => {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        fishing_resorts(
          spots(title)
        )
      `)
      .order('event_date', { ascending: true })

    if (error) console.error(error)
    else setTournaments(data as any)
  }

  const fetchUserParticipations = async (userId: string) => {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('tournament_id')
      .eq('user_id', userId)

    if (error) console.error(error)
    else setParticipatingIds(data.map((p: any) => p.tournament_id))
  }

  const handleCheckIn = async (tournamentId: string) => {
    if (!user) return alert('Faça login para se inscrever!')
    
    const { error } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: user.id
      })

    if (error) {
       alert('Erro na inscrição: ' + error.message)
    } else {
       setParticipatingIds([...participatingIds, tournamentId])
    }
  }

  return (
    <div className="min-h-screen bg-dark text-white p-6 pb-24">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 pt-8 flex items-center justify-between">
         <div>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-4 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={16} /> Voltar ao Mapa
            </button>
            <h1 className="text-5xl font-black tracking-tighter mb-2">PRÓXIMOS EVENTOS</h1>
            <p className="text-gray-400 font-medium">Garanta seu ingresso e some pontos no ranking oficial.</p>
         </div>
         <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Trophy size={40} />
         </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
          {tournaments.length === 0 && (
            <div className="text-center py-20 opacity-30">
               <Ticket size={64} className="mx-auto mb-4" />
               <p className="text-xl font-bold">Nenhum torneio agendado no momento.</p>
            </div>
          )}

          {tournaments.map((t) => {
            const isParticipating = participatingIds.includes(t.id)
            const eventDate = new Date(t.event_date)
            
            return (
              <div key={t.id} className="relative group perspective">
                {/* Visual Estilo Ticket/Ingresso */}
                <div className="flex flex-col md:flex-row glass-elevated border-none overflow-hidden rounded-[32px] hover:scale-[1.02] transition-all duration-500">
                  
                  {/* Left Section (Event Info) */}
                  <div className="flex-1 p-8 md:p-12 relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Ticket size={120} className="rotate-12" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                       <span className={`badge ${t.status === 'open' ? 'badge-accent' : 'badge-red'}`}>
                          {t.status === 'open' ? 'INSCRIÇÕES ABERTAS' : 'ENCERRADO'}
                       </span>
                       <span className="text-xs font-black text-gray-500 uppercase flex items-center gap-1">
                          <MapPin size={12} className="text-accent" /> {t.fishing_resorts.spots.title}
                       </span>
                    </div>

                    <h2 className="text-3xl font-black mb-4 group-hover:text-accent transition-colors">{t.title}</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">{t.description}</p>
                    
                    <div className="flex flex-wrap gap-8 items-center">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                             <Calendar size={18} />
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-500 uppercase font-black">Data do Evento</p>
                             <p className="text-sm font-bold">{format(eventDate, "dd 'de' MMMM", { locale: ptBR })}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                             <Clock size={18} />
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-500 uppercase font-black">Início</p>
                             <p className="text-sm font-bold">{format(eventDate, "HH:mm'h'")}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                             <Users size={18} />
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-500 uppercase font-black">Disponibilidade</p>
                             <p className="text-sm font-bold">{t.max_participants ? `Limite ${t.max_participants}` : 'Ilimitado'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Right Section (Stub/Ticket Edge) */}
                  <div className="md:w-64 bg-accent flex flex-col items-center justify-center p-8 relative border-l-2 border-dashed border-dark/20">
                     {/* Perforations */}
                     <div className="hidden md:block absolute -left-3 top-0 bottom-0 flex flex-col justify-around py-4">
                        {[...Array(12)].map((_, i) => (
                           <div key={i} className="w-6 h-6 rounded-full bg-dark -mx-3" />
                        ))}
                     </div>

                     <div className="text-dark flex flex-col items-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">Taxa de Inscrição</p>
                        <h3 className="text-4xl font-black mb-6">R$ {t.entry_fee}</h3>
                        
                        {isParticipating ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center text-accent">
                                <CheckCircle2 size={24} />
                             </div>
                             <span className="text-xs font-black uppercase text-dark">Check-in Realizado</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleCheckIn(t.id)}
                            disabled={t.status !== 'open'}
                            className="bg-dark text-accent py-4 px-8 rounded-2xl font-black text-sm hover:scale-110 active:scale-95 transition-all shadow-xl shadow-dark/20"
                          >
                            RESERVAR AGORA
                          </button>
                        )}
                        
                        <p className="mt-6 text-[9px] font-bold text-dark/40 uppercase tracking-widest">FISHGADA OFFICIAL EVENT</p>
                     </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .perspective { perspective: 1000px; }
        .glass-elevated {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  )
}
