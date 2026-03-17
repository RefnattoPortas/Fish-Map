'use client'

import { useState } from 'react'
import { X, MapPin, Save, Utensils, Wifi, Warehouse, Anchor, Car, Clock, Instagram, Phone, Globe, Star, Fish, Camera, Plus } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

interface NewResortFormProps {
  userId: string
  isOnline: boolean
  initialLat?: number
  initialLng?: number
  onClose: () => void
  onSuccess?: () => void
}

const FISH_SPECIES = [
  'Tambacu', 'Tambaqui', 'Pirarara', 'Pincachola', 'Pintado', 'Tilápia', 'Carpa', 'Pacu', 'Matrinxã', 'Dourado'
]

export default function NewResortForm({ userId, isOnline, initialLat, initialLng, onClose, onSuccess }: NewResortFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState({
    title: '',
    description: '',
    opening_hours: '',
    phone: '',
    instagram: '',
    website: '',
    infra: {
      restaurante: false,
      banheiros: false,
      wi_fi: false,
      pousada: false,
      aluguel_equipamento: false,
      estacionamento: false
    },
    main_species: [] as string[],
    prices: {
      entry: '',
      fishing: '',
      kg: ''
    },
    is_partner: false,
    lat: initialLat || -15.7801,
    lng: initialLng || -47.9292
  })

  const supabase = getSupabaseClient() as any // Workaround para problemas de inferência circular no workspace

  const toggleInfra = (key: keyof typeof data.infra) => {
    setData(d => ({
      ...d,
      infra: { ...d.infra, [key]: !d.infra[key] }
    }))
  }

  const toggleSpecies = (sp: string) => {
    setData(d => ({
      ...d,
      main_species: d.main_species.includes(sp) 
        ? d.main_species.filter(s => s !== sp)
        : [...d.main_species, sp]
    }))
  }

  const handleSave = async () => {
    if (!data.title) return
    
    // Se for guest, impedimos cadastro de empresa
    if (userId === 'guest-user') {
      alert('Cadastro de pesqueiros oficiais requer uma conta de parceiro. Por favor, faça login.')
      return
    }

    if (!isOnline) {
      alert('Sem conexão. O cadastro de pesqueiros requer internet para registro oficial das coordenadas.')
      return
    }

    setLoading(true)

    try {
      // 1. Criar o Spot
      const { data: spot, error: spotError } = await supabase
        .from('spots')
        .insert([{
          user_id: userId,
          title: data.title,
          description: data.description || null,
          privacy_level: 'public' as any,
          water_type: 'lake' as any,
          location: `POINT(${data.lng} ${data.lat})`,
          is_active: true
        }])
        .select()
        .single()

      if (spotError) throw spotError

      // 2. Criar o Resort vinculado
      const { error: resortError } = await supabase
        .from('fishing_resorts')
        .insert([{
          spot_id: (spot as any).id,
          infrastructure: data.infra as any,
          opening_hours: data.opening_hours || null,
          prices: data.prices as any,
          phone: data.phone || null,
          instagram: data.instagram || null,
          website: data.website || null,
          is_partner: data.is_partner,
          main_species: data.main_species
        }])

      if (resortError) throw resortError

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
    } catch (err: any) {
      console.error('Erro ao salvar pesqueiro:', err)
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4 bg-black/90">
        <div className="glass-elevated fade-in" style={{ borderRadius: 24, padding: 48, textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏡</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-accent-primary)', marginBottom: 8 }}>
            Pesqueiro Cadastrado!
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
            O estabelecimento foi adicionado ao mapa com sucesso.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-2 sm:p-4 bg-black/80">
      <div className="glass-elevated fade-in-up" 
           style={{ 
             width: '100%', maxWidth: 550, borderRadius: 28, maxHeight: '95vh', 
             display: 'flex', flexDirection: 'column', overflow: 'hidden' 
           }}>
        
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Warehouse className="text-accent" /> Cadastrar Pesqueiro
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                Adicione detalhes comerciais e infraestrutura
              </p>
            </div>
            <button onClick={onClose} className="btn-secondary" style={{ width: 44, height: 44, padding: 0, borderRadius: 16 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }} className="custom-scrollbar">
          
          {/* Nome e Preços Básicos */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Nome do Estabelecimento *</label>
              <input 
                className="input" 
                placeholder="Ex: Pesqueiro do Japa" 
                value={data.title}
                onChange={e => setData(d => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Taxa Entrada</label>
              <input 
                className="input" 
                placeholder="R$ 50,00"
                value={data.prices.entry}
                onChange={e => setData(d => ({ ...d, prices: { ...d.prices, entry: e.target.value } }))}
              />
            </div>
          </div>

          {/* Infraestrutura (Requested: restaurante, banheiros, wi-fi, pousada, aluguel_equipamento, estacionamento) */}
          <div>
            <label className="label">Infraestrutura Disponível</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { id: 'restaurante', icon: <Utensils size={18} />, label: 'Restaurante' },
                { id: 'banheiros', icon: <Warehouse size={18} />, label: 'Banheiros' },
                { id: 'wi_fi', icon: <Wifi size={18} />, label: 'Wi-Fi' },
                { id: 'pousada', icon: <Warehouse size={18} />, label: 'Pousada' },
                { id: 'aluguel_equipamento', icon: <Anchor size={18} />, label: 'Aluguel' },
                { id: 'estacionamento', icon: <Car size={18} />, label: 'Estacionamento' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleInfra(opt.id as any)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px',
                    borderRadius: 18, border: '2px solid',
                    borderColor: data.infra[opt.id as keyof typeof data.infra] ? 'var(--color-accent-primary)' : 'var(--color-border)',
                    background: data.infra[opt.id as keyof typeof data.infra] ? 'var(--color-accent-glow)' : 'rgba(255,255,255,0.02)',
                    color: data.infra[opt.id as keyof typeof data.infra] ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opt.icon}
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Espécies do Tanque */}
          <div>
            <label className="label"><Fish size={14} /> Espécies nos Tanques</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FISH_SPECIES.map(sp => (
                <button
                  key={sp}
                  onClick={() => toggleSpecies(sp)}
                  className={`chip ${data.main_species.includes(sp) ? 'active' : ''}`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Horários e Contato */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label"><Clock size={14} /> Funcionamento</label>
              <input 
                className="input" 
                placeholder="Ex: Ter a Dom, 07h às 18h" 
                value={data.opening_hours}
                onChange={e => setData(d => ({ ...d, opening_hours: e.target.value }))}
              />
            </div>
            <div>
              <label className="label"><Phone size={14} /> Telefone</label>
              <input 
                className="input" 
                placeholder="(11) 99999-9999" 
                value={data.phone}
                onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label"><Instagram size={14} /> Instagram</label>
              <input 
                className="input" 
                placeholder="@pesqueiro" 
                value={data.instagram}
                onChange={e => setData(d => ({ ...d, instagram: e.target.value }))}
              />
            </div>
            <div>
              <label className="label"><Globe size={14} /> Website</label>
              <input 
                className="input" 
                placeholder="www.pesqueiro.com" 
                value={data.website}
                onChange={e => setData(d => ({ ...d, website: e.target.value }))}
              />
            </div>
          </div>

          <div className="glass" style={{ padding: 16, borderRadius: 16, border: '1px dashed var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin className="text-accent" size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Localização do Pesqueiro</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Lat: {data.lat.toFixed(4)}, Lng: {data.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Galeria de Fotos */}
          <div>
            <label className="label"><Camera size={14} /> Fotos do Local (Estrutura e Tanques)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <button 
                className="glass" 
                style={{ 
                  aspectRatio: '1', borderRadius: 16, border: '1px dashed var(--color-border)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, color: 'var(--color-text-muted)'
                }}
              >
                <Plus size={20} />
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Adicionar</span>
              </button>
              {[1, 2, 3].map(i => (
                <div key={i} className="glass" style={{ aspectRatio: '1', borderRadius: 16, overflow: 'hidden', opacity: 0.3 }}>
                  <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=200" className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Partner Highlight */}
          <div className="glass" style={{ padding: 16, borderRadius: 20, border: '1px solid var(--color-accent-glow)', background: 'linear-gradient(to right, rgba(0,212,170,0.05), transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star className="text-accent" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Parceiro Oficial FishMap?</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Destaca o local no mapa com selo verificado</div>
              </div>
              <input 
                type="checkbox" 
                style={{ width: 20, height: 20 }} 
                checked={data.is_partner}
                onChange={e => setData(d => ({ ...d, is_partner: e.target.checked }))}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px 32px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ flex: 1, borderRadius: 16 }} onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            style={{ flex: 2, borderRadius: 16 }}
            disabled={loading || !data.title}
            onClick={handleSave}
          >
            {loading ? <span className="spinner" /> : <Save size={18} />} Salvar Pesqueiro
          </button>
        </div>
      </div>
    </div>
  )
}
