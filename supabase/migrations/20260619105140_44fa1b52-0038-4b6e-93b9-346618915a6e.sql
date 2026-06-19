
-- 1) SURVEY RESPONSES: remove public SELECT, expose a safe aggregated/anonymized function
DROP POLICY IF EXISTS "Public can view survey responses" ON public.survey_responses;
REVOKE SELECT ON public.survey_responses FROM anon;

-- Restrictive deny for anon SELECT (defense in depth)
DROP POLICY IF EXISTS "Deny anon select on survey_responses" ON public.survey_responses;
CREATE POLICY "Deny anon select on survey_responses"
ON public.survey_responses AS RESTRICTIVE
FOR SELECT TO anon USING (false);

-- Function returns rows with answers stripped of free-text/PII-ish keys
CREATE OR REPLACE FUNCTION public.get_public_survey_responses()
RETURNS TABLE (
  id uuid,
  survey_type text,
  answers jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    sr.id,
    sr.survey_type,
    -- Strip any free-text / identifier-ish keys so only categorical aggregates remain
    (sr.answers
      - 'additionalComments' - 'comments' - 'comment' - 'notes' - 'note'
      - 'name' - 'fullName' - 'full_name' - 'firstName' - 'lastName'
      - 'email' - 'phone' - 'phoneNumber' - 'contact' - 'contactNumber'
      - 'address' - 'postcode' - 'postCode' - 'zip' - 'city'
      - 'allergiesDetails' - 'medicationDetails'
      - 'parentName' - 'childName' - 'otherDetails' - 'other'
    ) AS answers,
    sr.created_at
  FROM public.survey_responses sr
  ORDER BY sr.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_public_survey_responses() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_survey_responses() TO anon, authenticated;

-- 2) Remove anon INSERT on parents / children / enrollments
DROP POLICY IF EXISTS "Public can register parents" ON public.parents;
DROP POLICY IF EXISTS "Public can register children" ON public.children;
DROP POLICY IF EXISTS "Public can create enrollments" ON public.enrollments;
REVOKE INSERT ON public.parents FROM anon;
REVOKE INSERT ON public.children FROM anon;
REVOKE INSERT ON public.enrollments FROM anon;
