'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { 
  Users, UserPlus, UserMinus, Search, MapPin, 
  Star, Heart, Filter, ArrowRight, Loader2, 
  User, CheckCircle2, ShieldOff, Building
} from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function SocialPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'friends' | 'following_spots' | 'find'>('friends')
  
  const [friends, setFriends] = useState<any[]>([])
  const [followingSpots, setFollowingSpots] = useState<any[]>([])
  const [foundUsers, setFoundUsers] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const supabase = getSupabaseClient() as any

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      setUser(user)
      if (user) {
        fetchSocialData(user.id)
      }
      setLoading(false)
    })
  }, [])

  const fetchSocialData = async (userId: string) => {
    // 1. Fetch Following Users (Friends)
    const { data: friendsData } = await supabase
      .from('user_follows')
      .select('*, profiles:followed_id(*)')
      .eq('follower_id', userId)
    
    if (friendsData) setFriends(friendsData)

    // 2. Fetch Following Spots/Resorts
    const { data: spotsData } = await supabase
      .from('resort_follows')
      .select('*, fishing_resorts(*, spots(title))')
      .eq('user_id', userId)

    if (spotsData) setFollowingSpots(spotsData)
  }

  const handleSearchUsers = async () => {
    if (!search.trim()) return
    setSearching(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`display_name.ilike.%${search}%,username.ilike.%${search}%`)
      .limit(10)
    
    if (data) setFoundUsers((data as any[]).filter(u => u.id !== user?.id))
    setSearching(false)
  }

  const toggleFollowUser = async (followedId: string, isFollowing: boolean) => {
    if (!user) return alert('Faça login!')
    
    if (isFollowing) {
      await supabase.from('user_follows').delete().match({ follower_id: user.id, followed_id: followedId })
    } else {
      await supabase.from('user_follows').insert({ follower_id: user.id, followed_id: followedId })
    }
    fetchSocialData(user.id)
  }

  const unfollowSpot = async (spotId: string) => {
    if (!user) return
    await supabase.from('resort_follows').delete().match({ user_id: user.id, resort_id: spotId })
    fetchSocialData(user.id)
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#0a0f1a]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32 pt-20 md:pt-12">
        <div className="max-w-4xl mx-auto space-y-10 fade-in">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent">
                <Users size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Comunidade Fishgada</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Social <span className="text-accent">&</span> Amigos</h1>
              <p className="text-gray-500 font-medium max-w-lg">Gerencie sua rede de pescadores e receba atualizações dos seus pesqueiros favoritos.</p>
            </div>
          </header>

          {/* Search Bar - Find New Friends */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text"
                placeholder="Buscar pescadores por nome ou @username..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium outline-none focus:border-accent/40 transition-all shadow-2xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
              />
            </div>
            <button 
              onClick={handleSearchUsers}
              className="btn-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              {searching ? <Loader2 className="animate-spin" size={18} /> : <><UserPlus size={18} /> Buscar</>}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
            {[
              { id: 'friends', label: 'Seguindo', icon: Users },
              { id: 'following_spots', label: 'Pesqueiros', icon: Building },
              { id: 'find', label: 'Explorar Pescadores', icon: Search },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-accent text-dark shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Lists */}
          <div className="space-y-4 min-h-[400px]">
             
             {/* 1. SEGUINDO (FRIENDS) */}
             {activeTab === 'friends' && (
               <div className="grid grid-cols-1 gap-4">
                 {friends.length === 0 ? (
                    <div className="py-20 text-center glass rounded-[40px] border border-white/5 space-y-4">
                       <Users size={64} className="mx-auto text-gray-700" />
                       <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Você ainda não segue nenhum pescador</p>
                    </div>
                 ) : (
                   friends.map((f: any) => (
                     <div key={f.id} className="glass p-5 rounded-[28px] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 glow-accent-small">
                             {f.profiles.avatar_url ? (
                               <img src={f.profiles.avatar_url} className="w-full h-full object-cover" />
                             ) : <User className="w-full h-full p-3 text-gray-600" />}
                           </div>
                           <div>
                              <h4 className="text-white font-black uppercase italic tracking-tight">{f.profiles.display_name}</h4>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">@{f.profiles.username}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => toggleFollowUser(f.followed_id, true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <UserMinus size={14} /> Deixar de Seguir
                        </button>
                     </div>
                   ))
                 )}
               </div>
             )}

             {/* 2. PESQUEIROS SEGUIDOS */}
             {activeTab === 'following_spots' && (
               <div className="grid grid-cols-1 gap-4">
                 {followingSpots.length === 0 ? (
                    <div className="py-20 text-center glass rounded-[40px] border border-white/5 space-y-4">
                       <Building size={64} className="mx-auto text-gray-700" />
                       <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Você ainda não segue nenhum pesqueiro</p>
                    </div>
                 ) : (
                   followingSpots.map((s: any) => (
                     <div key={s.id} className="glass p-5 rounded-[28px] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                             <Building size={28} />
                           </div>
                           <div>
                              <h4 className="text-white font-black uppercase italic tracking-tight">{s.fishing_resorts?.spots?.title || 'Pesqueiro'}</h4>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Atualizações Ativas</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => unfollowSpot(s.resort_id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <ShieldOff size={14} /> Deixar de Seguir
                        </button>
                     </div>
                   ))
                 )}
               </div>
             )}

             {/* 3. ENCONTRAR USUÁRIOS */}
             {activeTab === 'find' && (
                <div className="grid grid-cols-1 gap-4">
                  {foundUsers.length === 0 ? (
                     <div className="py-20 text-center glass rounded-[40px] border border-white/5 space-y-4">
                        <Search size={64} className="mx-auto text-gray-700" />
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Use a busca acima para encontrar amigos</p>
                     </div>
                  ) : (
                    foundUsers.map((u: any) => {
                      const isFollowing = friends.some(f => f.followed_id === u.id)
                      return (
                        <div key={u.id} className="glass p-5 rounded-[28px] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                               {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-gray-600" />}
                            </div>
                            <div>
                               <h4 className="text-white font-black uppercase italic tracking-tight">{u.display_name}</h4>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">@{u.username}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => toggleFollowUser(u.id, isFollowing)}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                              isFollowing 
                                ? 'border border-white/10 text-gray-500 hover:text-red-500 hover:border-red-500/30' 
                                : 'bg-accent text-dark shadow-lg shadow-accent/20 active:scale-95'
                            }`}
                          >
                            {isFollowing ? 'Seguindo' : 'Seguir'}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
             )}
          </div>

        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
