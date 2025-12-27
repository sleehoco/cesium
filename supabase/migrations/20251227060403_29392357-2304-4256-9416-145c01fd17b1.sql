-- Create podcast_episodes table
CREATE TABLE public.podcast_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;

-- Everyone can view episodes
CREATE POLICY "Everyone can view podcast episodes"
ON public.podcast_episodes
FOR SELECT
USING (true);

-- Only admins can manage episodes
CREATE POLICY "Admins can manage podcast episodes"
ON public.podcast_episodes
FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));

-- Create storage bucket for podcasts
INSERT INTO storage.buckets (id, name, public) VALUES ('podcasts', 'podcasts', true);

-- Storage policies for podcast files
CREATE POLICY "Anyone can view podcast files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'podcasts');

CREATE POLICY "Admins can upload podcast files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'podcasts' 
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can delete podcast files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'podcasts' 
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
);