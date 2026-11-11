import { ui } from "@/components/leasing-experience/parts";
import { PassportFold } from "@/components/leasing-experience/passport-fold";
import type { TemplateOffer } from "@/components/leasing-experience/offer";
import { Icon } from "@/components/ui";
import { formatAreaExact } from "@/content/source";
import { publishable, type LeasingExperience, type PassportCard, type PassportFact, type PassportItem, type PassportSide, type TechPassport } from "@/data/leasing-experience-model";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * TENANT TECHNICAL PASSPORT (OWNER «MOSCOVA 20 · TECHNICAL READINESS — OWNER REDESIGN», 2026-11-10) — the technical
 * drawer as a hierarchy instead of a spreadsheet:
 *   1 title + one sentence (drawer head + lead)
 *   2 four key facts — Source Serif figures, the unit as its own box, a Geist label
 *   3 the two sides (boulevard · courtyard) and one specification sheet — engineering · logistics · access · sanitary
 *     rooms · fit-out (OWNER technical data update 2026-11-10) — then the levels table
 *   4 what is already in the building + the approved tenant-investment line · what we check for your format
 *   5 the owner principle on a graphite band with the viewing action
 * Every value comes from the dataset's confirmed records (the unit's level breakdown for areas and heights); an item
 * whose evidence is not publishable is never shown.
 */

const copy = {
  facts: { ro: "Faptele principale", ru: "Ключевые факты", en: "Key facts" },
  level: { ro: "Nivel", ru: "Уровень", en: "Level" },
  gross: { ro: "Totală", ru: "Общая", en: "Gross" },
  useful: { ro: "Utilă", ru: "Полезная", en: "Useful" },
  height: { ro: "Înălțime", ru: "Высота", en: "Height" },
  offered: { ro: "În chirie se oferă {a} — {levels}.", ru: "В аренду предлагается {a} — {levels}.", en: "{a} is offered for lease — {levels}." },
  and: { ro: " și ", ru: " и ", en: " and " },
} satisfies Record<string, Localized>;

