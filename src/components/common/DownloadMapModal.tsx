'use client'

import { useState } from 'react'
import { X, Download, Map as MapIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { downloadRegion } from '@/lib/offline/tile-downloader'

interface DownloadMapModalProps {
  onClose: () => void
  center: [number, number]
  mapTheme: 'dark' | 'light'
}

export default function DownloadMapModal({ onClose, center, mapTheme }: DownloadMapModalProps) {
  const [name, setName] = useState('Minha Região de Pesca')
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [completed, setCompleted] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    // Calcular bounding box para um raio de 50km
    const radiusKm = 50
    const latDelta = radiusKm / 111.32
    const lngDelta = radiusKm / (111.32 * Math.cos(center[0] * Math.PI / 180))
    
    const bounds = {
      north: center[0] + latDelta,
      south: center[0] - latDelta,
      east: center[1] + lngDelta,
      west: center[1] - lngDelta
    }

    try {
      await downloadRegion({
        name,
        ...bounds,
        minZoom: 10,
        maxZoom: 16,
        theme: mapTheme,
        onProgress: (current, total) => setProgress({ current, total })
      })
      setCompleted(true)
      setTimeout(onClose, 2000)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Falha ao baixar mapa. Verifique sua conexão.')
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[7000] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Background Dim */}
      <div className="absolute inset-0 bg-[#0a0f1a]/80 backdrop-blur-md" onClick={!isDownloading ? onClose : undefined} />
      
      <div className="relative w-full max-w-md glass rounded-t-[32px] md:rounded-[32px] border-t md:border border-white/10 overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.5)] md:shadow-2xl">
        
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-black text-xl uppercase italic tracking-tighter flex items-center gap-2">
              <Download className="text-accent" /> Baixar Mapa Offline
            </h3>
            {!isDownloading && (
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            )}
          </div>

          {!completed ? (
            <>
              <p className="text-gray-400 text-sm leading-relaxed">
                Você está baixando uma área de <span className="text-accent font-black">50km de raio</span>. Arraste o marcador no mapa para ajustar a posição exata.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest pl-1">Nome da Região</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isDownloading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent/50 outline-none transition-all font-medium"
                />
              </div>

              {isDownloading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-accent flex items-center gap-2">
                      <Loader2 className="animate-spin" size={14} /> Baixando...
                    </span>
                    <span className="text-white">{progress.current} / {progress.total}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-accent transition-all duration-300 shadow-[0_0_10px_rgba(0,212,170,0.5)]" 
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex gap-3 italic">
                  <div className="text-accent shrink-0"><MapIcon size={20} /></div>
                  <p className="text-[10px] text-gray-300">
                    O download cobre de Zoom 10 a 16. O tamanho varia conforme a densidade da região escolhida.
                  </p>
                </div>
              )}

              {!isDownloading && (
                <button 
                  onClick={handleDownload}
                  className="w-full btn-primary py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_30px_rgba(0,212,170,0.3)]"
                >
                  Confirmar e Iniciar
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">Mapa Salvo!</h4>
                <p className="text-gray-500 text-sm mt-2">Você já pode pescar nessa área sem sinal.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
