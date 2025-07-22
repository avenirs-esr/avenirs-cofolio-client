/**
 * Returns the email validation status
 * @param email
 * @returns email is valid (true) or invalid (false)
 */
export function isValidEmail (email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return EMAIL_REGEX.test(email)
}
