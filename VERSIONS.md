# LovethDev versions (for switching + Vercel)

This repository contains **two separate websites**. Use these names when switching and when connecting Vercel.

| Name | Website | Git branch to deploy | Do not use for the other site |
|------|---------|----------------------|-------------------------------|
| **Version 1** | LovethDev Developer Portfolio | `version-1` (same code as `master`) | Do not deploy Playground from here |
| **Version 2** | LovethDev Developer Playground | `version-2` (same code as `main`) | Do not deploy Portfolio from here |

## Keep existing branches

- `master` = Portfolio (unchanged)
- `main` = Playground (unchanged)
- `version-1` / `version-2` are **aliases** so Vercel can clearly copy the right code

## Vercel setup

### Portfolio (Version 1)

1. Create/import a Vercel project named e.g. **LovethDev Portfolio** or **Version 1**
2. Production Branch: **`version-1`** (or `master`)
3. Framework: **Next.js**
4. Env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Playground (Version 2)

1. Create a **separate** Vercel project named e.g. **LovethDev Playground** or **Version 2**
2. Production Branch: **`version-2`** (or `main`)
3. Use that project's own framework/env settings

## Local switch

```bash
# Portfolio (Version 1)
git checkout version-1

# Playground (Version 2)
git checkout version-2
```

After switching, run that project's install/dev commands in the matching local folder if you keep separate clones.
