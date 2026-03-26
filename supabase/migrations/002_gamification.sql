-- ============================================================
-- Fishgada Gamification Migration v1.1
-- Sistema de XP Automatizado e Medalhas
-- ============================================================

-- 1. TABELAS DE CONQUISTAS
CREATE TABLE IF NOT EXISTS public.achievements (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code              TEXT UNIQUE NOT NULL, -- ex: 'primeiro_de_muitos'
    name              TEXT NOT NULL,
    description       TEXT,
    icon_name         TEXT,                 -- nome para o frontend (lucide-react)
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id    UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- RLS para medalhas
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Medalhas visíveis a todos" ON public.achievements FOR SELECT USING (TRUE);
CREATE POLICY "Usuários veem suas próprias conquistas" ON public.user_achievements FOR SELECT USING (TRUE);

-- Seeds de Medalhas
INSERT INTO public.achievements (code, name, description, icon_name)
VALUES 
    ('primeiro_de_muitos', 'Primeiro de Muitos', 'Primeira captura registrada.', 'Fish'),
    ('peso_pesado', 'Peso Pesado', 'Registro de um peixe com mais de 10kg.', 'Trophy'),
    ('explorador', 'Explorador', 'Registrar 5 pontos de pesca diferentes.', 'MapPin')
ON CONFLICT (code) DO NOTHING;

-- 2. NOVA LOGÍCA DE XP E AUTOMAÇÃO

-- Drop triggers e funções antigas para limpeza
DROP TRIGGER IF EXISTS captures_update_profile_stats ON public.captures;
DROP FUNCTION IF EXISTS public.trigger_update_profile_stats();
DROP TRIGGER IF EXISTS spots_update_spot_count ON public.spots;
DROP FUNCTION IF EXISTS public.trigger_update_spot_count();

-- Função unificada para processar atividades do usuário (Triggers)
CREATE OR REPLACE FUNCTION public.handle_user_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_xp_to_add       INT := 0;
    v_total_xp        INT;
    v_new_level       INT;
    v_spots_count     INT;
    v_ach_first_id    UUID;
    v_ach_heavy_id    UUID;
    v_ach_explorer_id UUID;
BEGIN
    -- Cache IDs das conquistas
    SELECT id INTO v_ach_first_id FROM public.achievements WHERE code = 'primeiro_de_muitos';
    SELECT id INTO v_ach_heavy_id FROM public.achievements WHERE code = 'peso_pesado';
    SELECT id INTO v_ach_explorer_id FROM public.achievements WHERE code = 'explorador';

    -- [A] PROCESSAMENTO DE CAPTURAS
    IF (TG_TABLE_NAME = 'captures') THEN
        IF (TG_OP = 'INSERT') THEN
            -- XP: Nova Captura (+50)
            v_xp_to_add := 50;

            -- XP: Foto anexada (+30)
            IF (NEW.photo_url IS NOT NULL AND NEW.photo_url != '') THEN
                v_xp_to_add := v_xp_to_add + 30;
            END IF;

            -- XP: Pesca & Solta (+20)
            IF (NEW.was_released = TRUE) THEN
                v_xp_to_add := v_xp_to_add + 20;
            END IF;

            -- Atualizar contagem no profile
            UPDATE public.profiles SET total_captures = total_captures + 1 WHERE id = NEW.user_id;

            -- Medalha: Primeiro de Muitos
            INSERT INTO public.user_achievements (user_id, achievement_id)
            VALUES (NEW.user_id, v_ach_first_id)
            ON CONFLICT DO NOTHING;

            -- Medalha: Peso Pesado (> 10kg)
            IF (NEW.weight_kg >= 10) THEN
                INSERT INTO public.user_achievements (user_id, achievement_id)
                VALUES (NEW.user_id, v_ach_heavy_id)
                ON CONFLICT DO NOTHING;
            END IF;
            
            -- Setar o XP na própria linha da captura para registro
            NEW.xp_awarded := v_xp_to_add;

        ELSIF (TG_OP = 'DELETE') THEN
            UPDATE public.profiles SET total_captures = GREATEST(0, total_captures - 1) WHERE id = OLD.user_id;
            RETURN OLD;
        END IF;

    -- [B] PROCESSAMENTO DE SPOTS
    ELSIF (TG_TABLE_NAME = 'spots') THEN
        IF (TG_OP = 'INSERT') THEN
            -- XP: Novo Ponto (+100)
            v_xp_to_add := 100;

            -- Atualizar contagem no profile
            UPDATE public.profiles SET total_spots = total_spots + 1 WHERE id = NEW.user_id;

            -- Medalha: Explorador (5 spots)
            SELECT COUNT(*) INTO v_spots_count FROM public.spots WHERE user_id = NEW.user_id;
            IF (v_spots_count >= 5) THEN
                INSERT INTO public.user_achievements (user_id, achievement_id)
                VALUES (NEW.user_id, v_ach_explorer_id)
                ON CONFLICT DO NOTHING;
            END IF;
        
        ELSIF (TG_OP = 'DELETE') THEN
            UPDATE public.profiles SET total_spots = GREATEST(0, total_spots - 1) WHERE id = OLD.user_id;
            RETURN OLD;
        END IF;
    END IF;

    -- [C] ATUALIZAR XP E NÍVEL NO PROFILE
    IF (v_xp_to_add > 0) THEN
        UPDATE public.profiles
        SET xp_points = xp_points + v_xp_to_add,
            updated_at = NOW()
        WHERE id = NEW.user_id
        RETURNING xp_points INTO v_total_xp;

        -- Lógica de Nível solicitada:
        -- 0-500: L1
        -- 501-2000: L2
        -- 2001-5000: L3
        -- 5001+: L4
        IF (v_total_xp <= 500) THEN v_new_level := 1;
        ELSIF (v_total_xp <= 2000) THEN v_new_level := 2;
        ELSIF (v_total_xp <= 5000) THEN v_new_level := 3;
        ELSE v_new_level := 4;
        END IF;

        IF (v_new_level > 0) THEN
            UPDATE public.profiles SET level = v_new_level WHERE id = NEW.user_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-aplicar triggers com a nova função
CREATE TRIGGER tr_captures_gamification
AFTER INSERT OR DELETE ON public.captures
FOR EACH ROW EXECUTE FUNCTION public.handle_user_activity();

CREATE TRIGGER tr_spots_gamification
AFTER INSERT OR DELETE ON public.spots
FOR EACH ROW EXECUTE FUNCTION public.handle_user_activity();
