CREATE POLICY "Public can view survey responses"
ON public.survey_responses FOR SELECT
TO anon
USING (true);