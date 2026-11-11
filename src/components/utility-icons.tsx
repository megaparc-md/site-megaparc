/**
 * UTILITY ICONS — one monochrome line family for the share / contact utilities (OWNER «MOSCOVA 20 PREMIUM LEASING DOSSIER R2»
 * §14 · §24, 2026-11-11): the same stroke logic (1.6), the same 24 px box, currentColor only — never emoji, never Unicode symbols,
 * never coloured brand bubbles. Telegram and WhatsApp keep their recognisable silhouettes, drawn as line icons so they sit in the
 * MEGAPARC graphite / burgundy UI. Used on the website (share row, digital dossier block, cabinet demo) and in the printed dossier.
 */
export type UtilityIconName = "telegram" | "whatsapp" | "mail" | "phone" | "link" | "qr" | "download" | "plan" | "share";

const paths: Record<UtilityIconName, React.ReactNode> = {
  // paper plane
  telegram: <path d="M21 4.5 3.6 11.4c-.8.3-.8 1.2 0 1.5l4.4 1.5 1.7 5.1c.2.6.9.8 1.4.3l2.4-2.3 4.6 3.4c.6.4 1.3.1 1.5-.6L22 5.7c.2-.8-.4-1.4-1-1.2ZM8.6 14.1l9.9-6.2-7.9 7.3-.4 3.4-1.6-4.5Z" />,
  // speech bubble with handset
  whatsapp: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9.2 8.4c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.4.7 1 1.4 1.6 1.9.7.5 1.3.8 1.7 1 .2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5-.1.6-.4 1.3-1 1.6-.6.4-1.4.5-2.3.2-1.1-.3-2.4-1-3.6-2.1-1.1-1.1-1.9-2.3-2.3-3.4-.4-1-.3-1.8.1-2.5Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: <path d="M6.6 3.5h2.3c.5 0 .9.3 1 .8l.8 3.3c.1.4 0 .8-.3 1.1L9 10.1a12.6 12.6 0 0 0 4.9 4.9l1.4-1.4c.3-.3.7-.4 1.1-.3l3.3.8c.5.1.8.5.8 1v2.3c0 1.2-1 2.1-2.2 2A16.5 16.5 0 0 1 4.6 5.7c-.1-1.2.8-2.2 2-2.2Z" />,
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <path d="M13.5 13.5h3v3h-3zM18.5 13.5h2M20.5 15.5v2M16.5 18.5v2h-3M18.5 18.5h2v2" />
    </>
  ),
  download: <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />,
  plan: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" />
      <path d="M3.5 12h7V3.5M10.5 12v8.5M10.5 15.5h10" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="17" cy="6" r="2.3" />
      <circle cx="17" cy="18" r="2.3" />
      <path d="m8.1 10.9 6.8-3.8M8.1 13.1l6.8 3.8" />
    </>
  ),
};

export function UtilityIcon({ name, size = 18, className = "" }: { name: UtilityIconName; size?: number; className?: string }) {
  return (
    <svg className={`uicon uicon--${name} ${className}`.trim()} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
