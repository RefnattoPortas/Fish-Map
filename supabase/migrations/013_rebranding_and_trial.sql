-- =============================================
-- MIGRATION 013: Rebranding Fishgada & Free Trial Logic
-- =============================================

-- 1. Adicionar colunas de trial e primeiro login no perfil
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT TRUE;

-- 2. Atualizar a função handle_new_user para incluir o trial de 3 meses
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        username, 
        display_name, 
        avatar_url,
        trial_ends_at,
        is_first_login
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'pescador_' || SUBSTR(NEW.id::TEXT, 1, 6)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Pescador'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
        NOW() + INTERVAL '3 months',
        TRUE
    )
    ON CONFLICT (id) DO UPDATE SET
        trial_ends_at = EXCLUDED.trial_ends_at,
        is_first_login = EXCLUDED.is_first_login;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garantir que assinaturas existentes ou novos parceiros (pesqueiros) ganhem o bônus de 1 ano (ou 6 meses conforme solicitado no final)
-- O prompt menciona "1 ano de ativação gratuita" para Pesqueiro Parceiro em uma parte e "6 meses" em outra.
-- Vou seguir a instrução final de 6 meses para novos pesqueiros.
ALTER TABLE public.fishing_resorts ADD COLUMN IF NOT EXISTS is_founder_partner BOOLEAN DEFAULT FALSE;

-- Trigger para definir trial de 6 meses para novos pesqueiros
CREATE OR REPLACE FUNCTION public.trigger_resort_founder_bonus()
RETURNS TRIGGER AS $$
BEGIN
    -- Se for um novo pesqueiro, ganha 6 meses de ativação (Founder Partner)
    NEW.active_until := NOW() + INTERVAL '6 months';
    NEW.is_founder_partner := TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_resort_created_bonus ON public.fishing_resorts;
CREATE TRIGGER on_resort_created_bonus
    BEFORE INSERT ON public.fishing_resorts
    FOR EACH ROW EXECUTE FUNCTION public.trigger_resort_founder_bonus();

-- 4. Atualizar a view do mapa para refletir o status de parceiro/founder
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
    (SELECT se.lure_model FROM public.setups se
     JOIN public.captures ca ON ca.id = se.capture_id
     WHERE ca.spot_id = s.id ORDER BY ca.captured_at DESC LIMIT 1) AS latest_lure_model,
    (SELECT se.lure_color FROM public.setups se
     JOIN public.captures ca ON ca.id = se.capture_id
     WHERE ca.spot_id = s.id ORDER BY ca.captured_at DESC LIMIT 1) AS latest_lure_color,
    p.display_name AS owner_name,
    p.avatar_url   AS owner_avatar,
    CASE WHEN fr.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_resort,
    CASE WHEN fr.is_partner = TRUE OR fr.is_founder_partner = TRUE THEN TRUE ELSE FALSE END AS is_resort_partner,
    fr.id AS resort_id,
    fr.opening_hours,
    fr.phone,
    fr.infrastructure AS resort_infrastructure,
    fr.prices AS resort_prices,
    -- Highlights (pode vir de uma tabela de promoções ou campo no resort)
    '👑 Parceiro Fundador' as resort_active_highlight
FROM public.spots s
JOIN public.profiles p ON p.id = s.user_id
LEFT JOIN public.fishing_resorts fr ON fr.spot_id = s.id
WHERE s.is_active = TRUE;
