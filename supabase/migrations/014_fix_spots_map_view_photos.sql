-- 1. Ensure new photo columns exist on fishing_resorts
ALTER TABLE public.fishing_resorts 
ADD COLUMN IF NOT EXISTS photos_fish JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS photos_menu JSONB DEFAULT '[]'::jsonb;

-- 2. Update spots_map_view to include missing columns correctly
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
    COALESCE(fr.photos_fish->>0, fr.photos->>0, s.photo_url) AS photo_url,
    CASE WHEN fr.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_resort,
    CASE WHEN fr.is_partner = TRUE OR fr.is_founder_partner = TRUE THEN TRUE ELSE FALSE END AS is_resort_partner,
    fr.id AS resort_id,
    fr.is_active AS resort_is_active,
    fr.opening_hours,
    fr.phone,
    fr.infrastructure AS resort_infrastructure,
    fr.prices AS resort_prices,
    COALESCE(fr.active_highlight, CASE WHEN fr.is_founder_partner THEN '👑 Parceiro Fundador' ELSE NULL END) as resort_active_highlight,
    fr.notice_board AS resort_notice_board,
    COALESCE(fr.photos_fish, fr.photos) AS resort_photos
FROM public.spots s
JOIN public.profiles p ON p.id = s.user_id
LEFT JOIN public.fishing_resorts fr ON fr.spot_id = s.id
WHERE s.is_active = TRUE;
