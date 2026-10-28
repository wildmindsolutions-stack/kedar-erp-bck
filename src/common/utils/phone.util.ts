/** Normalize to 10-digit Indian mobile (strips +91 / leading 0 / spaces). */
export function normalizePhone(phone: string): string {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}
