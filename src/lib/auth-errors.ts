export function getAuthErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";

  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password. If you used Google/Discord for this Gmail, use that button or Forgot Password to set a password.";
  }
  if (lower.includes("user not found") || lower.includes("no user found")) {
    return "No account was found with that email. Check the address or create an account.";
  }
  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("password should be at least") || lower.includes("weak")) {
    return "Password is too weak. Use at least 8 characters.";
  }
  if (lower.includes("unable to validate email") || lower.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (
    lower.includes("expired") ||
    lower.includes("otp") ||
    lower.includes("token") ||
    lower.includes("recovery")
  ) {
    return "This password reset link is invalid or has expired. Request a new one.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Network error. Check your connection and try again.";
  }
  if (
    lower.includes("oauth") ||
    lower.includes("provider") ||
    lower.includes("google") ||
    lower.includes("discord")
  ) {
    return "Social sign-in failed. Please try again or use email and password.";
  }

  return message;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export const MIN_PASSWORD_LENGTH = 6;
