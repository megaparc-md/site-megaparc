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
  copied: {
    ro: "Numărul a fost copiat — inserați-l în căutarea e-Cadastru.",
    ru: "Номер скопирован — вставьте его в поиск e‑Cadastru.",
    en: "Number copied — paste it into the e-Cadastru search.",
  },
} satisfies Record<string, Localized>;

export function CadastreVerify({ number, portal, locale }: { number: string; portal: string; locale: SiteLocale }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      // clipboard unavailable (permissions): the number stays visible and selectable
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 6000);
  };
  return (
    <div className="tr-cad">
      <p className="tr-label">{copy.label[locale]}</p>
      <p className="tr-cad__title">{copy.title[locale]}</p>
      <p className="tr-cad__number" translate="no">{number}</p>
      <p className="tr-cad__text">{copy.text[locale]}</p>
      <div className="tr-cad__actions">
        <button type="button" className="pm-link tr-cad__copy" onClick={copyNumber}>{copy.copyNumber[locale]}</button>
        <a className="btn tr-cad__open" href={portal} target="_blank" rel="noopener noreferrer" onClick={copyNumber}>{copy.open[locale]}</a>
      </div>
      <p className={`tr-cad__done${copied ? " is-on" : ""}`} role="status" aria-live="polite">{copied ? copy.copied[locale] : ""}</p>
    </div>
  );
}
