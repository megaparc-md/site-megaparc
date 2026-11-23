import { contactLinks } from "@/data/demo-content";

/**
 * A request with context — the OWNER-confirmed public e-mail with a subject and a short template the visitor completes in their own
 * mail app (nothing is «sent» by the site; qa-static allows only `subject` / `body` on mailto:receptie@imc.md). One helper for the
 * property pages of «PROPERTY COMMERCIAL EXPERIENCE 2026» (Dacia 31 viewing and offer requests, the Moscova 9 early interest).
 */
const enc = (text: string) => encodeURIComponent(text).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);

export function mailHref(subject: string, body: string[]): string {
  return `${contactLinks.email}?subject=${enc(subject)}&body=${enc(body.join("\r\n"))}`;
}
