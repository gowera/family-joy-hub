DROP POLICY IF EXISTS reactions_delete_own ON public.video_reactions;
DROP POLICY IF EXISTS reactions_select_all ON public.video_reactions;
DROP POLICY IF EXISTS comments_delete_own ON public.video_comments;
DROP POLICY IF EXISTS comments_select_all ON public.video_comments;
DROP POLICY IF EXISTS "Anyone can view testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can submit survey responses" ON public.survey_responses;

CREATE POLICY "Staff can view testimonials" ON public.testimonials FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'viewer'));

CREATE OR REPLACE FUNCTION public.get_my_video_reactions(_fingerprint text)
RETURNS TABLE(video_id bigint, kind text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT video_id, kind FROM public.video_reactions
  WHERE length(_fingerprint) BETWEEN 6 AND 128 AND fingerprint = _fingerprint
$$;

CREATE OR REPLACE FUNCTION public.remove_video_reaction(_video_id bigint, _fingerprint text, _kind text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.video_reactions
  WHERE video_id = _video_id AND fingerprint = _fingerprint AND kind = _kind
    AND length(_fingerprint) BETWEEN 6 AND 128
$$;

CREATE OR REPLACE FUNCTION public.get_video_comments(_video_id bigint)
RETURNS TABLE(id uuid, video_id bigint, author text, content text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, video_id, author, content, created_at FROM public.video_comments
  WHERE video_id = _video_id ORDER BY created_at DESC LIMIT 500
$$;

GRANT EXECUTE ON FUNCTION public.get_my_video_reactions(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.remove_video_reaction(bigint, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_video_comments(bigint) TO anon, authenticated;