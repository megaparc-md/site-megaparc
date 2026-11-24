import { ViewTransition, type ReactNode } from "react";
import { Assistant } from "@/components/assistant/assistant";
import { ExperienceMotion } from "@/components/experience-motion";
import { PreviewMarker } from "@/components/experience";
import { MotionController } from "@/components/motion-controller";
import { DatedDownloadNames } from "@/components/leasing-toolkit/dated-downloads";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { SiteLocale } from "@/lib/site-data";

/**
 * Global shell: progress signature, header, page content, footer.
 * `overlay`: the header sits over the first movement and turns solid after it
 * (About, Home). `footerStatement={false}` drops the footer's WE BUILD THE FUTURE
 * where the page itself closes on it. `experience` mounts the experience motion
 * layer (sequences, sticky scenes, progress lines).
 *
 * Route transition: the page content enters / leaves through a restrained
 * view transition (crossfade + short rise, globals.css "page" class); the header
 * is anchored. Browsers without the View Transitions API navigate normally;
 * prefers-reduced-motion removes it.
 */
export function PageShell({
  locale,
  variant = "solid",
  footerStatement = true,
  experience = false,
  children,
  mainClassName,
}: {
  locale: SiteLocale;
  variant?: "overlay" | "solid";
  footerStatement?: boolean;
  experience?: boolean;
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className={`site site--${variant}`} lang={locale}>
      <MotionController />
      {experience ? <ExperienceMotion /> : null}
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader locale={locale} variant={variant} />
      <ViewTransition enter="page" exit="page" default="none">
        <main id="top" className={mainClassName}>{children}</main>
      </ViewTransition>
      <SiteFooter locale={locale} statement={footerStatement} />
      <PreviewMarker locale={locale} />
      {/* the commercial assistant — OWNER preview only: the production edition resolves it to an empty stub (next.config.ts) */}
      <Assistant locale={locale} />
      {/* last in the shell: it renders nothing, and the ids of the header menus above stay as they were */}
      <DatedDownloadNames />
    </div>
  );
}
