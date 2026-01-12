
-- Create enum for payment methods
CREATE TYPE public.payment_method AS ENUM ('bank_transfer', 'card', 'cash', 'other');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'partial', 'refunded');

-- Create enum for enrollment status
CREATE TYPE public.enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'waitlist');

-- Create parents table
CREATE TABLE public.parents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create children table (without generated age column)
CREATE TABLE public.children (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    allergies TEXT,
    medical_conditions TEXT,
    medication TEXT,
    special_needs TEXT,
    photo_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create programs table
CREATE TABLE public.programs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    session_days TEXT[] NOT NULL,
    session_time TEXT NOT NULL,
    max_capacity INTEGER DEFAULT 20,
    price_per_session DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
    status enrollment_status DEFAULT 'active',
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_date DATE NOT NULL,
    end_date DATE,
    days_attending TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(child_id, program_id)
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_date DATE,
    reference TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE NOT NULL,
    session_date DATE NOT NULL,
    present BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(enrollment_id, session_date)
);

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create app_role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'viewer');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for parents
CREATE POLICY "Staff can view parents"
ON public.parents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'viewer'));

CREATE POLICY "Staff can manage parents"
ON public.parents FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- RLS Policies for children
CREATE POLICY "Staff can view children"
ON public.children FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'viewer'));

CREATE POLICY "Staff can manage children"
ON public.children FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- RLS Policies for programs
CREATE POLICY "Anyone can view programs"
ON public.programs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage programs"
ON public.programs FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Staff can view enrollments"
ON public.enrollments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'viewer'));

CREATE POLICY "Staff can manage enrollments"
ON public.enrollments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- RLS Policies for payments
CREATE POLICY "Staff can view payments"
ON public.payments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'viewer'));

CREATE POLICY "Staff can manage payments"
ON public.payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- RLS Policies for attendance
CREATE POLICY "Staff can view attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'viewer'));

CREATE POLICY "Staff can manage attendance"
ON public.attendance FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view testimonials"
ON public.testimonials FOR SELECT
USING (true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_parents_updated_at
BEFORE UPDATE ON public.parents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the Summer Kids Hub program
INSERT INTO public.programs (name, description, start_date, end_date, session_days, session_time, max_capacity, total_price)
VALUES (
    'Summer Pink and Bleu Kids Hub',
    'The Happiness Comes First Summer Kids Hub provides a safe, inclusive, and joyful environment for children during school holidays. The programme promotes wellbeing, physical activity, creativity, and social connection.',
    '2024-07-01',
    '2024-08-31',
    ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    '10:00 AM - 3:00 PM',
    20,
    50.00
);

-- Insert testimonials
INSERT INTO public.testimonials (category, content, author_name, is_featured) VALUES
('parent', 'My child looked forward to every session. The activities were inclusive, well organised, and made my child feel confident and happy.', NULL, true),
('parent', 'As a parent, I felt reassured knowing my child was in a safe, caring, and structured environment. The staff were approachable and supportive.', NULL, true),
('parent', 'The Pink and Bleu Kids Hub was a lifeline during the summer holidays. It gave my child routine, social interaction, and joy.', NULL, true),
('parent', 'I appreciated how welcoming the space was for families from different backgrounds. My child felt included and valued.', NULL, false),
('child', 'I liked the games and playing with new friends.', NULL, true),
('child', 'The music and movement were my favourite parts.', NULL, true),
('child', 'I felt happy coming here every day.', NULL, true),
('child', 'I liked that everyone was kind and helped each other.', NULL, false),
('community', 'The Summer Pink and Bleu Kids Hub provided a much-needed safe and positive space for children during the school holidays. More sessions like this are needed every summer.', NULL, true),
('community', 'The programme supported community cohesion by bringing together families from different cultures and backgrounds.', NULL, false),
('community', 'Activities were engaging, inclusive, and clearly designed with children''s wellbeing in mind.', NULL, false),
('wellbeing', 'Children showed improved confidence, communication, and emotional expression over the course of the programme.', 'Happiness Comes First Observation', true),
('wellbeing', 'The hub was inclusive of neurodiverse children and children with additional needs.', 'Happiness Comes First Observation', true),
('wellbeing', 'The relaxed and supportive environment helped children feel calm, safe, and able to participate at their own pace.', 'Happiness Comes First Observation', false),
('physical', 'Children were active, engaged, and motivated throughout the sessions.', NULL, true),
('physical', 'Activities were adapted for different age groups, supported by a structured game booklet created to guide play and inclusion.', NULL, false),
('physical', 'The mix of physical play, creative activities, and music kept children focused and excited.', NULL, false),
('physical', 'Parents noticed improved energy levels and positive behaviour at home.', NULL, true),
('organisation', 'Attendance records and safeguarding procedures were clearly in place.', NULL, true),
('organisation', 'Emergency contact details were collected and stored appropriately.', NULL, false),
('organisation', 'Sessions were well structured, with flexibility to meet children''s individual needs.', NULL, false);
