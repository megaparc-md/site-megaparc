import { dacia31PlanLevels } from "@/data/dacia-31-plans";

/**
 * DACIA 31 — figures derived from the architectural plans (OWNER addendum «DACIA 31 · ARCHITECTURAL PLANS», 2026-11-23): the free area
 * (halls, storage and the level-2 open space whose status is free — the plans' own schedules, summed, never corrected) and the counts the
 * hero and the summary cards read. The lease-register figures stay in the internal reconciliation only.
 */
const rooms = dacia31PlanLevels.flatMap((lv) => lv.rooms);
export const planFreeArea = Math.round(rooms.filter((r) => r.status === "free" && r.area != null).reduce((sum, r) => sum + (r.area ?? 0), 0) * 100) / 100;
export const planCounts = {
  freeCommercial: rooms.filter((r) => r.status === "free" && r.scenario === "commercial").length,
  officesToConfirm: rooms.filter((r) => r.status === "to-confirm" && r.scenario === "office").length,
  officesOccupied: rooms.filter((r) => r.status === "occupied" && r.scenario === "office").length,
};
