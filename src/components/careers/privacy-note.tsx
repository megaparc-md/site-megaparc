import Link from "next/link";
import { privacyCopy, showPrivacy } from "@/lib/candidate-privacy";
import { localePath, type SiteLocale } from "@/lib/site-data";

/**
 * The short line beside every way of applying (Codex P1-02): the apply buttons, the HR address with its copy button and — `short` —
 * the phone bar. It informs; it asks for nothing (no checkbox, no «I agree»). Rendered only where the notice itself is shown:
 * production once the lawyer approved it, the OWNER preview always (it links to the draft).
 */
export function PrivacyNote({ locale, short = false, className = "" }: { locale: SiteLocale; short?: boolean; className?: string }) {
  if (!showPrivacy) return null;
  const href = localePath(locale, "/careers/privacy");
  if (short) return <Link className={`cr-privacy-note cr-privacy-note--short ${className}`.trim()} href={href} data-cr-privacy-note>{privacyCopy.short[locale]}</Link>;
  const [before, after = ""] = privacyCopy.note[locale].split("{link}");
  return (
    <p className={`cr-privacy-note ${className}`.trim()} data-cr-privacy-note>
      {before}<Link href={href}>{privacyCopy.noteLink[locale]}</Link>{after}
    </p>
  );
}
