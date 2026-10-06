export function getAuthErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error || typeof error !== 'object') return fallback

  const message =
    'message' in error && typeof error.message === 'string' ? error.message.toLowerCase() : ''

  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (message.includes('user not found') || message.includes('no user found')) {
    return 'No account was found with that email. Check the address or create an account.'
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email before signing in. Check your inbox for the confirmation link.'
  }
  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (message.includes('password should be at least')) {
    return 'Password is too short. Use at least 6 characters.'
  }
  if (message.includes('unable to validate email') || message.includes('invalid email')) {
    return 'Please enter a valid email address.'
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (message.includes('expired') || message.includes('invalid') && message.includes('token')) {
    return 'This reset link is invalid or has expired. Request a new one.'
  }
  if (message.includes('same password')) {
    return 'New password must be different from your current password.'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Check your connection and try again.'
  }
  if (
    message.includes('oauth') ||
    message.includes('provider') ||
    message.includes('google') ||
    message.includes('discord')
  ) {
    return 'Social sign-in failed. Please try again or use email and password.'
  }

  if ('message' in error && typeof error.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallback
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export const MIN_PASSWORD_LENGTH = 6
