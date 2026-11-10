import Link from "next/link";
import { ConceptDisclosure, ConceptImage, MaskTitle, hasConceptImage } from "@/components/experience";
import { investInputs, investQuestions } from "@/components/invest-qa";
import { PageShell } from "@/components/page-shell";
import { ArtImage } from "@/components/primitives";
import { Figure, NB, R3Button, R3Label, R3Link, ValueSequence, projectState, r3Href } from "@/components/r3";
import { Icon } from "@/components/ui";
import { getProject } from "@/content/source";
import { developmentPortfolio } from "@/lib/portfolio";
import { assetProfiles, company, contactLinks, portfolioFigures } from "@/data/demo-content";
import { acquisitionTypes, geography } from "@/lib/business";
import { localePath, type Localized, type SiteLocale } from "@/lib/site-data";

/**
 * INVESTMENT — SITEWIDE R3.1 §11–12 (OWNER 2026-11-09). Priority #1: MEGAPARC deploys capital into real assets and
 * stays responsible for the result. Five scenes:
 *   A thesis (hero) — the one statement;
 *   B how value is created (R3.2) — Acquire · Develop · Operate · Reinvest on real projects, what MEGAPARC can do with an asset;
 *   B what we consider — four kinds of opportunity on the confirmed business model, one real development scene;
 *   C what each side brings — the owner / partner · MEGAPARC (confirmed capabilities only);
 *   D evidence — confirmed portfolio facts as calm editorial numbers, one strong building, the owned ledger;
 *   E opportunity — two conversations.
 * No AUM, IRR, returns, pipeline value, partner logos or performance; no regulated-product impression.
 */
