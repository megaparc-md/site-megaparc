/**
 * Official verification — cadastral numbers the OWNER approved for publication (OWNER "OVERNIGHT RELEASE",
 * 2026-11-09 §5). A property without an approved number shows no verification block; numbers are never guessed.
 * The e-Cadastru portal has no public deep link per property: the visitor copies the number and searches it there.
 */
export const cadastreNumbers: Partial<Record<string, string>> = {
  // OWNER «MOSCOVA 20 — OWNER CADASTRAL NUMBER UPDATE» (2026-11-11): OWNER CONFIRMED 0100414.117 — the number of the property for the
  // e-Cadastru verification. The premises' own numbers are a separate list below (OWNER R9 addendum, 2026-11-13)
  "moscova-20": "0100414.117",
  // OWNER R3.3.1 §8 (2026-11-10): Creangă 78 cadastral number approved for the e-Cadastru verification
  "creanga-78": "0100514.140.01.120",
};

/**
 * The cadastral numbers of the PREMISES offered for lease (OWNER R9 addendum «Кадастровые номера», 2026-11-13) — the numbers of our
 * premises, NOT of the whole building and NOT of the land plot. Shown as one quiet line beside the documentary data of the property
 * («Кадастровые номера помещений: …»); never in the hero, never as a card, never assigned to the ground floor or the lower ground —
 * no number-to-level correspondence is confirmed.
 */
export const premisesCadastre: Partial<Record<string, string[]>> = {
  "moscova-20": ["0100414.117.01.268", "0100414.117.01.254"],
};

export const eCadastruPortal ="https://www.cadastru.md/ecadastru/f?p=100:1::::::#";
