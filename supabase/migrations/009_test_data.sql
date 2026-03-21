-- Script Master para gerar 30 SPOTS PUBLICOS, 15 PESQUEIROS PARCEIROS e 135 CAPTURAS COM FOTO E LIKES
-- Execute este script no SQL Editor do Supabase

-- 1. Garantir que a tabela de pesqueiros existe (FORA do bloco DO para evitar erro de sintaxe)
CREATE TABLE IF NOT EXISTS public.fishing_resorts (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_id           UUID NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
    infrastructure    JSONB DEFAULT '{}'::jsonb,
    opening_hours     TEXT,
    prices            JSONB DEFAULT '{}'::jsonb,
    phone             TEXT,
    instagram         TEXT,
    website           TEXT,
    active_highlight  TEXT,
    notice_board     TEXT,
    is_partner        BOOLEAN DEFAULT FALSE,
    main_species      TEXT[],
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(spot_id)
);

-- Habilitar RLS se não estiver
ALTER TABLE public.fishing_resorts ENABLE ROW LEVEL SECURITY;

-- 2. Garantir colunas novas existam (caso a tabela já existisse de migration antiga)
ALTER TABLE public.fishing_resorts ADD COLUMN IF NOT EXISTS active_highlight TEXT;
ALTER TABLE public.fishing_resorts ADD COLUMN IF NOT EXISTS notice_board TEXT;

-- 3. Garantir que a VIEW de mapa está atualizada com os campos de pesqueiro (crítico para as cores no mapa)
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
    fr.id IS NOT NULL AS is_resort,
    fr.is_partner     AS is_resort_partner,
    fr.infrastructure AS resort_infrastructure,
    fr.active_highlight AS resort_active_highlight
FROM public.spots s
JOIN public.profiles p ON p.id = s.user_id
LEFT JOIN public.fishing_resorts fr ON fr.spot_id = s.id
WHERE s.is_active = TRUE;

DO $$
DECLARE
    v_user_id UUID;
    v_spot_id UUID;
    v_capture_id UUID;
    v_species TEXT[];
    v_water_types TEXT[];
    v_i INTEGER;
    v_j INTEGER;
    v_k INTEGER;
    v_total_captures INTEGER := 0;
BEGIN
    -- 2. Obter um usuário válido (ordem de criação)
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado. Faça login primeiro.';
        RETURN;
    END IF;

    -- Espécies oficiais
    v_species := ARRAY[
        'Tambaqui (Colossoma macropomum)', 
        'Pirarucu (Arapaima gigas)', 
        'Dourado (Salminus brasiliensis)', 
        'Tucunaré-Açu (Cichla temensis)', 
        'Pintado/Surubim (Pseudoplatystoma corruscans)',
        'Traíra (Hoplias malabaricus)',
        'Robalo-Flecha (Centropomus undecimalis)',
        'Tilápia-do-Nilo (Oreochromis niloticus)',
        'Pacu (Piaractus mesopotamicus)',
        'Piraíba (Brachyplatystoma filamentosum)'
    ];
    
    v_water_types := ARRAY['river', 'lake', 'reservoir', 'sea'];

    -- 2. Limpeza profunda
    DELETE FROM public.interactions;
    DELETE FROM public.setups;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fishing_resorts') THEN
        DELETE FROM public.fishing_resorts;
    END IF;

    DELETE FROM public.captures;
    DELETE FROM public.spots;

    RAISE NOTICE 'Limpando banco... Iniciando criação massiva (135 capturas + 45 locais)...';

    -- 3. Gerar 30 SPOTS PUBLICOS (Pela costa e interior do Brasil)
    FOR v_i IN 1..30 LOOP
        INSERT INTO public.spots (
            id, user_id, title, description, privacy_level, water_type, location, is_active, fuzz_radius_m
        ) VALUES (
            gen_random_uuid(),
            v_user_id,
            'Ponto de Pesca ' || v_i,
            'Local para pesca esportiva com excelentes resultados.',
            'public',
            v_water_types[floor(random() * 4 + 1)],
            ST_SetSRID(ST_MakePoint(-35 - (random() * 35), -5 - (random() * 25)), 4326)::geography,
            true,
            0 -- Sem raio de imprecisão para teste
        ) RETURNING id INTO v_spot_id;

        -- 3 capturas por spot = 90
        FOR v_j IN 1..3 LOOP
            v_total_captures := v_total_captures + 1;
            INSERT INTO public.captures (
                id, user_id, spot_id, species, weight_kg, length_cm, captured_at, photo_url, is_public, is_trophy
            ) VALUES (
                gen_random_uuid(),
                v_user_id,
                v_spot_id,
                v_species[floor(random() * 10 + 1)],
                random() * 30 + 1,
                random() * 100 + 20,
                now() - (random() * interval '60 days'),
                'https://placehold.co/600x400?text=Captura+' || v_total_captures,
                true,
                (random() > 0.8)
            ) RETURNING id INTO v_capture_id;

            -- Inserir alguns LIKES
            FOR v_k IN 1..(floor(random() * 5 + 1)) LOOP
                -- Como não temos muitos usuários, usamos o mesmo ou UUIDs ficticios de profiles (se existirem)
                -- Vamos tentar inserir apenas se o profile existir. Como limpamos profiles? Não limpamos.
                -- Vou apenas inserir 1 like do próprio usuário para teste
                INSERT INTO public.interactions (user_id, capture_id, type)
                VALUES (v_user_id, v_capture_id, 'like')
                ON CONFLICT DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Gerando capturas por spot...';

    -- 4. Gerar PESQUEIROS PARCEIROS para TODOS OS USUÁRIOS (para garantir acesso ao Admin)
    FOR v_user_id IN (SELECT id FROM auth.users) LOOP
        FOR v_i IN 1..5 LOOP
            INSERT INTO public.spots (
                id, user_id, title, description, privacy_level, water_type, location, is_active, fuzz_radius_m
            ) VALUES (
                gen_random_uuid(),
                v_user_id,
                'Pesqueiro do Usuário ' || v_i,
                'Um dos melhores pesqueiros parceiros do FishMap.',
                'public',
                'lake',
                ST_SetSRID(ST_MakePoint(-47 + (random() * 4), -23 + (random() * 4)), 4326)::geography,
                true,
                0
            ) RETURNING id INTO v_spot_id;

            INSERT INTO public.fishing_resorts (
                spot_id, phone, website, is_partner, main_species, infrastructure, active_highlight
            ) VALUES (
                v_spot_id,
                '(11) 98888-777' || v_i,
                'www.seupesqueiro.com',
                true,
                ARRAY['Tambacu', 'Pirarara'],
                '{"restaurante": true, "banheiros": true, "wi_fi": true, "pousada": true}'::jsonb,
                'O PESQUEIRO ESTÁ ATIVO!'
            );

            -- Capturas no pesqueiro (2 por resort)
            FOR v_j IN 1..2 LOOP
                v_total_captures := v_total_captures + 1;
                INSERT INTO public.captures (
                    user_id, spot_id, species, weight_kg, length_cm, captured_at, photo_url, is_public
                ) VALUES (
                    v_user_id,
                    v_spot_id,
                    v_species[floor(random() * 10 + 1)],
                    random() * 15 + 2,
                    random() * 80 + 30,
                    now(),
                    'https://placehold.co/600x400?text=Pesqueiro+User+' || v_i,
                    true
                );
            END LOOP;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Dados gerados com sucesso!';
END $$;