const copy = {
  ro: {
    label: "Investiții și parteneriat",
    title: ["Capital investit", "în active reale."],
    thesis: "MEGAPARC investește capital în imobile și terenuri — și rămâne responsabilă de rezultat.",
    can: "Investim în active pe care le putem",
    verbs: ["achiziționa", "dezvolta", "repoziționa", "exploata", "deține pe termen lung", "vinde strategic, atunci când este justificat"],
    valueLabel: "Cum se creează valoarea",
    valueTitle: "Cum creează MEGAPARC valoare.",
    or: "sau",
    discuss: "Discutăm o oportunitate",
    offer: "Propuneți un obiect sau un teren",
    considerLabel: "Ce analizăm",
    considerTitle: "Ce oportunități analizează MEGAPARC?",
    partnershipTitle: "Parteneriate structurate clar",
    partnershipText: "Participare la un proiect concret sau dezvoltare comună a imobilului; condițiile se discută individual.",
    bringsLabel: "Parteneriat",
    partnerBrings: "Ce aduce proprietarul sau partenerul",
    partnerExtra: "Investitori, bănci și parteneri financiari — participarea sau finanțarea unui proiect concret.",
    megaparcBrings: "Ce aduce MEGAPARC",
    brings: [
      ["Disciplina capitalului", "Decizia vine după verificarea economiei, a dreptului și a tehnicii — nu înainte."],
      ["Dezvoltare imobiliară", "Proiectare, construcție, reconstrucție — proiecte proprii."],
      ["Directorul tehnic", "Structura, instalațiile, puterile și adaptarea — verificate de echipa proprie."],
      ["Arhitectul", "Ce poate deveni obiectul: funcție, suprafață, etape."],
      ["Exploatare", "Clădirile noastre le administrăm noi: întreținere, instalații, îmbunătățiri."],
      ["Închiriere", "Relația cu chiriașii în obiectele proprii."],
      ["Abordarea proprietarului pe termen lung", "Clădirile rămân la noi, deci calitatea se vede în costurile de mâine."],
    ],
    evidenceLabel: "Dovada",
    evidenceTitle: "Ce deținem astăzi.",
    figArea: "suprafața obiectelor în funcțiune",
    figOperating: "obiecte în funcțiune",
    figLand: "terenuri",
    figDev: "proiecte de dezvoltare",
    figFounded: "este fondată MEGAPARC",
    figGroup: "începe istoria grupului",
    nextLabel: "Pasul următor",
    owner: "Am un activ sau un teren",
    ownerNote: "Trimiteți adresa, suprafața și documentele pe care le aveți.",
    partner: "Vreau să discut un parteneriat investițional",
    partnerNote: "Un proiect concret, o discuție directă.",
    note: "MEGAPARC nu oferă produse de investiții publice. Fiecare parteneriat se discută separat, pentru un proiect concret.",
    coop: "Constructori și proiectanți — scrieți despre colaborare",
  },
  ru: {
    label: `Инвестиции и${NB}партнёрство`,
    title: ["Капитал", `в${NB}реальных объектах.`],
    thesis: `MEGAPARC вкладывает капитал в${NB}недвижимость и${NB}землю${NB}— и${NB}отвечает за${NB}результат.`,
    can: `Мы инвестируем в${NB}объекты, которые можем`,
    verbs: ["приобрести", "развить", "перепрофилировать", "эксплуатировать", "держать долгосрочно", `продать, когда это стратегически оправдано`],
    valueLabel: "Как создаётся стоимость",
    valueTitle: `Как MEGAPARC создаёт стоимость.`,
    or: "или",
    discuss: "Обсудить возможность",
    offer: `Предложить объект или${NB}землю`,
    considerLabel: "Что рассматриваем",
    considerTitle: `Какие возможности рассматривает MEGAPARC?`,
    partnershipTitle: `Чётко структурированные партнёрства`,
    partnershipText: `Участие в${NB}конкретном проекте или совместное развитие недвижимости; условия обсуждаются индивидуально.`,
    bringsLabel: "Партнёрство",
    partnerBrings: `Что приносит собственник или${NB}партнёр`,
    partnerExtra: `Инвесторы, банки и${NB}финансовые партнёры${NB}— участие или финансирование конкретного проекта.`,
    megaparcBrings: "Что приносит MEGAPARC",
    brings: [
      ["Дисциплина капитала", `Решение${NB}— после проверки экономики, права и${NB}техники, а${NB}не${NB}до${NB}неё.`],
      ["Девелопмент", `Проектирование, строительство, реконструкция${NB}— собственные проекты.`],
      ["Технический директор", `Конструкции, инженерия, мощности и${NB}адаптация${NB}— проверяет своя команда.`],
      ["Архитектор", `Чем может стать объект: функция, площадь, этапы.`],
      ["Эксплуатация", `Свои здания ведём сами: обслуживание, инженерия, улучшения.`],
      ["Аренда", `Работа с${NB}арендаторами в${NB}собственных объектах.`],
      ["Подход долгосрочного собственника", `Здания остаются у${NB}нас, поэтому качество видно в${NB}завтрашних расходах.`],
    ],
    evidenceLabel: "Подтверждение",
    evidenceTitle: `Чем мы владеем сегодня.`,
    figArea: "площадь действующих объектов",
    figOperating: "действующих объекта",
    figLand: "земли",
    figDev: "проекта развития",
    figFounded: "основана MEGAPARC",
    figGroup: "начало истории группы",
    nextLabel: "Следующий шаг",
    owner: `У${NB}меня есть объект или${NB}земля`,
    ownerNote: `Пришлите адрес, площадь и${NB}документы, которые есть.`,
    partner: `Хочу обсудить инвестиционное партнёрство`,
    partnerNote: `Конкретный проект, прямой разговор.`,
    note: `MEGAPARC не${NB}предлагает публичных инвестиционных продуктов. Каждое партнёрство обсуждается отдельно, по${NB}конкретному проекту.`,
    coop: `Подрядчики и${NB}проектировщики${NB}— написать о${NB}сотрудничестве`,
  },
  en: {
    label: "Investment and partnership",
    title: ["Capital", "in real assets."],
    thesis: "MEGAPARC puts capital into real estate and land — and stays responsible for the result.",
    can: "We invest in assets we can",
    verbs: ["acquire", "develop", "reposition", "operate", "hold for the long term", "exit when it is strategically right"],
    valueLabel: "How value is created",
    valueTitle: "How MEGAPARC creates value.",
    or: "or",
    discuss: "Discuss an opportunity",
    offer: "Offer a property or land",
    considerLabel: "What we consider",
    considerTitle: "Which opportunities does MEGAPARC consider?",
    partnershipTitle: "Clearly structured partnerships",
    partnershipText: "Taking part in a specific project or developing a property together; terms are discussed individually.",
    bringsLabel: "Partnership",
    partnerBrings: "What the owner or partner brings",
    partnerExtra: "Investors, banks and financial partners — taking part in, or financing, a specific project.",
    megaparcBrings: "What MEGAPARC brings",
    brings: [
      ["Capital discipline", "The decision comes after the economics, legal and technical checks — not before."],
      ["Real-estate development", "Design, construction, redevelopment — our own projects."],
      ["The Technical Director", "Structure, building services, power and adaptation — checked by our own team."],
      ["The Architect", "What the property can become: use, area, phases."],
      ["Operations", "We run our own buildings ourselves: upkeep, building services, improvements."],
      ["Leasing", "Working with tenants in our own properties."],
      ["A long-term owner's approach", "The buildings stay with us, so quality shows in tomorrow's costs."],
    ],
    evidenceLabel: "Evidence",
    evidenceTitle: "What we own today.",
    figArea: "operating property area",
    figOperating: "operating properties",
    figLand: "of land",
    figDev: "development projects",
    figFounded: "MEGAPARC founded",
    figGroup: "the group's history begins",
    nextLabel: "Next step",
    owner: "I have an asset or land",
    ownerNote: "Send the address, the area and the documents you have.",
    partner: "I want to discuss an investment partnership",
    partnerNote: "A specific project, a direct conversation.",
    note: "MEGAPARC does not offer public investment products. Every partnership is discussed separately, around a specific project.",
    coop: "Contractors and designers — write about cooperation",
  },
} as const;

