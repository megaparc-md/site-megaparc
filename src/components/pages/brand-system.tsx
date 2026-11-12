import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Button, Facts, Head, Intro, Quote, Rows, Section, TextLink } from "@/components/ui";
import { portfolioAssets } from "@/lib/assets";
import { brandColours, brandEssence, brandLayers, glyphSample, graphicDevices, signatureWords, typeScale } from "@/lib/brand";
import { employerBrand } from "@/lib/careers";
import { brand, localePath, type SiteLocale } from "@/lib/site-data";

/**
 * BRAND SYSTEM 2.0 — internal OWNER / founder review page (RO only, noindex).
 * Colour register, type scale, glyph coverage, signature, graphic devices,
 * photography crops and the CTA system as implemented in the benchmark rebuild.
 */
export function BrandSystemPage({ locale }: { locale: SiteLocale }) {
  const photos = portfolioAssets.filter((asset) => asset.media);

  return (
    <PageShell locale={locale}>
      <Intro tone="paper" kicker="Brand System 2.0 · revizuire internă" statement={<>{brand.name} Brand Book 2.0</>} text="Pagină de revizuire pentru OWNER / fondator. Nu face parte din navigația publică și este exclusă de la indexare." />

      <Section id="essence" tight>
        <div className="shell">
          <Head kicker={brandEssence.title[locale]} title={brandEssence.text[locale]} />
          <p className="outcomes" data-reveal>
            {brandEssence.words[locale].map((word) => (
              <span key={word}>{word}</span>
            ))}
          </p>
        </div>
      </Section>

      <Section tone="paper" id="positioning" tight>
        <div className="shell details" data-reveal>
          <Head kicker="Poziționare · trei straturi" title={brandLayers.statement[locale]} />
          <Facts
            items={[
              { label: "Brand idea", value: `${brandLayers.statement[locale]} · WE BUILD THE FUTURE` },
              { label: "Owner philosophy", value: brandLayers.strategicIdea[locale] },
              { label: "Business model", value: brandLayers.model[locale] },
              { label: "Positioning", value: brandLayers.platform[locale] },
              { label: "Capabilities", value: brand.positioning[locale] },
              { label: "Chronology", value: `1991 business origins · ${brand.since} group investment structure · 2005 MEGAPARC founded · 2020 real-estate focus` },
            ]}
          />
        </div>
      </Section>

      <Section id="colour" tight>
        <div className="shell">
          <Head kicker="Sistemul de culoare 2.0" title="Alb arhitectural, carbon, roșu-semnătură." text="Roșul de bază este valoarea provizorie derivată din referința logo (JPG). Confirmarea finală se face pe SVG-ul de producție. Culorile marcate PROPOSED sunt propuneri Brand Book 2.0. Fără gradienturi decorative de brand." />
          <div className="bs__grid" data-reveal>
            {brandColours.map((colour) => (
              <div key={colour.token} className="bs__swatch">
                <i style={{ background: colour.hex }} />
                <strong>{colour.name}</strong>
                <span>{colour.hex} · RGB {colour.rgb}<br />{colour.token}</span>
                <span>{colour.role[locale]}</span>
                <em>{colour.status === "proposed" ? "Brand Book 2.0 proposed" : colour.status}</em>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="paper" id="type" tight>
        <div className="shell">
          <Head kicker="Tipografie · Manrope · Arial · Helvetica Neue · sans-serif" title="Cinci niveluri: display, titlu, afirmație, text, etichetă." />
          <div className="bs__type" data-reveal>
            {typeScale.map((style) => (
              <div key={style.token}>
                <span>{style.name}<small>{style.token} · {style.use[locale]}</small></span>
                <p className={style.className}>{style.name === "Metric" ? "€25M+ · 10,939 m² · 5.05 ha" : "Imobiliarele ca activ de business"}</p>
              </div>
            ))}
          </div>
          <div className="bs__glyphs" data-reveal>
            <p lang="ro">{glyphSample.ro}</p>
            <p lang="ru">{glyphSample.ru}</p>
            <p lang="en">{glyphSample.en}</p>
          </div>
        </div>
      </Section>

      <Quote tone="ink" id="signature" kicker={brand.since} statement={signatureWords[locale].join(" ")} text={brandLayers.model[locale]} />

      <Section id="devices" tight>
        <div className="shell">
          <Head kicker="Fotografie · decupaje contextuale" title="Decupaje cinematice, orizont corect, fără decorare." />
          <div className="bs__devices" data-reveal>
            {photos.map((asset) => (
              <article key={asset.slug}>
                <div style={{ position: "relative", aspectRatio: "21 / 9", overflow: "hidden", background: "var(--graphite)" }}>
                  <Image src={asset.media!.wide} alt={asset.name} fill sizes="25vw" style={{ objectFit: "cover" }} />
                </div>
                <strong>{asset.name} · Editorial Wide 21:9</strong>
                <p>Hero Desktop · Editorial Wide · Asset Card 4:3 · Mobile Hero 4:5. Tratament: corecție, expunere, saturație reținută. Fără retuș structural.</p>
              </article>
            ))}
          </div>
          <Rows rows={graphicDevices.map((device, i) => ({ key: device.name, no: `0${i + 1}`, title: device.name, text: device.text[locale] }))} />
        </div>
      </Section>

      <Section tone="paper" id="cta" tight>
        <div className="shell">
          <Head kicker="Sistem CTA" title="Buton compact, link text cu săgeată SVG." text="Mișcare: reveal lent, count-up, depth ±16px · prefers-reduced-motion respectat. Săgețile sunt SVG cu stroke currentColor, niciodată glife Unicode." />
          <div className="sec__actions" data-reveal>
            <Button href={localePath(locale, "/leasing")}>Vezi spațiile libere</Button>
            <Button href={localePath(locale, "/contact")} variant="ghost">Solicită detalii</Button>
            <TextLink href={localePath(locale, "/projects")}>Vezi proiectele</TextLink>
          </div>
          <p className="note">{employerBrand.direction[locale].join(" ")}</p>
        </div>
      </Section>
    </PageShell>
  );
}
