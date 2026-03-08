

## Resume Upload RLS Fix

### Root Cause
The `resume` storage bucket is missing INSERT, UPDATE, and DELETE policies on `storage.objects`. Only a SELECT (read) policy exists, so authenticated admin users cannot upload files.

### Plan

**1. Add Storage RLS Policies for Resume Bucket** (database migration)

Add three policies to `storage.objects`:
- **INSERT**: Allow authenticated users to upload to the `resume` bucket
- **UPDATE**: Allow authenticated users to update files in the `resume` bucket  
- **DELETE**: Allow authenticated users to delete files in the `resume` bucket

```sql
CREATE POLICY "Authenticated users can upload resume files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resume' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resume files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resume' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resume files"
ON storage.objects FOR DELETE
USING (bucket_id = 'resume' AND auth.role() = 'authenticated');
```

**2. No code changes needed**

The existing upload flow in `AdminContent.tsx` and the resume page (`Resume.tsx`) are already correctly wired:
- Upload goes to `supabase.storage.from("resume").upload(...)` 
- Public URL is saved to `site_content` table under key `resumeUrl`
- Frontend reads `resumeUrl` from CMS and renders iframe preview + download button
- Empty state already handled ("Resume not available yet")

This is a one-migration fix — no frontend or CMS code changes required.

