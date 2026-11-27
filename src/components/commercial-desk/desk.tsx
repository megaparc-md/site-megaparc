"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ClientCard, NewVisit, VisitCard, type Ctx } from "@/components/commercial-desk/cards";
import { Chat } from "@/components/commercial-desk/chat";
import { roleLabel } from "@/components/commercial-desk/labels";
import { Analytics, Clients, Deals, History, Requests, Schedule, Today, Visits, WeekCalendar, sectionCount, type SectionKey } from "@/components/commercial-desk/sections";
import { setAddress, useDeskState, useHash, useNow, useQuery } from "@/components/visit-planner/use-store";
import { can, type Permission } from "@/lib/visits/engine";

/**
 * COMMERCIAL DESK · OWNER DEMO — the employees' cabinet of the Visit Planner (OWNER «VISIT PLANNER & COMMERCIAL DESK V1», stage 1,
 * 2026-11-27). A front-end demonstration on the browser's own record: no sign-in, no server, no real person — the «employee» is
 * chosen from demonstration roles to show what each role sees and may do. The real cabinet sits behind the server's sign-in and
 * every permission is enforced there (docs/VISIT_PLANNER_ARCHITECTURE.md §6). Russian; never linked from a public page.
 */
const NAV: { key: SectionKey; label: string; needs?: Permission }[] = [
  { key: "today", label: "Сегодня" },
  { key: "chat", label: "Коммерческий чат", needs: "chat.read" },
  { key: "calendar", label: "Календарь" },
  { key: "requests", label: "Новые обращения" },
  { key: "visits", label: "Запланированные визиты" },
  { key: "clients", label: "Клиенты" },
  { key: "deals", label: "Переговоры" },
  { key: "history", label: "История взаимодействий" },
  { key: "analytics", label: "Аналитика", needs: "analytics.read" },
  { key: "schedule", label: "Расписание" },
];

export function CommercialDesk({ plannerHref, siteHref }: { plannerHref: string; siteHref: string }) {
  const state = useDeskState();
  const now = useNow();
  const hash = useHash();
  const query = useQuery();
  const [actorId, setActorId] = useState("s-m1");
  const params = useMemo(() => new URLSearchParams(query), [query]);
  // a card over the page (a visit, a client, a new visit) or a dialogue of the chat section — the address carries it, so a link can be shared
  const open = useCallback((target: { visit?: string; client?: string; create?: string; chat?: string } | null) => {
    if (target?.chat) return setAddress({ query: { visit: null, client: null, create: null, chat: target.chat }, hash: "chat" });
    setAddress({ query: { visit: target?.visit ?? null, client: target?.client ?? null, create: target?.create ?? null } });
  }, []);

  const actor = state?.staff.find((person) => person.id === actorId) ?? state?.staff[0] ?? null;
  const nav = NAV.filter((item) => !item.needs || (actor && can(actor.role, item.needs)));
  const section = (nav.find((item) => `#${item.key}` === hash)?.key ?? "today") as SectionKey;
  const ctx: Ctx | null = state && now && actor ? { state, now, actor, may: (permission) => can(actor.role, permission), open } : null;
  const visit = ctx && params.get("visit") ? ctx.state.visits.find((item) => item.id === params.get("visit")) ?? null : null;
  const client = ctx && params.get("client") ? ctx.state.clients.find((item) => item.id === params.get("client")) ?? null : null;
  const create = ctx?.may("visit.create") ? params.get("create") : null;

  return (
    <div className="cd" lang="ru">
      <p className="cd-band" role="note"><strong>OWNER DEMO · ТЕСТОВЫЕ ДАННЫЕ</strong><span>Прототип кабинета сотрудников. Клиенты, визиты и комментарии вымышлены; ничего не отправляется и не собирается.</span></p>
      <header className="cd-top">
        <div className="cd-top__brand"><span className="cd-top__mark">MEGAPARC</span><span className="cd-top__product">Commercial Desk</span><span className="cd-top__sub">коммерческий отдел · чат · визиты · переговоры</span></div>
        <div className="cd-top__who">
          <label className="cd-label" htmlFor="cd-actor">Вы вошли как (демо)</label>
          <select id="cd-actor" className="cd-select" value={actor?.id ?? actorId} onChange={(event) => setActorId(event.target.value)}>
            {(state?.staff ?? []).map((person) => <option key={person.id} value={person.id}>{person.name} — {roleLabel[person.role]}</option>)}
          </select>
        </div>
      </header>
      <div className="cd-frame">
        <nav className="cd-nav-list" aria-label="Разделы кабинета">
          {nav.map((item) => {
            const count = state ? sectionCount(state, item.key) : 0;
            return <a key={item.key} href={`#${item.key}`} className="cd-nav-item" aria-current={item.key === section ? "page" : undefined}><span>{item.label}</span>{count ? <b>{count}</b> : null}</a>;
          })}
          <div className="cd-nav-list__foot">
            <Link href={plannerHref}>Запись на просмотр — как видит клиент →</Link>
            <Link href={siteHref}>← Сайт MEGAPARC</Link>
          </div>
        </nav>
        <main className="cd-main" id="cd-main">
          {!ctx ? <p className="cd-muted">Загрузка демонстрации…</p>
            : section === "today" ? <Today ctx={ctx} />
            : section === "chat" ? <Chat ctx={ctx} selected={params.get("chat")} onSelect={(id) => setAddress({ query: { chat: id } })} />
            : section === "calendar" ? <WeekCalendar ctx={ctx} />
            : section === "requests" ? <Requests ctx={ctx} />
            : section === "visits" ? <Visits ctx={ctx} />
            : section === "clients" ? <Clients ctx={ctx} />
            : section === "deals" ? <Deals ctx={ctx} />
            : section === "history" ? <History ctx={ctx} />
            : section === "analytics" ? <Analytics ctx={ctx} />
            : <Schedule ctx={ctx} />}
        </main>
      </div>
      {ctx && create ? <NewVisit key={`n-${create}`} ctx={ctx} preset={create} /> : ctx && visit ? <VisitCard key={visit.id} ctx={ctx} visit={visit} /> : ctx && client ? <ClientCard key={client.id} ctx={ctx} client={client} /> : null}
    </div>
  );
}
