
CREATE POLICY "Authenticated users can upload resume files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resume' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resume files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resume' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resume files"
ON storage.objects FOR DELETE
USING (bucket_id = 'resume' AND auth.role() = 'authenticated');
