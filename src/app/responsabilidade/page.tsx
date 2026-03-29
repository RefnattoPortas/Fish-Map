'use client'

import LegalLayout from '@/components/legal/LegalLayout'

export default function ResponsibilityPage() {
  return (
    <LegalLayout title="Termo de Responsabilidade">
      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Aviso de Isenção 01</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Acesso a Locais e Propriedades</h2>
        <p>
          O Fishgada fornece coordenadas geográficas, mas não garante o direito de acesso físico aos locais. O usuário deve respeitar cercas, propriedades privadas e avisos de restrição de entrada.
        </p>
        <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 mt-6 italic text-red-100">
           "O uso do Fishgada não concede direito de posse ou acesso privilegiado a propriedades particulares."
        </div>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Aviso de Isenção 02</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Segurança Física e Risco</h2>
        <p>
          A pesca esportiva envolve riscos naturais: animais peçonhentos, correntes, condições climáticas e locais isolados. O Fishgada exime-se de qualquer responsabilidade por acidentes, danos físicos ou materiais ocorridos durante a prática.
        </p>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Aviso de Isenção 03</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Conteúdo Gerado por Usuário</h2>
        <p>
          As dicas de iscas, profundidade e atividade de peixes são geradas por outros pescadores. Não garantimos p produtividade de qualquer local, uma vez que a pesca depende de fatores biológicos fora do nosso controle.
        </p>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Aviso de Isenção 04</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Pesqueiros Parceiros</h2>
        <p>
          Problemas relacionados a atendimento, estrutura física ou cobranças em Pesqueiros Parceiros devem ser resolvidos diretamente com o estabelecimento comercial.
        </p>
      </section>

      <section className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
        <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest italic">Pesca Consciente</h3>
        <p className="text-sm">
          O Fishgada incentiva a prática de Pesca e Solte. Pescar com responsabilidade é garantir o peixe de amanhã.
        </p>
      </section>
    </LegalLayout>
  )
}
