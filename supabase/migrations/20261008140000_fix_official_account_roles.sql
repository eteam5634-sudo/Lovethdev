-- Run once in Supabase SQL Editor (Dashboard → SQL).
-- Fixes official LovethDev account roles.

UPDATE public.profiles
SET
  role = 'super_admin',
  full_name = COALESCE(NULLIF(full_name, ''), 'Flora Vibe'),
  email = 'floravibe73@gmail.com'
WHERE lower(email) = 'floravibe73@gmail.com';

UPDATE public.profiles
SET
  role = 'admin',
  full_name = COALESCE(NULLIF(full_name, ''), 'LovethDev Admin'),
  email = 'eteam5634@gmail.com'
WHERE lower(email) = 'eteam5634@gmail.com';

UPDATE public.profiles
SET
  role = 'member',
  full_name = COALESCE(NULLIF(full_name, ''), 'LovethDev Member'),
  email = 'iolawoyin62@gmail.com'
WHERE lower(email) = 'iolawoyin62@gmail.com';

-- Verify:
SELECT email, role, full_name FROM public.profiles
WHERE lower(email) IN (
  'floravibe73@gmail.com',
  'eteam5634@gmail.com',
  'iolawoyin62@gmail.com'
)
ORDER BY role;
