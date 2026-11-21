ALTER TABLE public.survey_responses DROP CONSTRAINT IF EXISTS survey_responses_type_check;
ALTER TABLE public.survey_responses ADD CONSTRAINT survey_responses_type_check
  CHECK (survey_type IN ('children','parent','community','unity_circle','unity_feedback'));

CREATE OR REPLACE FUNCTION public.get_public_survey_responses()
 RETURNS TABLE(id uuid, survey_type text, answers jsonb, created_at timestamp with time zone)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT sr.id, sr.survey_type,
    (sr.answers
      - 'additionalComments' - 'comments' - 'comment' - 'notes' - 'note'
      - 'name' - 'fullName' - 'full_name' - 'firstName' - 'lastName'
      - 'email' - 'phone' - 'phoneNumber' - 'contact' - 'contactNumber'
      - 'address' - 'postcode' - 'postCode' - 'zip' - 'city'
      - 'allergiesDetails' - 'medicationDetails'
      - 'parentName' - 'childName' - 'otherDetails' - 'other'
      - 'enjoyedMost' - 'improvements' - 'anythingElse' - 'activitiesOther'
      - 'communityBenefit' - 'contactName' - 'contactInfo'
      - 'childrenAges' - 'supportNeeds' - 'consent'
    ) AS answers, sr.created_at
  FROM public.survey_responses sr
  ORDER BY sr.created_at DESC;
$function$;