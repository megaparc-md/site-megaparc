import Link from "next/link";
import { ArtImage } from "@/components/primitives";
import { Button, Icon } from "@/components/ui";
import { availabilityLabel, formatArea, getProject, publicSpaces, sortSpaces } from "@/content/source";
import { localePath, publicAsset, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * THE TWO MEGAPARC ENGINES — two large editorial portals right after the hero (OWNER "OVERNIGHT RELEASE",
 * 2026-11-09 §2 / §4): 01 investment & partnership (an asset or an opportunity) · 02 leasing of MEGAPARC's own
 * property (commercial space). Real photographs only; the leasing portal lists the offer derived from the status
 * model (never typed twice).
 */
const N = " ";
const copy = {
  kicker: { ro: "Două direcții MEGAPARC", ru: "Два направления MEGAPARC", en: "Two MEGAPARC directions" },
  lead: {
    ro: "MEGAPARC cumpără și dezvoltă imobiliare și terenuri — și închiriază spații în clădirile proprii.",
    ru: `MEGAPARC покупает и${N}развивает недвижимость и${N}землю — и${N}сдаёт в${N}аренду площади в${N}собственных зданиях.`,
    en: "MEGAPARC buys and develops real estate and land — and leases space in its own buildings.",
  },
  investLabel: { ro: "01 · Investiții și parteneriat", ru: "01 · Инвестиции и партнёрство", en: "01 · Investment and partnership" },
  investTitle: { ro: "Un imobil, un teren sau un proiect comun.", ru: `Объект, земля или совместный проект.`, en: "A property, land or a joint project." },
  investText: {
    ro: "Cumpărăm imobiliare comerciale și terenuri, dezvoltăm și reconstruim, analizăm parteneriate — acolo unde putem crea valoare prin investiție, dezvoltare și exploatare ulterioară.",
    ru: `Покупаем коммерческую недвижимость и${N}землю, развиваем и${N}реконструируем, рассматриваем партнёрства — там, где можем создать стоимость через инвестиции, развитие и${N}последующую эксплуатацию.`,
    en: "We buy commercial real estate and land, develop and redevelop, and consider partnerships — where we can create value through investment, development and subsequent operation.",
  },
  investCta: { ro: "Propuneți un imobil sau un teren", ru: "Предложить объект или землю", en: "Offer a property or land" },
  investLink: { ro: "Parteneriat investițional", ru: "Инвестиционное партнёрство", en: "Investment partnership" },
  leaseLabel: { ro: "02 · Închirierea obiectelor proprii", ru: "02 · Аренда собственных объектов", en: "02 · Leasing our own properties" },
  leaseTitle: { ro: "Spații pentru afacerea dumneavoastră.", ru: `Помещения для${N}вашего бизнеса.`, en: "Space for your business." },
  leaseText: {
    ro: "Închiriem direct spații în clădirile proprii — iar înainte de semnarea contractului verificăm împreună fezabilitatea tehnică a formatului dumneavoastră.",
    ru: `Сдаём площади в${N}собственных зданиях напрямую — а${N}до${N}подписания договора вместе с${N}вами проверяем техническую реализуемость вашего формата.`,
    en: "We lease space in our own buildings directly — and before signing, we check the technical feasibility of your format together with you.",
  },
  leaseCta: { ro: "Spații disponibile", ru: "Свободные помещения", en: "Available spaces" },
  leaseLink: { ro: "Verificați spațiul pentru afacerea dumneavoastră", ru: "Проверить помещение под свой бизнес", en: "Check the space for your business" },
  offer: { ro: "Oferta acum", ru: "Предложение сейчас", en: "On offer now" },
} satisfies Record<string, Localized>;

export function HomePortals({ locale }: { locale: SiteLocale }) {
  const p = (path: string) => localePath(locale, path);
  // real photographs, each at its native 4:3 crop so no facade is cut: Dacia 31 (an owned building in its city) · the Moscova 20 facade (available now, OWNER photo)
  const invest = getProject("dacia-31");
  // the approved Moscova 20 facade crop without the neighbouring building's lettering (4:3, as in the Moscova 20 hero)
  const m20 = publicAsset("/assets/leasing/moscova-20/m20-facade-phone.webp");
  const lease = { media: { src: m20, card: m20, wide: m20, portrait: m20, mobile: publicAsset("/assets/leasing/moscova-20/m20-facade-phone.webp"), position: "50% 50%" } };
  const offer = sortSpaces(publicSpaces).slice(0, 3).map((space) => ({ space, project: getProject(space.project)! }));
  return (
    <section className="hp2" id="directions" aria-label={copy.kicker[locale]}>
      <div className="xp-shell">
        <div className="hp2__head" data-reveal>
          <p className="pm-kicker">{copy.kicker[locale]}</p>
          <p className="hp2__lead">{copy.lead[locale]}</p>
        </div>
        <div className="hp2__grid">
          <article className="hp2-portal" data-reveal>
            {invest?.media ? (
              <Link href={p("/offer")} className="hp2-portal__media al-hover" tabIndex={-1} aria-hidden="true">
                <ArtImage media={invest.media} variant="card" alt="" sizes="(min-width: 1024px) 46vw, 100vw" />
              </Link>
            ) : null}
            <div className="hp2-portal__body">
              <p className="hp2-portal__label">{copy.investLabel[locale]}</p>
              <h2 className="hp2-portal__title">{copy.investTitle[locale]}</h2>
              <p className="hp2-portal__text">{copy.investText[locale]}</p>
              <div className="hp2-portal__actions">
                <Button href={p("/offer")}>{copy.investCta[locale]}</Button>
                <Link className="pm-link" href={p("/partnership")}>{copy.investLink[locale]}<Icon /></Link>
              </div>
            </div>
          </article>
          <article className="hp2-portal" data-reveal>
            {lease.media ? (
              <Link href={`${p("/leasing")}#available`} className="hp2-portal__media al-hover" tabIndex={-1} aria-hidden="true">
                <ArtImage media={lease.media} variant="card" alt="" sizes="(min-width: 1024px) 46vw, 100vw" />
              </Link>
            ) : null}
            <div className="hp2-portal__body">
              <p className="hp2-portal__label">{copy.leaseLabel[locale]}</p>
              <h2 className="hp2-portal__title">{copy.leaseTitle[locale]}</h2>
              <p className="hp2-portal__text">{copy.leaseText[locale]}</p>
              {offer.length ? (
                <dl className="hp2-offer" aria-label={copy.offer[locale]}>
                  {offer.map(({ space, project }) => (
                    <div key={space.id}>
                      <dt><Link href={p(`/projects/${project.slug}`)}>{project.name}</Link></dt>
                      <dd>{formatArea(space.area, locale)} · <span className={`hp2-offer__status${space.status === "AVAILABLE_NOW" ? " is-now" : ""}`}>{availabilityLabel(space, locale)}</span></dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <div className="hp2-portal__actions">
                <Button href={`${p("/leasing")}#available`}>{copy.leaseCta[locale]}</Button>
                <Link className="pm-link" href={`${p("/leasing")}#technical-support`}>{copy.leaseLink[locale]}<Icon /></Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const doors = {
  label: { ro: "Direcțiile MEGAPARC", ru: "Направления MEGAPARC", en: "MEGAPARC directions" },
  investTitle: { ro: "Investiții și parteneriat", ru: "Инвестиции и партнёрство", en: "Investment and partnership" },
  investText: { ro: "Imobile, terenuri, proiecte comune", ru: "Объекты, земля, совместные проекты", en: "Properties, land, joint projects" },
  leaseTitle: { ro: "Închirierea spațiilor", ru: "Аренда помещений", en: "Leasing space" },
  leaseText: { ro: "Spații în clădirile proprii MEGAPARC", ru: "Помещения в собственных зданиях MEGAPARC", en: "Space in MEGAPARC's own buildings" },
  now: { ro: "Disponibil acum", ru: "Свободно сейчас", en: "Available now" },
} satisfies Record<string, Localized>;

/** The two directions on the first screen itself — large typographic doors over the hero image, not a dashboard. */
export function HeroDoors({ locale }: { locale: SiteLocale }) {
  const p = (path: string) => localePath(locale, path);
  const now = sortSpaces(publicSpaces).find((space) => space.status === "AVAILABLE_NOW");
  const nowProject = now ? getProject(now.project) : undefined;
  return (
    <nav className="hm2-doors" aria-label={doors.label[locale]}>
      <Link className="hm2-door" href={p("/partnership")}>
        <span className="hm2-door__no">01</span>
        <span className="hm2-door__title">{doors.investTitle[locale]}</span>
        <span className="hm2-door__text">{doors.investText[locale]}</span>
        <Icon name="arrow" size={20} />
      </Link>
      <Link className="hm2-door" href={`${p("/leasing")}#available`}>
        <span className="hm2-door__no">02</span>
        <span className="hm2-door__title">{doors.leaseTitle[locale]}</span>
        <span className="hm2-door__text">{now && nowProject ? `${doors.now[locale]}: ${nowProject.name} · ${formatArea(now.area, locale)}` : doors.leaseText[locale]}</span>
        <Icon name="arrow" size={20} />
      </Link>
    </nav>
  );
}
