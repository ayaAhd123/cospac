/**
 * src/lib/validation.ts
 * ─────────────────────────────────────────────────────────────────
 * All form-field validators and output sanitisers for the COSPAC
 * order form.  Security best-practices applied throughout:
 *   • Allowlist-based validation (not blocklist)
 *   • Unicode-aware name check supports Arabic & accented French names
 *   • HTML-escape used on all text fields before storage/display
 *   • CSRF token stored in sessionStorage for single-page protection
 * ─────────────────────────────────────────────────────────────────
 */

// ── Name ─────────────────────────────────────────────────────────

/**
 * Accept letters from any script (Arabic, Latin, accented) plus
 * spaces, hyphens and apostrophes.  Rejects digits and special chars.
 *
 * Uses Unicode property escape `\p{L}` (requires ES2018 + "u" flag).
 */
export const nameRegex = /^[\p{L}\s'\-]+$/u;

export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && nameRegex.test(trimmed);
}

// ── Phone ────────────────────────────────────────────────────────

/**
 * Valid Moroccan phone formats (spaces/dashes stripped before test):
 *   +212 6XXXXXXXX   +212 7XXXXXXXX
 *    212 6XXXXXXXX   212 7XXXXXXXX
 *    06XXXXXXXX       07XXXXXXXX
 */
export const moroccanPhoneRegex = /^(?:\+?212|0)[67]\d{8}$/;

export function validatePhone(phone: string): boolean {
  return moroccanPhoneRegex.test(phone.replace(/[\s\-]/g, ""));
}

// ── Address ──────────────────────────────────────────────────────

/**
 * Minimal address validation: non-empty, ≥ 6 chars, < 200 chars.
 * No structural constraint so customers can write freely.
 */
export function validateAddress(address: string): boolean {
  const trimmed = address.trim();
  return trimmed.length >= 6 && trimmed.length < 200;
}

// ── Sanitisation ─────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS when rendering
 * user-supplied strings anywhere in the DOM.
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitise notes field: strip null bytes and HTML-escape the result.
 * Also uses DOMPurify when available for belt-and-suspenders XSS defence.
 */
export function sanitizeNotes(notes: string): string {
  // Remove null bytes / control characters that could confuse parsers.
  let clean = notes.replace(/\0/g, "").replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // DOMPurify (loaded via CDN in index.html) for HTML sanitisation.
  // @ts-ignore – may be loaded globally.
  if (typeof DOMPurify !== "undefined") clean = DOMPurify.sanitize(clean);
  return sanitizeHtml(clean);
}

// ── CSRF ─────────────────────────────────────────────────────────

/**
 * Return (or generate and store) a 32-hex-char CSRF token bound to
 * the current browser session.  Include this in every form submission
 * and verify server-side if you add a backend later.
 */
export function getCsrfToken(): string {
  const KEY = "csrfToken";
  let token = sessionStorage.getItem(KEY);
  if (!token) {
    token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    sessionStorage.setItem(KEY, token);
  }
  return token;
}

// ── Hashing ──────────────────────────────────────────────────────

/**
 * Hash a string with SHA-256 (SubtleCrypto) and return a hex digest.
 * Use for sensitive data that must never be stored in plain text.
 */
export async function hashString(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Rate-limit helper ────────────────────────────────────────────

const _lastSubmit: Record<string, number> = {};

/**
 * Simple in-memory rate limiter for form submissions.
 * Returns true if the action is allowed (>= minIntervalMs since last call).
 */
export function checkRateLimit(key: string, minIntervalMs = 15_000): boolean {
  const now = Date.now();
  if (_lastSubmit[key] && now - _lastSubmit[key] < minIntervalMs) return false;
  _lastSubmit[key] = now;
  return true;
}
