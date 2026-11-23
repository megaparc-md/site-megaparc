import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { d31Reconciliation } from "@/data/dacia-31-reconciliation";
import { isProductionEdition } from "@/lib/site-data";

/**
 * DACIA 31 — THE RECONCILIATION REGISTER (OWNER addendum «DACIA 31 · ARCHITECTURAL PLANS», 2026-11-23): the plans' room schedules against the
 * figures drawn inside the drawings, and the lease register against the plans. Internal OWNER page: preview edition only (the production build
 * returns 404 and package-production removes every owner-demo path but the tenant cabinet), noindex · nofollow, linked from nowhere public.
 * No tenant name, no rent — register refs, areas and statuses only. Nothing is corrected or merged; the page lists, the OWNER decides.
 */
export const metadata: Metadata = {
  title: "Dacia 31 · реестр расхождений · OWNER",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null, languages: {} },
  openGraph: null,
  twitter: null,
};

const n = (v: number | null | undefined, digits = 2) => (v == null ? "—" : v.toLocaleString("ru-RU", { minimumFractionDigits: digits, maximumFractionDigits: 3 }).replace(/\s/g, " "));
const statusRu: Record<string, string> = { free: "свободно", occupied: "занято", "to-confirm": "уточняется", service: "общее / техническое", "not-offered": "не сдаётся" };
// the plan's Romanian room names in Russian (the page is the OWNER's working document; the originals stay in the PDFs)
const nameRu = (raw: string) => {
  const m = raw.match(/^Oficiu (.+?)( Sala de sedinta)?$/);
  if (m) return m[2] ? `Переговорная ${m[1]}` : `Офис ${m[1]}`;
  const map: Record<string, string> = { "Sală polivalentă": "Универсальный зал", "Încăpere depozit": "Складское помещение", "Lavoar": "Умывальная", "WC femei": "Санузел женский", "WC bărbaţi": "Санузел мужской", "WC": "Санузел", "Electric room": "Электрощитовая", "Încăpere auxiliară": "Вспомогательное помещение", "Rampa": "Рампа", "Hol scara": "Лестничный холл", "Vestibul": "Вестибюль", "Cameră fumători": "Курительная", "Coridor": "Коридор", "Încăpere tehnica": "Техническое помещение", "Încăpere tehnica lift": "Машинное помещение лифта", "Tambur": "Тамбур", "Cazangerie": "Котельная", "Terasa №1": "Терраса №1", "(drawn, not in the schedule)": "(начерчено, нет в экспликации)" };
  return map[raw] ?? raw;
};
const regRu: Record<string, string> = { FREE: "свободно", BUSY: "занято", "BUSY-FREE": "занято → освобождается" };

