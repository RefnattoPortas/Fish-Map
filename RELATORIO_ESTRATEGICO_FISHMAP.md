# 🎣 RELATÓRIO ESTRATÉGICO: FISHMAP v1.5
**Data de Emissão:** 20 de Março de 2026  
**Status do Ecossistema:** Operacional (Next.js + Supabase)

---

## 1. O QUE É O FISHMAP?
O **FishMap** é uma plataforma de geolocalização e inteligência de dados voltada para a **Pesca Esportiva**. Ele conecta dois mundos: o pescador amador/profissional que busca o melhor lugar para pescar, e o empresário de pesqueiros que precisa de tráfego qualificado e ferramentas de marketing.

**Diferencial Tecnológico:** O sistema utiliza lógica de **Viewport Filtering**, o que significa que ele se comporta de forma inteligente: conforme o usuário navega no mapa, a contagem de peixes e os alertas de "Peixe Batendo" se ajustam em tempo real apenas para a região visível.

---

## 2. ANÁLISE DO SISTEMA (SWOT)

### ✅ Pontos Positivos
*   **Segmentação de Pins:** Pins Verdes representam pontos selvagens (comunidade), enquanto Pins Roxos destacam parceiros comerciais (Pesqueiros).
*   **Offline-First:** Suporte a cadastro de capturas em locais sem sinal de internet (sincronização automática via IndexedDB).
*   **Inteligência de Iscas:** O sistema processa dados de milhares de capturas para sugerir a isca correta para cada ponto.
*   **Gestão de Resíduos de Dados:** O painel do pesqueiro permite controle total sobre infraestrutura, fotos e horários.
*   **Design Premium:** Interface em Dark Mode com animações suaves e visual de alta performance.

### ⚠️ Pontos Negativos (Oportunidades de Evolução)
*   **Moderação Comunitária:** Atualmente, a validação de pontos novos depende muito da confiança no usuário (pode ser melhorado com sistema de gamificação).
*   **Consumo de Dados:** O gerenciamento de fotos de alta resolução (galeria de 5 fotos) exige uma conexão estável para o primeiro upload.

---

## 3. POR QUE SER UM ASSINANTE (PLANO PRO/ELITE)?
O usuário **Free** tem o mapa, mas o usuário **Pro** tem o **Radar**.

### Diferenças e Benefícios:
| Funcionalidade | Usuário Comum (Free) | Assinante (Premium) |
| :--- | :---: | :---: |
| Mapa de Localização | Sim | Sim |
| Registro de Capturas | Sim | Sim |
| **Relatório de Melhores Iscas** | Bloqueado 🔒 | **Liberado** ✅ |
| **Melhor Horário de Captura** | Bloqueado 🔒 | **Liberado** ✅ |
| **Ranking de Ranking (Rei do Ponto)** | Somente Visualiza | **Pode Disputar** |
| **Acesso a Torneios Exclusivos** | Não | **Sim** |

---

## 4. O ECOSSISTEMA DO PESQUEIRO PARCEIRO
O FishMap transforma o pesqueiro de um "ponto no Google Maps" em um **Parceiro Institucional**.

### Por que ser um Pesqueiro Parceiro?
1.  **Destaque no Mapa (Pin Roxo):** Diferenciação visual imediata dos seus concorrentes.
2.  **Alertas de Gancho (Active Highlights):** Capacidade de enviar notificações em tempo real para todos no mapa (ex: *"O Tambaca subiu na superfície!*").
3.  **Galeria de 5 Fotos:** Vitrine completa de sua infraestrutura e peixes capturados.
4.  **Painel de Torneios:** Gestão completa de campeonatos de pesca, com rankings integrados.
5.  **Mural de Avisos:** Canal direto de comunicação para preços, trocas de horário e eventos.

### Como se tornar um parceiro?
1.  **Cadastro Inicial:** O proprietário cria um ponto gratuito no mapa.
2.  **Identificação:** No menu lateral, acesse **"Cadastrar Pesqueiro"** (Aba de Gestão).
3.  **Upgrade de Tier:** Após o preenchimento da infraestrutura, o sistema solicitará o upgrade para o plano de parceiro.
4.  **Ativação:** O Pin muda de Verde para Roxo e o estabelecimento entra na rota de destaque do sistema.

---

## 5. FUNCIONALIDADES ATUAIS (RESUMO)
*   **Mapa Interativo**: Com pins coloridos e filtragem por tipo de água.
*   **Contagem de Viewport**: Estatísticas dinâmicas que mudam conforme o zoom do mapa.
*   **Admin Dashboard**: Painel completo para donos de pesqueiros gerenciarem estatísticas e perfis.
*   **Social Feed**: Galeria de fotos de capturas recentes com sistema de curtidas.
*   **Sistema de Troféus**: Geração de cartões de captura personalizados com dados técnicos (espécie, peso, isca).
*   **Offline Storage**: Registro de dados via IndexedDB para uso em áreas isoladas.
*   **Notificações de Gestão**: Silenciador de alertas integrado para o usuário final.

---
**FishMap - Pesca Inteligente, Tecnologia de Ponta.** 🎣🚀
