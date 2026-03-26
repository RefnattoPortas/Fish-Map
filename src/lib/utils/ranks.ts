import { Fish, Waves, Trophy, Anchor } from 'lucide-react'
import { ReactNode } from 'react'

export interface RankInfo {
  title: string
  color: string
  icon: any
  minLevel: number
  maxLevel: number
  phrases: string[]
}

export const USER_RANKS: RankInfo[] = [
  {
    title: 'Alevino',
    color: '#94a3b8',
    icon: Fish,
    minLevel: 1,
    maxLevel: 1,
    phrases: ['Começando a história no Fishgada!', 'O primeiro de muitos.', 'O futuro mestre está nascendo.']
  },
  {
    title: 'Pescador de Barranco',
    color: '#b45309',
    icon: Anchor,
    minLevel: 2,
    maxLevel: 2,
    phrases: ['Paciência e persistência no trecho.', 'O segredo é a leitura da água.', 'No barranco se aprende a pescar.']
  },
  {
    title: 'Mestre dos Rios',
    color: '#f59e0b',
    icon: Waves,
    minLevel: 3,
    maxLevel: 3,
    phrases: ['O rio não tem segredos para quem sabe ouvir.', 'Domínio total da batida.', 'Nas águas onde o peixe mora.']
  },
  {
    title: 'Lenda da Pesca',
    color: '#ec4899',
    icon: Trophy,
    minLevel: 4,
    maxLevel: 999,
    phrases: ['Respeite quem conhece o trecho.', 'As águas se curvam à lenda.', 'O topo da cadeia alimentar.']
  }
]

export function getRankByLevel(level: number): RankInfo {
  const safeLevel = Math.max(1, level)
  return USER_RANKS.find(r => safeLevel >= r.minLevel && safeLevel <= r.maxLevel) || USER_RANKS[USER_RANKS.length - 1]
}