export default function Page() {
  if (isProductionEdition) notFound();
  const r = d31Reconciliation;
  const drawing = r.plan.filter((p) => (p.diff && p.diff !== 0) || p.schedule == null || p.parts);
  return (
    <main className="lg-page rc-page" lang="ru">
      <section className="lg-sec">
        <div className="xp-shell rc" lang="ru">
          <p className="lg-label">OWNER · внутренний документ · не для публикации</p>
          <h1 className="rc-title">Dacia 31 — реестр соответствия и расхождений</h1>
          <p className="rc-lead">Источники: архитектурные планы пяти уровней (PDF, 23.11.2026) и реестр аренды «INFORMAȚIA CHIRIA DACIA 31» (Excel, 23.11.2026). Без имён арендаторов и коммерческих условий. Площади не исправлялись и не объединялись — расхождения перечислены для решения OWNER.</p>

          <h2 className="rc-h2">1. Итоги уровней: план и реестр аренды</h2>
          <table className="rc-table">
            <thead><tr><th>Уровень (чертёж)</th><th>Сумма строк экспликации</th><th>Итог в экспликации</th><th>Реестр аренды</th><th>Разница</th></tr></thead>
            <tbody>
              {r.sums.map((s) => {
                const key = s.level.startsWith("PLAN SUBSOL") ? "Subsol" : s.level.startsWith("PLAN NIVEL 1") ? "Parter" : s.level.startsWith("PLAN NIVEL 2") ? "Nivelul 2" : null;
                const reg = key ? r.register.find((x) => x.ref === key) : null;
                return (
                  <tr key={s.level}>
                    <td>{s.level}</td>
                    <td>{n(s.schedule)} м²</td>
                    <td>{n(s.total)} м²{s.totalNoPartitions ? ` (без перегородок — ${n(s.totalNoPartitions)} м²)` : ""}{Math.abs(s.schedule - s.total) > 0.011 ? " · ≠ сумме строк" : ""}</td>
                    <td>{reg ? `${n(reg.area)} м² · ${regRu[reg.status] ?? reg.status}` : "—"}</td>
                    <td>{reg ? `${n(Math.round((reg.area - s.total) * 100) / 100)} м²` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2 className="rc-h2">2. Расхождения внутри чертежей (экспликация ↔ цифра на плане)</h2>
          <table className="rc-table">
            <thead><tr><th>Чертёж</th><th>№</th><th>Помещение</th><th>Экспликация</th><th>На чертеже</th><th>Комментарий</th></tr></thead>
            <tbody>
              {drawing.map((p) => (
                <tr key={`${p.level}-${p.no}`}>
                  <td>{p.level.split(" · ")[0]}</td>
                  <td>{p.no}</td>
                  <td>{nameRu(p.name)}</td>
                  <td>{p.schedule == null ? "нет в экспликации" : `${n(p.schedule)} м²`}</td>
                  <td>{p.parts ? `${n(p.parts[0])} + ${n(p.parts[1])} м²` : p.drawn == null ? "—" : `${n(p.drawn)} м²`}</td>
                  <td>{p.parts ? "сумма двух частей на чертеже = экспликации (не расхождение)" : p.schedule == null ? "помещение начерчено, в экспликацию не внесено" : p.drawn != null && p.drawn > 60 && p.schedule < 30 ? "офисы 023–025 начерчены одним пространством; в экспликации — три помещения" : `разница ${n(p.diff ?? 0)} м²`}</td>
                </tr>
              ))}
              <tr><td>PLAN NIVEL 3 ETAJ 2</td><td>24, 25</td><td>Офис 022</td><td>19,22 и 38,75 м²</td><td>—</td><td>одно название «Офис 022» у двух помещений</td></tr>
            </tbody>
          </table>

          <h2 className="rc-h2">3. Реестр аренды → архитектурные планы</h2>
          <table className="rc-table">
            <thead><tr><th>Реестр (№)</th><th>Площадь по реестру</th><th>Статус по реестру</th><th>Соответствие на планах</th></tr></thead>
            <tbody>
              {r.register.map((x) => (
                <tr key={x.ref}><td>{x.ref === "(large unit)" ? "крупный блок (без номера)" : x.ref}</td><td>{n(x.area)} м²</td><td>{regRu[x.status] ?? x.status}</td><td>{x.plan === "not found on the supplied plans" ? "на переданных планах не найдено" : x.plan === "no matching unit on the supplied plans" ? "соответствующего помещения на планах нет" : x.plan.replace(/Nivel 3 room /g, "3‑й этаж, пом. ").replace(/PLAN (.+?) total/, "PLAN $1 — итог")}</td></tr>
              ))}
            </tbody>
          </table>

          <h2 className="rc-h2">4. Помещения планов: статус на интерактивном плане</h2>
          <table className="rc-table">
            <thead><tr><th>Чертёж</th><th>№</th><th>Помещение</th><th>Экспликация</th><th>Статус</th><th>Основание</th></tr></thead>
            <tbody>
              {r.plan.filter((p) => p.status !== "service").map((p) => (
                <tr key={`s-${p.level}-${p.no}`}><td>{p.level.split(" · ")[0]}</td><td>{p.no}</td><td>{nameRu(p.name)}</td><td>{p.schedule == null ? "—" : `${n(p.schedule)} м²`}</td><td>{statusRu[p.status] ?? p.status}</td><td>{p.regNote ?? (p.status === "free" ? "уровень свободен по реестру" : p.status === "occupied" ? "реестр: занято" : p.status === "not-offered" ? "технический этаж" : "—")}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="rc-note">Решения OWNER по каждой строке переносятся в данные (src/data/dacia-31-plans.ts → статус, src/data/dacia-31-spaces.ts → ownerApproved); каталог на сайте читает только их.</p>
        </div>
      </section>
    </main>
  );
}
