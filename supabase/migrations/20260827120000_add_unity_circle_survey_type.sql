-- Allow Unity Circle participant registrations in the shared survey inbox.
ALTER TABLE public.survey_responses
  DROP CONSTRAINT IF EXISTS survey_responses_type_check;

ALTER TABLE public.survey_responses
  ADD CONSTRAINT survey_responses_type_check
  CHECK (survey_type IN ('children', 'parent', 'community', 'unity_circle'));
