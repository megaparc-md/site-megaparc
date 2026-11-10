import Link from "next/link";
import { ConceptImage, DemoMark } from "@/components/experience";
import { ArtImage } from "@/components/primitives";
import { Icon } from "@/components/ui";
import { availabilityLabel, availabilityOf, getProject, isDemoField, spaceArea } from "@/content/source";
import type { AvailableSpace, SpacePhoto } from "@/data/leasing-inventory";
import { uses as useTaxonomy } from "@/lib/leasing";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * Leasing building blocks shared by the leasing page, Home, project pages and
 * unit pages: photograph, availability chip, card.
 */

export const leasingUi = {
  details: { ro: "Vezi spațiul", ru: "Смотреть помещение", en: "View the space" },
  viewing: { ro: "Solicită o vizionare", ru: "Запросить просмотр", en: "Request a viewing" },
  waitlist: { ro: "Anunțați-mă dacă se eliberează", ru: "Сообщить, если освободится", en: "Tell me if it frees up" },
  floor: { ro: "Etaj", ru: "Этаж", en: "Floor" },
  use: { ro: "Potrivit pentru", ru: "Подходит для", en: "Suits" },
} satisfies Record<string, Localized>;

/** Contact link prefilled for a space (lease subject). */
export function viewingHref(locale: SiteLocale, space: AvailableSpace) {
  return `${localePath(locale, "/contact")}?subject=lease&property=${space.project}&space=${space.id}#occupier`;
}

export function SpaceImage({ photo, space, locale, sizes = "(min-width: 1024px) 33vw, 100vw", priority = false }: { photo: SpacePhoto; space: AvailableSpace; locale: SiteLocale; sizes?: string; priority?: boolean }) {
  if (photo.kind === "use") return <ConceptImage id={photo.id} locale={locale} sizes={sizes} priority={priority} />;
  const project = getProject(photo.slug);
  if (!project?.media) return null;
  return <ArtImage media={project.media} alt={`${project.name} — ${space.unit[locale]}`} sizes={sizes} priority={priority} />;
}

export function AvailabilityChip({ space, locale, className = "" }: { space: AvailableSpace; locale: SiteLocale; className?: string }) {
  const a = availabilityOf(space);
  return (
    <span className={`lx-chip lx-chip--${a.key} ${className}`.trim()}>
      <i aria-hidden="true" />
      {availabilityLabel(space, locale)}
      {a.key === "soon" && isDemoField(space, "availableFrom") ? <DemoMark /> : null}
    </span>
  );
}

export function labelOfUse(key: string, locale: SiteLocale) {
  return useTaxonomy.find((item) => item.key === key)?.label[locale] ?? key;
}

/**
 * Space card. Data attributes feed the client inventory filter
 * (src/components/leasing/inventory.tsx); the card itself is server-rendered.
 */
export function UnitCard({ space, locale, priority = false, compact = false }: { space: AvailableSpace; locale: SiteLocale; priority?: boolean; compact?: boolean }) {
  const project = getProject(space.project)!;
  const href = localePath(locale, `/leasing/${space.id}`);
  const a = availabilityOf(space);
  return (
    <article
      className={`lx-card${compact ? " lx-card--compact" : ""}`}
      data-space={space.id}
      data-use={space.uses.join(" ")}
      data-area={space.area}
      data-area-min={space.areaMin ?? space.area}
      data-project={space.project}
      data-avail={a.key}
    >
      <Link href={href} className="lx-card__media" aria-label={`${project.name} — ${space.unit[locale]}`}>
        <figure className="xp-fig">
          <SpaceImage photo={space.photos[0]} space={space} locale={locale} priority={priority} />
        </figure>
        <AvailabilityChip space={space} locale={locale} className="lx-card__chip" />
      </Link>
      <div className="lx-card__body">
        <p className="lx-card__project">
          <span>{project.name}</span>
          <span>{project.district[locale]}</span>
        </p>
        <p className="lx-card__area">
          {spaceArea(space, locale)}
          {isDemoField(space, "area") && spaceArea(space, locale) ? <DemoMark /> : null}
        </p>
        <h3 className="lx-card__unit">
          <Link href={href}>{space.unit[locale]}</Link>
        </h3>
        <ul className="lx-card__uses" aria-label={leasingUi.use[locale]}>
          {space.uses.map((key) => (
            <li key={key}>{labelOfUse(key, locale)}</li>
          ))}
        </ul>
        {compact ? null : <p className="lx-card__headline">{space.headline[locale]}</p>}
        <div className="lx-card__actions">
          <Link href={href} className="lx-card__more">
            {leasingUi.details[locale]}
            <Icon name="arrow" />
          </Link>
          <span className="lx-card__code">{space.code}</span>
        </div>
      </div>
    </article>
  );
}
