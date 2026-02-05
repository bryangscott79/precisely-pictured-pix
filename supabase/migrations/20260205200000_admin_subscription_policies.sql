-- Add admin policies for subscriptions table
-- This allows specific admin users to manage subscriptions

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email IN ('bryangscott79@gmail.com', 'bryan@bryanscott.com')
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (public.is_admin());

-- Allow admins to insert subscriptions
CREATE POLICY "Admins can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (public.is_admin());

-- Allow admins to update subscriptions
CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (public.is_admin());

-- Allow admins to delete subscriptions
CREATE POLICY "Admins can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (public.is_admin());

-- Also allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());
