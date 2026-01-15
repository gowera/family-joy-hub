-- Allow public to insert parents (for registration forms)
CREATE POLICY "Public can register parents" 
ON public.parents 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow public to insert children (for registration forms)
CREATE POLICY "Public can register children" 
ON public.children 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow public to insert enrollments (for registration forms)
CREATE POLICY "Public can create enrollments" 
ON public.enrollments 
FOR INSERT 
TO anon
WITH CHECK (true);