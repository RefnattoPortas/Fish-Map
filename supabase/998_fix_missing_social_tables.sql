-- ============================================================
-- Fishgada Social Infrastructure (Fix & Missing Tables)
-- Fixes "404 Not Found" errors for resort_follows and resort_posts
-- ============================================================

-- 1. Create missing table: follows (for user-to-user follows)
CREATE TABLE IF NOT EXISTS public.follows (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 2. Create missing table: resort_follows (for spot/lake following)
CREATE TABLE IF NOT EXISTS public.resort_follows (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resort_id         UUID NOT NULL REFERENCES public.fishing_resorts(id) ON DELETE CASCADE,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resort_id)
);

-- 3. Create missing table: resort_posts (for social feed updates from resorts)
CREATE TABLE IF NOT EXISTS public.resort_posts (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resort_id         UUID NOT NULL REFERENCES public.fishing_resorts(id) ON DELETE CASCADE,
    content           TEXT NOT NULL,
    photo_url         TEXT,
    type              TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'event', 'promotion')),
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS and setup policies
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resort_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resort_posts ENABLE ROW LEVEL SECURITY;

-- Follows Policies
DROP POLICY IF EXISTS "Seguidores visíveis a todos" ON public.follows;
CREATE POLICY "Seguidores visíveis a todos" ON public.follows FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Usuários podem seguir outros" ON public.follows;
CREATE POLICY "Usuários podem seguir outros" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
DROP POLICY IF EXISTS "Usuários podem parar de seguir" ON public.follows;
CREATE POLICY "Usuários podem parar de seguir" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Resort Follows Policies
DROP POLICY IF EXISTS "Resort follows visíveis a todos" ON public.resort_follows;
CREATE POLICY "Resort follows visíveis a todos" ON public.resort_follows FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Usuários podem seguir resorts" ON public.resort_follows;
CREATE POLICY "Usuários podem seguir resorts" ON public.resort_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Usuários podem parar de seguir resorts" ON public.resort_follows;
CREATE POLICY "Usuários podem parar de seguir resorts" ON public.resort_follows FOR DELETE USING (auth.uid() = user_id);

-- Resort Posts Policies
DROP POLICY IF EXISTS "Posts de resorts visíveis a todos" ON public.resort_posts;
CREATE POLICY "Posts de resorts visíveis a todos" ON public.resort_posts FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Apenas donos de resort criam posts" ON public.resort_posts;
CREATE POLICY "Apenas donos de resort criam posts" ON public.resort_posts FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.fishing_resorts fr
        WHERE fr.id = resort_posts.resort_id AND fr.owner_id = auth.uid()
    )
);
