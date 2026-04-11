-- =============================================
-- MIGRATION 018: Billing Sync & Subscription Columns
-- =============================================

-- 1. Adicionar colunas de status de assinatura ao perfil
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';

-- 2. Atualizar RLS para permitir leitura pública se necessário (já deve estar aberto para perfis)
-- Mas garantir que apenas o sistema mude estes campos.

-- 3. Criar função para verificar se o usuário é Pro
CREATE OR REPLACE FUNCTION public.is_pro(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id 
        AND (plan_type = 'pro' OR trial_ends_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