const intl: Record<SiteLocale, string> = { ro: "ro-RO", ru: "ru-RU", en: "en-GB" };
const metres = (m: number, locale: SiteLocale) => m.toLocaleString(intl[locale], { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const lower = (text: string, locale: SiteLocale) => (locale === "en" ? text.charAt(0).toLocaleLowerCase("en") + text.slice(1) : text.charAt(0).toLocaleLowerCase(locale) + text.slice(1));
const list = (names: string[], locale: SiteLocale) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")}${copy.and[locale]}${names[names.length - 1]}`);

function Fact({ fact, offer, locale }: { fact: PassportFact; offer: TemplateOffer; locale: SiteLocale }) {
  let approx = false;
  let figure: string | null;
  if (fact.figure === "heights") {
    const floors = offer.breakdown.filter((level) => level.height);
    approx = floors.some((level) => level.heightEvidence === "APPROXIMATE");
    figure = floors.length ? floors.map((level) => metres(level.height!, locale)).join(" / ") : null;
  } else figure = fact.figure[locale];
  if (!figure) return null;
  // OWNER «TECHNICAL READINESS — CARDS» (2026-11-11): a specification card — small label · large value · short explanation
  return (
    <div className={`lg-pass__fact${fact.name ? " is-card" : ""}`}>
      <dt className="lg-pass__label">{fact.name ? fact.name[locale] : fact.label[locale]}</dt>
      <dd className="lg-pass__figure">
        {approx ? <span className="lg-pass__approx" aria-label={ui.approx[locale]}>≈</span> : null}
        <span className="lg-pass__num">{figure}</span>
        <span className="lg-pass__unit">{fact.unit[locale]}</span>
      </dd>
      {fact.name ? <dd className="lg-pass__why">{fact.label[locale]}</dd> : null}
    </div>
  );
}

/** One infrastructure card («Инфраструктура объекта»): small label · value · one explanation — the same confirmed facts as the sheet, never a dashboard tile. */
function Card({ card, locale }: { card: PassportCard; locale: SiteLocale }) {
  return (
    <li className="lg-pass__card">
      <p className="lg-pass__cardlabel">{card.title[locale]}</p>
      <p className="lg-pass__cardvalue">{card.value[locale]}</p>
      <p className="lg-pass__cardtext">{card.text[locale]}</p>
    </li>
  );
}

function Levels({ offer, x, locale }: { offer: TemplateOffer; x: LeasingExperience; locale: SiteLocale }) {
  const levels = offer.breakdown;
  if (!levels.length) return null;
  const names = levels.map((level, i) => (i ? lower(level.label[locale], locale) : level.label[locale]));
  return (
    <>
      <table className="lg-pass__levels">
        <thead>
          <tr>
            <th scope="col">{copy.level[locale]}</th>
            <th scope="col">{copy.gross[locale]}</th>
            <th scope="col">{copy.useful[locale]}</th>
            <th scope="col">{copy.height[locale]}</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((level) => (
            <tr key={level.key}>
              <th scope="row">{level.label[locale]}</th>
              <td>{formatAreaExact(level.area, locale)}</td>
              <td>{level.useful ? formatAreaExact(level.useful, locale) : "—"}</td>
              <td>{level.height ? `${level.heightEvidence === "APPROXIMATE" ? "≈ " : ""}${metres(level.height, locale)} ${locale === "ru" ? "м" : "m"}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lg-pass__levelsnote">
        {offer.area ? `${copy.offered[locale].replace("{a}", offer.figure).replace("{levels}", lower(list(names, locale), locale))} ` : null}
        {x.area.propertyLine[locale]}
        {x.area.groundOnly ? ` ${x.area.groundOnly.text[locale]} — ${lower(ui.toConfirm[locale], locale)}.` : null}
      </p>
    </>
  );
}

function Item({ item, locale }: { item: PassportItem; locale: SiteLocale }) {
  return (
    <div className="lg-pass__item">
      <dt className="lg-pass__ititle">{item.title[locale]}</dt>
      <dd className="lg-pass__value">{item.value[locale]}</dd>
      {item.note ? <dd className="lg-pass__note">{item.note[locale]}</dd> : null}
    </div>
  );
}

function Side({ side, dir, locale }: { side: PassportSide; dir: "up" | "down"; locale: SiteLocale }) {
  return (
    <div className={`lg-pass__side is-${dir}`}>
      <p className="lg-pass__sidename">{side.name[locale]}</p>
      <ul className="lg-pass__sideitems">
        {side.items.map((item) => (
          <li key={item.en}>{item[locale]}</li>
        ))}
      </ul>
    </div>
  );
}

/** The two sides of the property and what opens onto each — directions only, never positions (no fourth exit is drawn). */
function Sides({ sides, locale }: { sides: NonNullable<TechPassport["sides"]>; locale: SiteLocale }) {
  const shown = sides.sides.filter((side) => publishable(side.evidence));
  if (shown.length < 2) return null;
  const [top, bottom] = shown;
  return (
    <section className="lg-pass__sides">
      <h3 className="lg-pass__htitle">{sides.title[locale]}</h3>
      <div className="lg-pass__sidemap">
        <Side side={top} dir="up" locale={locale} />
        <p className="lg-pass__core">{sides.core[locale]}</p>
        <Side side={bottom} dir="down" locale={locale} />
      </div>
      <p className="lg-pass__caption">{sides.caption[locale]}</p>
    </section>
  );
}

export function TechPassport({ x, passport: p, offer, locale }: { x: LeasingExperience; passport: TechPassport; offer: TemplateOffer; locale: SiteLocale }) {
  const facts = p.facts.filter((fact) => publishable(fact.evidence));
  return (
    <div className="lg-pass">
      <p className="lg-pass__lead">{x.drawers.tech.lead[locale]}</p>

      {/* LEVEL 2 — the four facts that answer «what is there» before any detail */}
      <h3 className="sr-only">{copy.facts[locale]}</h3>
      <dl className="lg-pass__facts">
        {facts.map((fact) => (
          <Fact key={fact.key} fact={fact} offer={offer} locale={locale} />
        ))}
      </dl>

      {/* the boulevard and the courtyard: what opens onto each side (OWNER technical data update 2026-11-10) */}
      {p.sides ? <Sides sides={p.sides} locale={locale} /> : null}

      {/* LEVEL 3 — one specification sheet: two columns on wide screens; phones fold the groups (the facts above stay open) */}
      <div className="lg-pass__groups">
        {p.groups.map((group) => {
          const items = group.items.filter((item) => publishable(item.evidence));
          if (!items.length) return null;
          return (
            <PassportFold key={group.key} summary={group.title[locale]} preview={items.map((item) => item.title[locale]).join(" · ")}>
              <dl className="lg-pass__items">
                {items.map((item) => (
                  <Item key={item.key} item={item} locale={locale} />
                ))}
              </dl>
              {group.note ? <p className="lg-pass__gnote">{group.note[locale]}</p> : null}
            </PassportFold>
          );
        })}
      </div>

      {/* the levels table — open on wide screens, folded on phones like the groups */}
      {offer.breakdown.length ? (
        <div className="lg-pass__levelsblock">
          <PassportFold summary={p.levelsTitle[locale]} preview={offer.breakdown.map((level) => level.label[locale]).join(" · ")}>
            <Levels offer={offer} x={x} locale={locale} />
          </PassportFold>
        </div>
      ) : null}

      {/* LEVEL 4 — what the building already has · the approved tenant-investment line · what we check for your format */}
      <section className="lg-pass__ready">
        <h3 className="lg-pass__htitle">{p.ready.title[locale]}</h3>
        {p.ready.cards?.length ? (
          <ul className="lg-pass__cards">
            {p.ready.cards.filter((card) => publishable(card.evidence)).map((card) => (
              <Card key={card.key} card={card} locale={locale} />
            ))}
          </ul>
        ) : (
          <ul className="lg-pass__marks is-ready">
            {(p.ready.items ?? []).map((item) => (
              <li key={item.en}>{item[locale]}</li>
            ))}
          </ul>
        )}
        <p className="lg-pass__capex">{p.capex[locale]}</p>
      </section>

      <section className="lg-pass__check">
        <h3 className="lg-pass__htitle">{p.check.title[locale]}</h3>
        <p className="lg-pass__checklead">{p.check.lead[locale]}</p>
        <ul className="lg-pass__marks is-check">
          {p.check.items.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ul>
      </section>

      {/* LEVEL 5 — the owner principle and the one action */}
      <section className="lg-pass__principle">
        <p className="lg-pass__statement">{p.principle[locale]}</p>
        <p className="lg-pass__actions">
          <a className="btn lg-pass__btn" href="#lg-form" data-intent="viewing"><span>{offer.primary}</span><Icon /></a>
          <a className="pm-link lg-pass__link" href="#plans"><span>{ui.plansSee[locale]}</span><Icon name="down" /></a>
        </p>
      </section>
    </div>
  );
}
