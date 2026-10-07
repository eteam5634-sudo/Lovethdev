-- Admin cannot list or open Super Admin profile rows.
-- Member + Super Admin can still see all profiles.
-- Image rules remain enforced separately by can_view_profile_image().

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;

CREATE POLICY "profiles_select_authenticated"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Own profile always visible
  auth.uid() = user_id
  OR public.current_user_role() IN ('member', 'super_admin')
  OR (
    public.current_user_role() = 'admin'
    AND role <> 'super_admin'
  )
);
