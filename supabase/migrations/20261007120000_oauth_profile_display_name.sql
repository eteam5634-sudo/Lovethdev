-- OAuth providers often set "name" instead of "full_name"
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
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'member'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
