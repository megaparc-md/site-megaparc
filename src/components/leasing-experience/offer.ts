import { ui } from "@/components/leasing-experience/parts";
import { availabilityLabel, availabilityOf, formatArea, isDemoField, propertyOccupancy, viewingEnabled } from "@/content/source";
import type { LeasingExperience } from "@/data/leasing-experience-model";
import type { AreaLevel, AvailableSpace } from "@/data/leasing-inventory";
import type { OperatingSlug } from "@/data/demo-content";
import { leasingOnRequest } from "@/lib/portfolio";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * THE OFFER OF THE LEASING TEMPLATE (OWNER «LEASING TEMPLATE LOCK», 2026-11-10) — what every scene of the one page system
 * reads about the status: the state, the status line, the hero figure, the two actions and the form mode. Derived, never
 * typed twice: from the published unit record (Moscova 20, Moscova 9) or from the property (Dacia 31 «for lease · area and
 * timing on request», Creangă 78 fully let → waiting list). An unconfirmed marketed area is never shown — the dataset's
 * registered area is the figure, labelled as registered by the hero line.
 */
export type TemplateOffer = {
  state: "now" | "soon" | "reserved" | "request" | "full";
  status: string;
  figure: string;
  /** viewing (true) or waiting-list (false) mode of the actions and the form */
  open: boolean;
  primary: string;
  secondary: { label: string; href: string };
  /** «Moscova 20 · … · 625,7 м²» — the context carried by the action cards and the form */
  unitLabel: string;
  /** level breakdown of the marketed area (Moscova 20) — empty when no confirmed breakdown exists */
  breakdown: AreaLevel[];
  usefulArea: number | null;
  /** the confirmed marketed area, or null */
  area: number | null;
};

// short like every status line (the hero title already says «operating property»; «ДЕЙСТВУЮЩИЙ ОБЪЕКТ · …» did not fit beside a four-digit figure at 390 px)
const fullLine: Localized = { ro: "Ocupat 100 %", ru: "Занят на 100 %", en: "100% occupied" };

export function templateOffer(x: LeasingExperience, unit: AvailableSpace | null, name: string, locale: SiteLocale): TemplateOffer {
  const slug = x.project as OperatingSlug;
  const areaConfirmed = unit ? !isDemoField(unit, "area") : false;
  const area = unit && areaConfirmed ? unit.area : null;
  const figure = formatArea(x.figure ?? area ?? 0, locale);
  const fullyLet = !unit && propertyOccupancy(slug).fullyLet;
  const onRequest = !unit && !fullyLet ? leasingOnRequest[slug] ?? null : null;
  const unitState = unit ? (unit.status === "RESERVED" ? "reserved" : availabilityOf(unit).key) : null;
  const state: TemplateOffer["state"] = unitState ?? (fullyLet ? "full" : "request");
  const status = unit ? availabilityLabel(unit, locale) : fullyLet ? fullLine[locale] : (onRequest ?? fullLine)[locale];
  const open = unit ? viewingEnabled(unit) : !fullyLet;
  const primary = x.cta && (open || fullyLet) ? x.cta.primary[locale] : open ? ui.viewing[locale] : ui.waitlist[locale];
  const secondary = x.cta ? { label: x.cta.secondary.label[locale], href: x.cta.secondary.href } : { label: ui.plansSee[locale], href: "#plans" };
  const what = unit && areaConfirmed ? `${unit.unit[locale]} · ${figure}` : unit ? unit.unit[locale] : status;
  return {
    state,
    status,
    figure,
    open,
    primary,
    secondary,
    unitLabel: `${name} · ${what}`,
    breakdown: unit && areaConfirmed ? unit.breakdown ?? [] : [],
    usefulArea: unit && areaConfirmed ? unit.usefulArea ?? null : null,
    area,
  };
}
