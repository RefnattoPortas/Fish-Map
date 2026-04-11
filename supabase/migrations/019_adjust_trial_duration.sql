-- =============================================
-- MIGRATION 019: Adjust Trial Duration to 45 Days
-- =============================================

-- 1. Atualizar a função handle_new_user para o novo trial de 45 dias
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        username, 
        display_name, 
        avatar_url,
        trial_ends_at,
        is_first_login,
        plan_type,
        subscription_status
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'pescador_' || SUBSTR(NEW.id::TEXT, 1, 6)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Pescador'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
        NOW() + INTERVAL '45 days', -- Ajustado para 45 dias conforme nova definição
        TRUE,
        'free',
        'inactive'
    )
    ON CONFLICT (id) DO UPDATE SET
        trial_ends_at = EXCLUDED.trial_ends_at,
        is_first_login = EXCLUDED.is_first_login;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atualizar bônus de novos pesqueiros (se aplicável, antes era 6 meses)
-- O usuário não mencionou mudar o bônus de pesqueiro parceiro explicitamente na conversa de bônus, 
-- mas a imagem mostra 45 dias para ambos. Vou ajustar para 45 dias também.

CREATE OR REPLACE FUNCTION public.trigger_resort_founder_bonus()
RETURNS TRIGGER AS $$
BEGIN
    NEW.active_until := NOW() + INTERVAL '45 days';
    NEW.is_founder_partner := TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
