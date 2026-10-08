/**
 * One-off: promote floravibe73@gmail.com to super_admin (and ensure other roles).
 * Uses SUPABASE_SERVICE_ROLE_KEY from .env.local only.
 *
 *   node scripts/fix-official-roles.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(resolve(process.cwd(), '.env.local'))
loadEnvFile(resolve(process.cwd(), '.env'))

const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const assignments = [
  { email: 'iolawoyin62@gmail.com', role: 'member', fullName: 'LovethDev Member' },
  { email: 'eteam5634@gmail.com', role: 'admin', fullName: 'LovethDev Admin' },
  { email: 'floravibe73@gmail.com', role: 'super_admin', fullName: 'Flora Vibe' },
]

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  for (const account of assignments) {
    const { data: rows, error } = await admin
      .from('profiles')
      .select('user_id, email, role, full_name')
      .ilike('email', account.email)
      .limit(1)

    if (error) throw error
    const profile = rows?.[0]
    if (!profile) {
      console.log(`MISSING profile for ${account.email} — sign in once first, then re-run.`)
      continue
    }

    await admin
      .from('profiles')
      .update({ full_name: account.fullName, email: account.email })
      .eq('user_id', profile.user_id)

    const { error: roleError } = await admin.rpc('promote_user_role', {
      target_user_id: profile.user_id,
      new_role: account.role,
    })
    if (roleError) throw roleError

    console.log(`OK  ${account.email}  ${profile.role} → ${account.role}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
