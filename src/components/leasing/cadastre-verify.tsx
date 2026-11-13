"use client";

import { useRef, useState } from "react";
import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * OFFICIAL VERIFICATION — e-Cadastru (OWNER "OVERNIGHT RELEASE", 2026-11-09 §5). The cadastral number with a copy
 * action; the portal link copies the number too and opens the official portal (no invented deep link); a restrained
 * confirmation tells the visitor to paste the number into the portal search.
 */
const copy = {
  label: { ro: "Verificare oficială", ru: "Официальная проверка", en: "Official verification" },
  title: { ro: "Numărul cadastral al imobilului", ru: "Кадастровый номер объекта", en: "Cadastral number of the property" },
  text: {
    ro: "Datele imobilului pot fi verificate după numărul cadastral în portalul oficial e-Cadastru.",
    ru: "Данные объекта можно проверить по кадастровому номеру в официальном портале e‑Cadastru.",
    en: "The property can be checked by its cadastral number in the official e-Cadastru portal.",
  },
  copyNumber: { ro: "Copiază numărul", ru: "Скопировать номер", en: "Copy the number" },
  open: { ro: "Verifică imobilul în e-Cadastru ↗", ru: "Проверить объект в e‑Cadastru ↗", en: "Verify the property in e-Cadastru ↗" },
  // OWNER «LEASING TEMPLATE LOCK» §11 (2026-11-10): the same component on every leasing object — one number, the list of registered premises, or the number being verified
  titleMany: { ro: "Numerele cadastrale ale spațiilor", ru: "Кадастровые номера помещений", en: "Cadastral numbers of the premises" },
  textMany: {
    ro: "Spațiile înregistrate pot fi verificate după numerele cadastrale în portalul oficial e-Cadastru.",
    ru: "Зарегистрированные помещения можно проверить по кадастровым номерам в официальном портале e‑Cadastru.",
    en: "The registered premises can be checked by their cadastral numbers in the official e-Cadastru portal.",
  },
  openMany: { ro: "Verifică numerele în e-Cadastru ↗", ru: "Проверить номера в e‑Cadastru ↗", en: "Verify the numbers in e-Cadastru ↗" },
  total: { ro: "Total înregistrat", ru: "Итого зарегистрировано", en: "Registered in total" },
  pending: { ro: "Numărul cadastral este în curs de verificare", ru: "Кадастровый номер проверяется", en: "Cadastral number is being verified" },
  pendingText: {
    ro: "Îl publicăm după verificarea formatului; până atunci datele obiectului se confirmă la cerere.",
    ru: "Опубликуем после проверки формата; до этого данные объекта подтверждаем по запросу.",
    en: "We publish it once its format is verified; until then the property data is confirmed on request.",
  },
  // OWNER R9 addendum (2026-11-13): the premises' own numbers — one quiet line, never the building's or the land's number
  premises: { ro: "Numerele cadastrale ale spațiilor:", ru: "Кадастровые номера помещений:", en: "Cadastral numbers of the premises:" },
  copied: {
    ro: "Numărul a fost copiat — inserați-l în căutarea e-Cadastru.",
    ru: "Номер скопирован — вставьте его в поиск e‑Cadastru.",
    en: "Number copied — paste it into the e-Cadastru search.",
  },
} satisfies Record<string, Localized>;

export function CadastreVerify({ number, numbers, total, pending = false, premises, portal, locale }: { number?: string; /** registered premises: number + formatted area */ numbers?: { cadastral: string; area: string }[]; total?: string; pending?: boolean; /** the cadastral numbers of the premises offered (a quiet line under the property number) */ premises?: string[]; portal: string; locale: SiteLocale }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const copyNumber = async () => {
    if (!number) return;
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      // clipboard unavailable (permissions): the number stays visible and selectable
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 6000);
  };
  if (pending) {
    return (
      <div className="tr-cad tr-cad--pending">
        <p className="tr-label">{copy.label[locale]}</p>
        <p className="tr-cad__title">{copy.title[locale]}</p>
        <p className="tr-cad__number tr-cad__number--pending">{copy.pending[locale]}</p>
        <p className="tr-cad__text">{copy.pendingText[locale]}</p>
      </div>
    );
  }
  if (numbers?.length) {
    return (
      <div className="tr-cad tr-cad--many">
        <p className="tr-label">{copy.label[locale]}</p>
        <p className="tr-cad__title">{copy.titleMany[locale]}</p>
        <ul className="tr-cad__list">
          {numbers.map((item) => (
            <li key={item.cadastral}><span translate="no">{item.cadastral}</span><span>{item.area}</span></li>
          ))}
        </ul>
        {total ? <p className="tr-cad__total"><span>{copy.total[locale]}</span><strong>{total}</strong></p> : null}
        <p className="tr-cad__text">{copy.textMany[locale]}</p>
        <div className="tr-cad__actions">
          <a className="btn tr-cad__open" href={portal} target="_blank" rel="noopener noreferrer">{copy.openMany[locale]}</a>
        </div>
      </div>
    );
  }
  return (
    <div className="tr-cad">
      <p className="tr-label">{copy.label[locale]}</p>
      <p className="tr-cad__title">{copy.title[locale]}</p>
      <p className="tr-cad__number" translate="no">{number}</p>
      {premises?.length ? (
        <p className="tr-cad__premises">
          <span>{copy.premises[locale]}</span>{" "}
          {premises.map((item, i) => <span key={item}>{i ? <span aria-hidden="true"> · </span> : null}<span className="tr-cad__premise" translate="no">{item}</span></span>)}
        </p>
      ) : null}
      <p className="tr-cad__text">{copy.text[locale]}</p>
      <div className="tr-cad__actions">
        <button type="button" className="pm-link tr-cad__copy" onClick={copyNumber}>{copy.copyNumber[locale]}</button>
        <a className="btn tr-cad__open" href={portal} target="_blank" rel="noopener noreferrer" onClick={copyNumber}>{copy.open[locale]}</a>
      </div>
      <p className={`tr-cad__done${copied ? " is-on" : ""}`} role="status" aria-live="polite">{copied ? copy.copied[locale] : ""}</p>
    </div>
  );
}
