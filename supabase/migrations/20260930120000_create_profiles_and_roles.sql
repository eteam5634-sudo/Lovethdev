-- LovethDev role-based profiles + storage policies
-- Roles: member | admin | super_admin
-- Default role for new auth users: member

-- ---------------------------------------------------------------------------
-- Profiles table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member', 'admin', 'super_admin')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles (created_at DESC);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_profiles_updated_at();

-- ---------------------------------------------------------------------------
-- Role / ownership helpers (SECURITY DEFINER, fixed search_path, no recursion)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_member()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() = 'member', false);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() = 'admin', false);
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() = 'super_admin', false);
$$;

CREATE OR REPLACE FUNCTION public.is_owner(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND auth.uid() = target_user_id;
$$;

-- Image visibility:
-- member / super_admin → all images
-- admin → member + admin only (NOT super_admin)
CREATE OR REPLACE FUNCTION public.can_view_profile_image(owner_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL THEN false
    WHEN public.is_owner(owner_user_id) THEN true
    WHEN public.current_user_role() IN ('member', 'super_admin') THEN true
    WHEN public.current_user_role() = 'admin' THEN
      COALESCE(
        (SELECT p.role FROM public.profiles p WHERE p.user_id = owner_user_id LIMIT 1),
        'member'
      ) <> 'super_admin'
    ELSE false
  END;
$$;

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_member() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_owner(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_view_profile_image(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_member() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_profile_image(UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- Protect role / user_id from client escalation
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_security_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Force membership for any client-created profile
    IF auth.uid() IS NOT NULL THEN
      NEW.user_id := auth.uid();
      NEW.role := 'member';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'user_id cannot be changed';
    END IF;

    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'profile id cannot be changed';
    END IF;

    -- Block role changes coming from authenticated sessions.
    -- Promote users only via service role / SQL editor / secure admin process.
    IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL THEN
      RAISE EXCEPTION 'Role changes are not permitted from the client';
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_security_fields ON public.profiles;
CREATE TRIGGER profiles_protect_security_fields
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_security_fields();

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup (default role: member)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'member'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Profiles RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role = 'member');

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage bucket (private) + policies
-- Path convention: profile-images/{user_id}/avatar.*
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  false,
  2097152,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = false,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

DROP POLICY IF EXISTS "profile_images_select" ON storage.objects;
CREATE POLICY "profile_images_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND public.can_view_profile_image(((storage.foldername(name))[1])::uuid)
);

DROP POLICY IF EXISTS "profile_images_insert_own" ON storage.objects;
CREATE POLICY "profile_images_insert_own"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "profile_images_update_own" ON storage.objects;
CREATE POLICY "profile_images_update_own"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "profile_images_delete_own" ON storage.objects;
CREATE POLICY "profile_images_delete_own"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ---------------------------------------------------------------------------
-- Safe promotion helper (callable only by service role / SQL console)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.promote_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new_role NOT IN ('member', 'admin', 'super_admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  -- Intentionally does not check auth.uid(): run this with service role / SQL editor only.
  UPDATE public.profiles
  SET role = new_role
  WHERE user_id = target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.promote_user_role(UUID, TEXT) FROM PUBLIC;
-- Do not grant to authenticated / anon.
