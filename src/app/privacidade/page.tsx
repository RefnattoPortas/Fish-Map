'use client'

import LegalLayout from '@/components/legal/LegalLayout'

export default function PrivacyPage() {
  return (
    <LegalLayout title="Política de Privacidade">
      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Item 01</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Coleta de Dados Pessoais</h2>
        <p>
          Coletamos nome completo, e-mail, telefone e localização geográfica precisa (quando autorizado) para viabilizar as funcionalidades do radar e perfil.
        </p>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Item 02</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Uso dos Seus Pontos de Pesca</h2>
        <p>
          O Fishgada protege sua "estratégia de pesca". Seus pontos marcados como <span className="text-red-400">Privado</span> só são visíveis para você. Seus pontos marcados como <span className="text-purple-400">Parceiro</span> são públicos por natureza comercial.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-6 italic">
          "Sua localização atual só é visível para o servidor do Fishgada para mostrar pontos próximos. Não rastreamos o seu dispositivo fora do contexto da plataforma."
        </div>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Item 03</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Segurança e Armazenamento</h2>
        <p>
          Utilizamos criptografia ponta-a-ponta e armazenamento seguro via Supabase (PostgreSQL). Dados de pagamento são processados por adquirentes especializados e não ficam salvos em nossos servidores.
        </p>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Item 04</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Compartilhamento de Dados</h2>
        <p>
          O Fishgada não vende seus dados para terceiros. Compartilhamentos ocorrem apenas com órgãos governamentais sob ordem judicial ou para finalidades técnicas (ex: processamento de e-mails via SendGrid).
        </p>
      </section>

      <section>
        <span className="text-cyan-400 font-black uppercase text-xs tracking-widest block mb-4">Item 05</span>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Seus Direitos (LGPD)</h2>
        <p>
          Você tem o direito de solicitar a exclusão total dos seus dados da nossa plataforma a qualquer momento entrando em contato com o suporte em contato@fishgada.com.br.
        </p>
      </section>
    </LegalLayout>
  )
}
