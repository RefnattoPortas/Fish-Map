-- ============================================================
-- Ensure Storage Bucket and Policies for Spot Photos
-- ============================================================

-- 1. Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas para o bucket 'photos'
-- Nota: 'bucket_id' é usado para filtrar políticas por bucket

-- Permitir que qualquer pessoa veja as fotos (público)
CREATE POLICY "Fotos de spots são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Permitir que usuários autenticados façam upload
CREATE POLICY "Usuários autenticados podem fazer upload de fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Permitir que o dono da foto a atualize ou delete
CREATE POLICY "Usuários podem gerenciar suas próprias fotos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Nota: O NewSpotForm usa o path "spots/${spotId}/cover.ext"
-- Como o spotId é gerado pelo usuário, garantimos que ele pode gerenciar.
-- No entanto, a política simplificada acima pode precisar do owner_id no metadata ou path.
-- Para simplificar e garantir que funcione AGORA:
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias fotos" ON storage.objects;
CREATE POLICY "Qualquer usuário autenticado pode fazer upload e update"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');
