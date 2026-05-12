/** ISO 3166-1 alpha-2 → regional-indicator flag emoji (e.g. `ch` → 🇨🇭). */
export function countryCodeToFlagEmoji(code: string): string {
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐";
  const BASE = 0x1f1e6; // Regional Indicator Symbol Letter A
  return String.fromCodePoint(
    BASE + cc.charCodeAt(0)! - 0x41,
    BASE + cc.charCodeAt(1)! - 0x41,
  );
}
