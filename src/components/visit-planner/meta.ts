import type { Metadata } from "next";
import { getProject } from "@/content/source";
import { visitProperties, visitRoute } from "@/data/visit-planner";
import { buildMetadata } from "@/lib/seo";
import type { SiteLocale } from "@/lib/site-data";

/**
 * VISIT PLANNER — the routes of the planner (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1): one page per property of the
 * registry and language; noindex while the planner is an OWNER preview (and absent from the sitemap and the production artifact).
 */
export const visitParams = () => visitProperties.map((property) => ({ property }));

export function visitMetadata(locale: SiteLocale, slug: string): Metadata {
  const name = getProject(slug)?.name ?? "MEGAPARC";
  return buildMetadata(locale, visitRoute(slug), {
    title: { ro: `${name} — planificați o vizionare · MEGAPARC`, ru: `${name} — запись на просмотр · MEGAPARC`, en: `${name} — plan a viewing · MEGAPARC` },
    description: {
      ro: `Alegeți ziua și ora vizionării personale a proprietății ${name}. Cererea este confirmată de managerul MEGAPARC.`,
      ru: `Выберите день и время персонального просмотра объекта ${name}. Запрос подтверждает менеджер MEGAPARC.`,
      en: `Choose the day and time of a private viewing of ${name}. A MEGAPARC manager confirms the request.`,
    },
  }, { noindex: true });
}
