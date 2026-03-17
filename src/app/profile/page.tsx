'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { User, Trophy, Fish, MapPin, Calendar, Star, TrendingUp, Award, Clock } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getRankByLevel } from '@/lib/utils/ranks'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    total_captures: 0,
    total_weight: 0,
    unique_species: 0,
    medals_count: 0
  })
  const [achievements, setAchievements] = useState<any[]>([])
  const [inscriptions, setInscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUser(user)
      
      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      // Fetch Achievements
      const { data: userAch } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', user.id)
      
      if (userAch) {
        setAchievements(userAch)
      }

      // Fetch Tournament Inscriptions
      const { data: userInscriptions } = await supabase
        .from('tournament_participants')
        .select(`
          id,
          registered_at,
          tournaments(
            id,
            title,
            event_date,
            status,
            fishing_resorts(
              spots(title)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false })
      
      if (userInscriptions) {
        setInscriptions(userInscriptions)
      }

      // Fetch Captures for Stats
      const { data: captures } = await supabase
        .from('captures')
        .select('species, weight_kg')
        .eq('user_id', user.id)

      if (captures && captures.length > 0) {
        const captureList = captures as any[]
        const uniqueSpecies = new Set(captureList.map((c: any) => c.species)).size
        const totalWeight = captureList.reduce((acc: number, c: any) => acc + (c.weight_kg || 0), 0)
        
        setStats({
          total_captures: captures.length,
          total_weight: Math.round(totalWeight * 10) / 10,
          unique_species: uniqueSpecies,
          medals_count: userAch?.length || 0
        })
      }
    }
    setLoading(false)
  }

  if (loading) return null

  const userRank = profile ? getRankByLevel(profile.level || 1) : null
  
  // Cálculo dinâmico do XP para a barra de progresso
  const calculateXPProgress = () => {
    if (!profile) return 0
    const xp = profile.xp_points || 0
    
    if (xp <= 500) return (xp / 500) * 100
    if (xp <= 2000) return ((xp - 500) / 1500) * 100
    if (xp <= 5000) return ((xp - 2000) / 3000) * 100
    return 100
  }

  const getNextLevelXP = () => {
    if (!profile) return 500
    const xp = profile.xp_points || 0
    if (xp <= 500) return 500
    if (xp <= 2000) return 2000
    if (xp <= 5000) return 5000
    return xp
  }

  const xpProgress = calculateXPProgress()
  const nextXP = getNextLevelXP()

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#0a0f1a]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-10 fade-in">
          
          {/* Hero Profile Header */}
          <div className="relative glass-elevated rounded-[40px] p-8 md:p-12 border border-white/5 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -mr-32 -mt-32" />
            <div 
              className="absolute bottom-0 left-0 w-64 h-64 blur-[100px] opacity-20 rounded-full" 
              style={{ backgroundColor: userRank?.color }} 
            />

            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Avatar Big */}
              <div className="relative">
                <div 
                  className="w-32 h-32 md:w-44 md:h-44 rounded-[48px] overflow-hidden p-1.5 shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${userRank?.color}, transparent)` }}
                >
                  <div className="w-full h-full rounded-[42px] overflow-hidden bg-slate-900 border border-white/10">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover" />
                    ) : <User className="w-full h-full p-10 text-gray-500" />}
                  </div>
                </div>
                <div 
                  className="absolute -bottom-4 -right-4 w-12 h-12 md:w-16 md:h-16 rounded-3xl flex items-center justify-center border-4 border-[#0a0f1a] shadow-xl transform hover:scale-110 transition-transform"
                  style={{ backgroundColor: userRank?.color || '#333' }}
                >
                  <span className="text-dark font-black text-xl md:text-2xl">L{profile?.level || 1}</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  {userRank && <userRank.icon size={16} style={{ color: userRank.color }} />}
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]" style={{ color: userRank?.color }}>
                    {userRank?.title}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                  {profile?.display_name || 'Pescador'}
                </h1>
                
                <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl">
                  {profile?.bio || 'Nenhuma biografia disponível ainda. Edite seu perfil para contar suas histórias!'}
                </p>

                {/* Progress Bar */}
                <div className="pt-4 max-w-sm mx-auto md:mx-0">
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-black text-accent uppercase tracking-widest">Progresso XP</span>
                     <span className="text-[10px] font-bold text-white/40">{profile?.xp_points} / {nextXP} XP</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-1000 shadow-[0_0_15px_rgba(0,212,170,0.5)]"
                        style={{ width: `${xpProgress}%` }}
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Capturas', value: stats.total_captures, icon: Fish, color: '#00d4aa' },
              { label: 'Peso Total (kg)', value: stats.total_weight, icon: TrendingUp, color: '#3b82f6' },
              { label: 'Espécies Únicas', value: stats.unique_species, icon: Star, color: '#f59e0b' },
              { label: 'Medalhas', value: stats.medals_count, icon: Award, color: '#ec4899' },
            ].map((stat) => (
              <div key={stat.label} className="glass p-6 rounded-[28px] border border-white/5 space-y-3 hover:bg-white/[0.05] transition-all group">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Minhas Inscrições (Torneios) */}
             <div className="glass p-8 rounded-[32px] border border-white/5 space-y-6">
                <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={16} className="text-accent" /> Minhas Inscrições
                </h3>
                <div className="space-y-4">
                  {inscriptions.length > 0 ? inscriptions.map((insc: any) => (
                    <div key={insc.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                          <Trophy size={40} className="text-accent" />
                       </div>
                       <div className="flex flex-col z-10">
                          <p className="text-white font-bold text-sm">{insc.tournaments?.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-black">
                            <MapPin size={10} className="inline mr-1" /> {insc.tournaments?.fishing_resorts?.spots?.title || 'Local Oficial'}
                          </p>
                       </div>
                       <div className="text-right z-10 flex flex-col items-end">
                          <span className={`badge ${insc.tournaments?.status === 'open' ? 'badge-accent' : 'badge-gray'} text-[8px] px-2 py-0.5 mb-1`}>
                            {insc.tournaments?.status === 'open' ? 'ABERTO' : 'ENCERRADO'}
                          </span>
                          <p className="text-[10px] text-accent font-black">{new Date(insc.tournaments?.event_date).toLocaleDateString('pt-BR')}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                      <Trophy className="mx-auto text-gray-800 mb-4" size={40} />
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Nenhum evento reservado</p>
                    </div>
                  )}
                </div>
             </div>


             {/* Personal Records Placeholder */}
             <div className="glass p-8 rounded-[32px] border border-white/5 space-y-6">
                <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" /> Recordes Pessoais
                </h3>
                <div className="grid grid-cols-1 gap-4">
                   {achievements.length > 0 ? achievements.map((ua: any) => (
                      <div key={ua.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                              {ua.achievements.icon_name === 'Fish' && <Fish size={18} />}
                              {ua.achievements.icon_name === 'Trophy' && <Trophy size={18} />}
                              {ua.achievements.icon_name === 'MapPin' && <MapPin size={18} />}
                           </div>
                           <div>
                              <p className="text-white font-bold text-sm">{ua.achievements.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase font-black">{ua.achievements.description}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-accent font-black">{new Date(ua.earned_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                   )) : (
                      <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                         <Award className="mx-auto text-gray-800 mb-2" size={32} />
                         <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Nenhuma medalha conquistada</p>
                      </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  )
}

function History({ className, size = 24 }: { className?: string, size?: number }) {
  return <Clock className={className} size={size} />
}
