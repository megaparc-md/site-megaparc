import { AssistantLauncher } from "@/components/assistant/assistant-launcher";
import "@/components/assistant/assistant.css";
import type { AssistantData } from "@/components/assistant/types";
import { projectState } from "@/components/r3";
import { availabilityCopy, spacesFor } from "@/content/source";
import { company, contactLinks } from "@/data/demo-content";
import { landAssetFor, moduleVisible } from "@/data/land/registry";
import { m20Commercial } from "@/data/moscova-20-commercial";
import { itemHref, landPortfolio, leasingProjects, portfolioCategories } from "@/lib/portfolio";
import { isProductionEdition, localePath, type SiteLocale } from "@/lib/site-data";

/**
 * MEGAPARC COMMERCIAL ASSISTANT — the server half (OWNER «INTELLIGENT COMMERCIAL ASSISTANT», 2026-11-24).
 *
 * Everything the assistant may state about the portfolio is computed HERE, on the server, from the same content source the
 * pages read (src/content/source.ts — the leasing register and the portfolio structure; WordPress later): which buildings
 * have an active offer, their status line, the published area, which buildings are fully let, the land plots, the three
 * OWNER-confirmed contacts. Nothing is typed a second time, so:
 *   — a unit that becomes LEASED leaves the assistant's offers in the same build;
 *   — a fully let building (Moscova 9, Creangă 78 today) is never offered for lease (and NEVER_OFFERED guards the two by name);
 *   — no rate, yield, term or availability exists in the assistant that the site does not already publish.
 *
 * Both editions render it since the OWNER «COMMERCIAL ASSISTANT · PRODUCTION UI RELEASE» (2026-11-25): the interface in an
 * explicitly marked test mode — nothing is sent to a server; a real enquiry is a letter the visitor sends from their own mail
 * app (mailto:) or a telephone call. The live chat (live.ts) stays off until its server is connected.
 */
/**
 * OWNER «INTELLIGENT COMMERCIAL ASSISTANT» (2026-11-24): «Не предлагать аренду полностью сданных Moscova 9 и Creangă 78.»
 * The register already says so — both are fully let since the OWNER correction of 2026-11-23 — and the assistant derives its
 * offers from the register. This list is a guard on top of it, not a second register: it can only REMOVE a building from the
 * offers. On a build whose register is older than the correction (an OWNER-preview merge of an earlier branch) the assistant
 * still never offers them. When the OWNER decides to lease space in one of them again, its slug leaves this list.
 */
const NEVER_OFFERED: ReadonlySet<string> = new Set(["moscova-9", "creanga-78"]);

/** the project calculator of a land page is published only where the page itself shows it (the same rule: registry.moduleVisible) */
function landModel(page: string | null): boolean {
  const asset = page ? landAssetFor(page) : null;
  return asset ? moduleVisible(asset, "model", !isProductionEdition) : false;
}

export function assistantData(locale: SiteLocale): AssistantData {
  const leasing = leasingProjects().map((project) => {
    const state = projectState(project, locale);
    // a building of the guard reads «leased» whatever the register of this build says
    return { project, state: NEVER_OFFERED.has(project.slug) && state.tone !== "full" ? { text: availabilityCopy.leased[locale], tone: "full" as const } : state };
  });
  const landAnchor = portfolioCategories.find((category) => category.key === "land")?.anchor ?? "land";
  return {
    locale,
    offers: leasing
      .filter(({ state }) => state.tone === "now" || state.tone === "soon")
      .map(({ project, state }) => {
        const units = spacesFor(project.slug);
        return {
          slug: project.slug,
          name: project.name,
          href: localePath(locale, `/projects/${project.slug}`),
          status: state.text,
          tone: state.tone as "now" | "soon",
          unitArea: units.length ? units[0].area : null,
          unitIds: units.map((unit) => unit.id),
        };
      }),
    fullyLet: leasing
      .filter(({ state }) => state.tone === "full")
      .map(({ project, state }) => ({ slug: project.slug, name: project.name, href: localePath(locale, `/projects/${project.slug}`), status: state.text, unitIds: spacesFor(project.slug).map((unit) => unit.id) })),
    land: landPortfolio.map((plot) => ({ slug: plot.slug, name: plot.name[locale], area: plot.area?.[locale] ?? null, href: itemHref(locale, plot.page, landAnchor), hasPage: Boolean(plot.page), model: landModel(plot.page) })),
    contacts: {
      email: company.email.value[locale],
      emailHref: contactLinks.email,
      mobile: company.mobile.value[locale],
      mobileHref: contactLinks.mobile,
      landline: company.landline.value[locale],
      landlineHref: contactLinks.landline,
    },
    m20Offer: m20Commercial.offer.published ? m20Commercial.offer.file[locale] : null,
  };
}

export function Assistant({ locale }: { locale: SiteLocale }) {
  return <AssistantLauncher data={assistantData(locale)} />;
}
