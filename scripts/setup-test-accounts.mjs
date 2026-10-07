/**
 * Secure server-side setup for LovethDev test accounts.
 *
 * NEVER run this in the browser.
 * NEVER commit real passwords or the service-role key.
 *
 * Prerequisites:
 * 1. Run supabase/migrations/20260930120000_create_profiles_and_roles.sql
 *    in the Supabase SQL Editor for your shared project.
 * 2. Put secrets only in .env.local (gitignored).
 *
 * Usage (from either website root):
 *   npm run setup:test-accounts
 *   # or: node scripts/setup-test-accounts.mjs
 *
 * Required in .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY
 *   TEST_MEMBER_PASSWORD
 *   TEST_ADMIN_PASSWORD
 *   TEST_SUPER_ADMIN_PASSWORD
 *
 * Emails default to the official LovethDev test accounts unless overridden.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return
  const text = readFileSync(filePath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
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

/** Official LovethDev test accounts (emails only — passwords from .env.local). */
const accounts = [
  {
    role: 'member',
    email: process.env.TEST_MEMBER_EMAIL || 'iolawoyin62@gmail.com',
    password: process.env.TEST_MEMBER_PASSWORD,
    fullName: process.env.TEST_MEMBER_NAME || 'LovethDev Member',
  },
  {
    role: 'admin',
    email: process.env.TEST_ADMIN_EMAIL || 'eteam5634@gmail.com',
    password: process.env.TEST_ADMIN_PASSWORD,
    fullName: process.env.TEST_ADMIN_NAME || 'LovethDev Admin',
  },
  {
    role: 'super_admin',
    email: process.env.TEST_SUPER_ADMIN_EMAIL || 'floravibe73@gmail.com',
    password: process.env.TEST_SUPER_ADMIN_PASSWORD,
    fullName: process.env.TEST_SUPER_ADMIN_NAME || 'Flora Vibe',
  },
]

function fail(message) {
  console.error(`\nERROR: ${message}\n`)
  process.exit(1)
}

if (!url) fail('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
if (!serviceRoleKey) {
  fail(
    'Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local (server-only). Never expose it to the browser.',
  )
}

for (const account of accounts) {
  const label =
    account.role === 'super_admin' ? 'SUPER_ADMIN' : account.role.toUpperCase()
  if (!account.password) {
    fail(
      `Missing password for ${account.role} (${account.email}). Set TEST_${label}_PASSWORD in .env.local`,
    )
  }
  if (account.password.length < 8) {
    fail(`Password for ${account.role} must be at least 8 characters.`)
  }
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function ensureUser(account) {
  const { data: listed, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  })
  if (listError) throw listError

  const existing = listed.users.find(
    (user) => user.email?.toLowerCase() === account.email.toLowerCase(),
  )

  if (existing) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.fullName, name: account.fullName },
    })
    if (updateError) throw updateError
    return existing.id
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { full_name: account.fullName, name: account.fullName },
  })
  if (error) throw error
  return data.user.id
}

async function ensureProfile(userId, account) {
  const { data: profile, error } = await admin
    .from('profiles')
    .select('id, user_id, role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error

  if (!profile) {
    const { error: insertError } = await admin.from('profiles').insert({
      user_id: userId,
      full_name: account.fullName,
      email: account.email,
      role: 'member',
      bio: `${account.role} test account for LovethDev.`,
    })
    if (insertError) throw insertError
  } else {
    const { error: metaError } = await admin
      .from('profiles')
      .update({
        full_name: account.fullName,
        email: account.email,
        bio: `${account.role} test account for LovethDev.`,
      })
      .eq('user_id', userId)
    if (metaError) throw metaError
  }

  // Preferred RPC from shared migration (service role; not granted to browser)
  let roleError = (
    await admin.rpc('promote_user_role', {
      target_user_id: userId,
      new_role: account.role,
    })
  ).error

  if (roleError) {
    roleError = (
      await admin.rpc('set_user_role', {
        target_user_id: userId,
        new_role: account.role,
      })
    ).error
  }

  if (roleError) {
    throw new Error(
      `Failed to set role "${account.role}" for ${account.email}: ${roleError.message}. Did you run supabase/migrations/20260930120000_create_profiles_and_roles.sql?`,
    )
  }
}

async function main() {
  console.log('Setting up LovethDev test accounts (server-side only)...')
  console.log(`Supabase URL: ${url}`)
  console.log('Accounts:')
  console.log('  member      → iolawoyin62@gmail.com (override with TEST_MEMBER_EMAIL)')
  console.log('  admin       → eteam5634@gmail.com (override with TEST_ADMIN_EMAIL)')
  console.log('  super_admin → floravibe73@gmail.com (override with TEST_SUPER_ADMIN_EMAIL)')

  for (const account of accounts) {
    process.stdout.write(`- ${account.role} (${account.email}) ... `)
    const userId = await ensureUser(account)
    await ensureProfile(userId, account)
    console.log('OK')
  }

  console.log('\nDone. Roles are stored in public.profiles.')
  console.log('Sign in on Playground/Portfolio with the passwords from .env.local.')
  console.log('Do not commit .env.local or share the service-role key.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
