-- ============================================================
-- WikiFish Fishing Resorts Extension v1.2
-- Suporte para estabelecimentos comerciais (Pesqueiros)
-- ============================================================

-- 1. TABELA: fishing_resorts
CREATE TABLE IF NOT EXISTS public.fishing_resorts (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spot_id           UUID NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
    
    -- Infraestrutura (JSONB para flexibilidade)
    -- Esperado: { "restaurante": bool, "banheiros": bool, "wi_fi": bool, "pousada": bool, "aluguel_equipamento": bool, "estacionamento": bool }
    infrastructure    JSONB DEFAULT '{}'::jsonb,
    
    -- Operacional
    opening_hours     TEXT, -- ou JSONB se preferir horários complexos
    prices            JSONB DEFAULT '{}'::jsonb, -- taxas de entrada, quilo, etc
    
    -- Contatos
    phone             TEXT,
    instagram         TEXT,
    website           TEXT,
    
    -- Parceiro Oficial
    is_partner        BOOLEAN DEFAULT FALSE,
    
    -- Espécies predominantes nos tanques
    main_species      TEXT[], -- Array de espécies (ex: ['Tambacu', 'Pirarara', 'Tilápia'])
    
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(spot_id)
);

-- RLS para Fishing Resorts
ALTER TABLE public.fishing_resorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pesqueiros visíveis a todos" ON public.fishing_resorts
    FOR SELECT USING (TRUE);

CREATE POLICY "Apenas admin ou dono do spot gerencia o resort" ON public.fishing_resorts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.spots s
            WHERE s.id = fishing_resorts.spot_id AND s.user_id = auth.uid()
        )
    );

-- 2. ATUALIZAR VIEW DE MAPA (spots_map_view)
-- Vamos adicionar uma flag para identificar se o spot é um pesqueiro
DROP VIEW IF EXISTS public.spots_map_view;

CREATE OR REPLACE VIEW public.spots_map_view AS
SELECT
    s.id,
    s.user_id,
    s.title,
    s.description,
    s.privacy_level,
    s.fuzz_radius_m,
    s.water_type,
    s.is_verified,
    s.verification_count,
    s.community_unlock_captures,
    s.created_at,
    ST_X(s.location_fuzzed::geometry) AS display_lng,
    ST_Y(s.location_fuzzed::geometry) AS display_lat,
    ST_X(s.location::geometry)        AS exact_lng,
    ST_Y(s.location::geometry)        AS exact_lat,
    (SELECT COUNT(*) FROM public.captures c WHERE c.spot_id = s.id) AS total_captures,
    (SELECT se.lure_type FROM public.setups se
     JOIN public.captures ca ON ca.id = se.capture_id
     WHERE ca.spot_id = s.id ORDER BY ca.captured_at DESC LIMIT 1) AS latest_lure_type,
    p.display_name AS owner_name,
    p.avatar_url   AS owner_avatar,
    -- Dados de Pesqueiro
    fr.id IS NOT NULL AS is_resort,
    fr.is_partner     AS is_resort_partner,
    fr.infrastructure AS resort_infrastructure
FROM public.spots s
JOIN public.profiles p ON p.id = s.user_id
LEFT JOIN public.fishing_resorts fr ON fr.spot_id = s.id
WHERE s.is_active = TRUE;