const operatingOrder = ["dacia-31", "moscova-9", "creanga-78", "moscova-20"] as const;
/** The four kinds of opportunity (R3.1 §11 B) — three from the approved acquisition types, then partnerships. */
const considerKeys = ["operating", "land", "redevelop"] as const;

export function PartnershipPage({ locale }: { locale: SiteLocale }) {
  const c = copy[locale];
  const q = investQuestions;
  const p = (path: string) => localePath(locale, path);
  const vatra = getProject("vatra")!;
  const dacia = getProject("dacia-31")!;
  // R3.3 §5: projects under development / construction (VATRA · Vasile Lupu 48/3); land is its own figure
  const developmentCount = developmentPortfolio().length;
  const discussHref = r3Href(locale, "/contact?subject=partnership#partnership");
  const consider: { title: Localized | string; text: Localized | string }[] = [
    ...considerKeys.map((key) => acquisitionTypes.find((type) => type.key === key)!),
    { title: c.partnershipTitle, text: c.partnershipText },
  ];
  const t = (value: Localized | string) => (typeof value === "string" ? value : value[locale]);

  return (
    <PageShell locale={locale} variant="solid" experience mainClassName="r3-page r3-invest r4-page r4-invest">
      {/* A — THESIS (R4, OWNER overnight mandate §16): the statement as typography first — Yellow Tree authority, FINMENTOR
          discipline — then the OWNER-approved illustration as a controlled band, always disclosed («Концептуальное изображение») */}
      <section className="r3-sec r3-sec--ivory r3-opening r4-iopen" id="thesis">
        <div className="r3-shell">
          <R3Label>{c.label}</R3Label>
          <MaskTitle as="h1" className="r3-display r4-iopen__title" lines={[...c.title]} />
          <div className="r4-iopen__base" data-reveal>
            <p className="r4-iopen__thesis">{c.thesis}</p>
            <div className="r3-actions">
              <R3Button href={discussHref}>{c.discuss}</R3Button>
              <R3Link href={p("/offer")}>{c.offer}</R3Link>
            </div>
          </div>
        </div>
      </section>
      {hasConceptImage("partnership.hero") ? (
        <figure className="r4-iband" data-reveal>
          <ConceptImage id="partnership.hero" locale={locale} priority sizes="100vw" />
          <ConceptDisclosure id="partnership.hero" locale={locale} />
        </figure>
      ) : null}
      {/* B — HOW VALUE IS CREATED (R3.2 §7 · 03): Acquire · Develop · Operate · Reinvest on real projects; what MEGAPARC can do with an asset as one sentence */}
      <section className="r3-sec r3-sec--ivory r32-ivalue" id="value">
        <div className="r3-shell">
          <div className="r3-head r3-head--split" data-reveal>
            <R3Label>{c.valueLabel}</R3Label>
            <h2 className="r3-title">{c.valueTitle}</h2>
            <p className="r3-lead">{c.can} {c.verbs.slice(0, -1).join(", ")} {c.or} {c.verbs[c.verbs.length - 1]}.</p>
          </div>
          <ValueSequence locale={locale} tone="light" />
        </div>
      </section>

      {/* B — WHAT WE CONSIDER: one real development scene, four kinds of opportunity as editorial rows */}
      <section className="r3-sec r3-sec--paper r3-consider" id="consider">
        <Link href={p(`/projects/${vatra.slug}`)} className="r3-wide" data-reveal>
          <figure className="r3-wide__media">
            <ArtImage media={{ ...vatra.media!, mobile: vatra.media!.wide }} variant="wide" alt={`${vatra.name} — ${vatra.format[locale]}`} sizes="100vw" position="45% 60%" />
          </figure>
          <span className="r3-wide__caption">{vatra.name} · {vatra.card.status[locale]}</span>
        </Link>
        <div className="r3-shell">
          <div className="r3-question__head" data-reveal>
            <R3Label>{c.considerLabel}</R3Label>
            <h2 className="r3-title">{c.considerTitle}</h2>
            <p className="r3-lead">{q.considerLine[locale]} {geography.text[locale]}</p>
          </div>
          <ol className="r3-types" data-reveal>
            {consider.map((item) => (
              <li key={t(item.title)}>
                <h3>{t(item.title)}</h3>
                <p>{t(item.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* C — WHAT EACH SIDE BRINGS */}
      <section className="r3-sec r3-sec--ivory r3-brings" id="partnership">
        <div className="r3-shell">
          <R3Label>{c.bringsLabel}</R3Label>
          <div className="r3-brings__grid">
            <div className="r3-brings__col r3-brings__col--mp" data-reveal>
              <h2 className="r3-brings__title">{c.megaparcBrings}</h2>
              <p className="r3-lead">{q.assessLine[locale]}</p>
              <dl className="r3-caps-list">
                {c.brings.map(([title, text]) => (
                  <div key={title}><dt>{title}</dt><dd>{text}</dd></div>
                ))}
              </dl>
            </div>
            <div className="r3-brings__col" data-reveal>
              <h2 className="r3-brings__title">{c.partnerBrings}</h2>
              <p className="r3-lead">{q.inputsNote[locale]}</p>
              <ul className="r3-brings__list">
                {investInputs.map((item) => <li key={item.en}>{item[locale]}</li>)}
              </ul>
              <p className="r3-note r3-brings__extra">{c.partnerExtra}</p>
            </div>
          </div>
        </div>
      </section>

      {/* D — EVIDENCE: calm editorial numbers, one strong building, the owned ledger */}
      <section className="r3-sec r3-sec--paper r3-evidence" id="evidence">
        <div className="r3-shell">
          <div className="r3-head" data-reveal>
            <R3Label>{c.evidenceLabel}</R3Label>
            <h2 className="r3-title">{c.evidenceTitle}</h2>
          </div>
          <dl className="r3-numbers" data-reveal>
            <div className="is-lead"><dt>{c.figArea}</dt><dd><Figure value={portfolioFigures.area.value[locale]} /></dd></div>
            <div><dt>{c.figLand}</dt><dd><Figure value={portfolioFigures.land.value[locale]} /></dd></div>
            <div><dt>{c.figOperating}</dt><dd>{portfolioFigures.operating.value[locale]}</dd></div>
            <div><dt>{c.figDev}</dt><dd>{String(developmentCount).padStart(2, "0")}</dd></div>
            {/* chronological, and never read as "founded … 1991": the group's origins first, then MEGAPARC 2005 */}
            <div><dt>{c.figGroup}</dt><dd>1991</dd></div>
            <div><dt>{c.figFounded}</dt><dd>2005</dd></div>
          </dl>
        </div>
        <Link href={p(`/projects/${dacia.slug}`)} className="r3-band r3-band--link" data-reveal>
          <ArtImage media={dacia.media!} variant="wide" alt={`${dacia.name} — ${dacia.format[locale]}`} sizes="100vw" position="50% 55%" />
          <span className="r3-shell r3-band__caption">{dacia.name} · {dacia.card.size[locale]}</span>
        </Link>
        <div className="r3-shell">
          <ol className="r3-ledger r3-ledger--after" data-reveal>
            {operatingOrder.map((slug) => {
              const project = getProject(slug)!;
              const state = projectState(project, locale);
              return (
                <li key={slug}>
                  <Link href={p(`/projects/${slug}`)}>
                    <span className="r3-ledger__name">{project.name}</span>
                    <span className="r3-ledger__meta">{project.format[locale]} · <span className={`is-${state.tone}`}>{state.text}</span></span>
                    <span className="r3-ledger__area"><Figure value={assetProfiles[slug].area.value[locale]} /></span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* E — OPPORTUNITY: two conversations */}
      <section className="r3-sec r3-sec--stone r3-next" id="next">
        <div className="r3-shell">
          <R3Label>{c.nextLabel}</R3Label>
          <div className="r3-next__grid">
            <Link className="r3-next__action" href={p("/offer")} data-reveal>
              <span className="r3-next__title">{c.owner}</span>
              <span className="r3-next__note">{c.ownerNote}</span>
              <Icon size={28} />
            </Link>
            <Link className="r3-next__action" href={discussHref} data-reveal>
              <span className="r3-next__title">{c.partner}</span>
              <span className="r3-next__note">{c.partnerNote}</span>
              <Icon size={28} />
            </Link>
          </div>
          <ul className="r3-next__contacts">
            <li><a href={contactLinks.email}>{company.email.value[locale]}</a></li>
            <li><a href={contactLinks.mobile}>{company.mobile.value[locale]}</a></li>
            <li><a href={contactLinks.landline}>{company.landline.value[locale]}</a></li>
            <li><Link href={r3Href(locale, "/contact#question")}>{c.coop}</Link></li>
          </ul>
          <p className="r3-note r3-submit__note">{c.note}</p>
        </div>
      </section>
    </PageShell>
  );
}
