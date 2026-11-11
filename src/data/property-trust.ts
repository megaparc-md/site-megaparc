/**
 * Official verification — cadastral numbers the OWNER approved for publication (OWNER "OVERNIGHT RELEASE",
 * 2026-11-09 §5). A property without an approved number shows no verification block; numbers are never guessed.
 * The e-Cadastru portal has no public deep link per property: the visitor copies the number and searches it there.
 */
export const cadastreNumbers: Partial<Record<string, string>> = {
  // OWNER «MOSCOVA 20 — OWNER CADASTRAL NUMBER UPDATE» (2026-11-11): OWNER CONFIRMED 0100414.117 — supersedes the earlier 0100414.117.01.254
  "moscova-20": "0100414.117",
  // OWNER R3.3.1 §8 (2026-11-10): Creangă 78 cadastral number approved for the e-Cadastru verification
  "creanga-78": "0100514.140.01.120",
};

export const eCadastruPortal = "https://www.cadastru.md/ecadastru/f?p=100:1::::::#";
