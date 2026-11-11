import type { Localized } from "@/lib/site-data";

/**
 * TENANT CABINET — a secondary service entry for existing tenants (OWNER «TENANT CABINET ENTRY», 2026-11-11). Never a primary
 * commercial CTA: the visitor journey stays leasing. OPTION A (preferred before development): while the cabinet is not
 * operational, NO public link renders anywhere — no empty route, no broken page, no fake login, no «create account», no launch
 * date. The architecture is reserved here: the route, the wording in RU / RO / EN, the slots (footer · contact service area ·
 * Digital Leasing Pack · optional desktop utility navigation) and the planned functions, stated at a high level only. Switching
 * `enabled` to true (an OWNER decision, once a real cabinet exists) renders the quiet entry in every slot; the authentication
 * provider is not chosen here.
 */
export const tenantCabinet = {
  /** OPTION A: not operational → nothing public renders */
  enabled: false,
  /** reserved route (site-relative, before the locale prefix) — or a future dedicated tenant application URL */
  path: "/tenant",
  externalUrl: null as string | null,
  label: { ro: "Pentru chiriașii actuali", ru: "Для действующих арендаторов", en: "For existing tenants" } satisfies Localized,
  action: { ro: "Intră în cabinet", ru: "Войти в кабинет", en: "Tenant portal" } satisfies Localized,
  /** the informational page (OPTION B) — kept for the day the OWNER prefers it before launch; not rendered under OPTION A */
  page: {
    title: { ro: "Cabinetul chiriașului", ru: "Кабинет арендатора", en: "Tenant portal" } satisfies Localized,
    statement: { ro: "Serviciul digital pentru chiriașii actuali MEGAPARC se pregătește de lansare.", ru: "Цифровой сервис для действующих арендаторов MEGAPARC готовится к запуску.", en: "The digital service for existing MEGAPARC tenants is being prepared for launch." } satisfies Localized,
    planned: [
      { ro: "facturi și calcule", ru: "счета и начисления", en: "invoices and charges" },
      { ro: "documente", ru: "документы", en: "documents" },
      { ro: "solicitări privind obiectul", ru: "обращения по объекту", en: "property requests" },
      { ro: "contactele responsabililor", ru: "контакты ответственных", en: "contacts of the people responsible" },
    ] satisfies Localized[],
  },
} as const;
