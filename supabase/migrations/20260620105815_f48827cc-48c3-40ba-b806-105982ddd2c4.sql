CREATE TABLE IF NOT EXISTS public.video_reactions (
  video_id BIGINT NOT NULL,
  fingerprint TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('like','save','share')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (video_id, fingerprint, kind)
);
CREATE INDEX IF NOT EXISTS idx_video_reactions_video ON public.video_reactions(video_id, kind);
GRANT SELECT, INSERT, DELETE ON public.video_reactions TO anon, authenticated;
GRANT ALL ON public.video_reactions TO service_role;
ALTER TABLE public.video_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions_select_all" ON public.video_reactions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reactions_insert_all" ON public.video_reactions FOR INSERT TO anon, authenticated WITH CHECK (length(fingerprint) BETWEEN 6 AND 128);
CREATE POLICY "reactions_delete_own" ON public.video_reactions FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.video_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id BIGINT NOT NULL,
  fingerprint TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_video_comments_video ON public.video_comments(video_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.video_comments TO anon, authenticated;
GRANT ALL ON public.video_comments TO service_role;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select_all" ON public.video_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "comments_insert_all" ON public.video_comments FOR INSERT TO anon, authenticated WITH CHECK (length(fingerprint) BETWEEN 6 AND 128 AND length(author) BETWEEN 1 AND 50 AND length(content) BETWEEN 1 AND 1000);
CREATE POLICY "comments_delete_own" ON public.video_comments FOR DELETE TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.get_video_stats()
RETURNS TABLE (video_id BIGINT, likes BIGINT, saves BIGINT, shares BIGINT, comments BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH r AS (
    SELECT video_id,
      SUM(CASE WHEN kind='like' THEN 1 ELSE 0 END)::bigint AS likes,
      SUM(CASE WHEN kind='save' THEN 1 ELSE 0 END)::bigint AS saves,
      SUM(CASE WHEN kind='share' THEN 1 ELSE 0 END)::bigint AS shares
    FROM public.video_reactions GROUP BY video_id
  ), c AS (
    SELECT video_id, COUNT(*)::bigint AS comments FROM public.video_comments GROUP BY video_id
  )
  SELECT COALESCE(r.video_id, c.video_id) AS video_id,
    COALESCE(r.likes,0), COALESCE(r.saves,0), COALESCE(r.shares,0), COALESCE(c.comments,0)
  FROM r FULL OUTER JOIN c ON r.video_id = c.video_id;
$$;
GRANT EXECUTE ON FUNCTION public.get_video_stats() TO anon, authenticated;