-- Tighten public registration policies to avoid fully-permissive RLS checks

-- Parents: require minimally valid fields
DROP POLICY IF EXISTS "Public can register parents" ON public.parents;
CREATE POLICY "Public can register parents"
ON public.parents
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(full_name)) >= 2
  AND length(trim(phone)) >= 6
  AND email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'
);

-- Children: require linkage + basic identity fields
DROP POLICY IF EXISTS "Public can register children" ON public.children;
CREATE POLICY "Public can register children"
ON public.children
FOR INSERT
TO anon, authenticated
WITH CHECK (
  parent_id IS NOT NULL
  AND date_of_birth IS NOT NULL
  AND length(trim(full_name)) >= 2
);

-- Enrollments: require required foreign keys + start date
DROP POLICY IF EXISTS "Public can create enrollments" ON public.enrollments;
CREATE POLICY "Public can create enrollments"
ON public.enrollments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  child_id IS NOT NULL
  AND program_id IS NOT NULL
  AND start_date IS NOT NULL
);
