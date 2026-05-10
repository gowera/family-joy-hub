-- Add length constraints to prevent oversized inserts and data flooding
ALTER TABLE public.parents
  ADD CONSTRAINT parents_full_name_length CHECK (char_length(full_name) <= 200),
  ADD CONSTRAINT parents_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT parents_phone_length CHECK (char_length(phone) <= 50),
  ADD CONSTRAINT parents_address_length CHECK (address IS NULL OR char_length(address) <= 500),
  ADD CONSTRAINT parents_emergency_contact_length CHECK (emergency_contact IS NULL OR char_length(emergency_contact) <= 200),
  ADD CONSTRAINT parents_emergency_phone_length CHECK (emergency_phone IS NULL OR char_length(emergency_phone) <= 50);

ALTER TABLE public.children
  ADD CONSTRAINT children_full_name_length CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 200),
  ADD CONSTRAINT children_allergies_length CHECK (allergies IS NULL OR char_length(allergies) <= 2000),
  ADD CONSTRAINT children_medication_length CHECK (medication IS NULL OR char_length(medication) <= 2000),
  ADD CONSTRAINT children_medical_conditions_length CHECK (medical_conditions IS NULL OR char_length(medical_conditions) <= 2000),
  ADD CONSTRAINT children_special_needs_length CHECK (special_needs IS NULL OR char_length(special_needs) <= 2000),
  ADD CONSTRAINT children_dob_reasonable CHECK (date_of_birth >= '1990-01-01' AND date_of_birth <= CURRENT_DATE);

ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_notes_length CHECK (notes IS NULL OR char_length(notes) <= 2000);

ALTER TABLE public.survey_responses
  ADD CONSTRAINT survey_responses_type_check CHECK (survey_type IN ('children','parent','community')),
  ADD CONSTRAINT survey_responses_answers_size CHECK (octet_length(answers::text) <= 50000);

-- Explicit RESTRICTIVE policies to deny anonymous SELECT on sensitive tables
-- (defense-in-depth: even though no permissive anon SELECT policy exists, this makes intent explicit)
CREATE POLICY "Deny anon select on parents"
  ON public.parents AS RESTRICTIVE FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anon select on children"
  ON public.children AS RESTRICTIVE FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anon select on enrollments"
  ON public.enrollments AS RESTRICTIVE FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anon select on payments"
  ON public.payments AS RESTRICTIVE FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anon select on attendance"
  ON public.attendance AS RESTRICTIVE FOR SELECT TO anon USING (false);

-- Document the SECURITY DEFINER role-check function
COMMENT ON FUNCTION public.has_role(uuid, app_role) IS
  'SECURITY DEFINER role check. Safe to expose because it only returns a boolean for the (user_id, role) pair the caller already supplies. RLS policies must always pass auth.uid() for the _user_id argument.';