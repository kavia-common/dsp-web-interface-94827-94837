export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export function isStrongPassword(pw) {
  return typeof pw === 'string' && pw.length >= 6;
}
