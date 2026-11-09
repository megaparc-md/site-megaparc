/**
 * Official verification — cadastral numbers the OWNER approved for publication (OWNER "OVERNIGHT RELEASE",
 * 2026-11-09 §5). A property without an approved number shows no verification block; numbers are never guessed.
 * The e-Cadastru portal has no public deep link per property: the visitor copies the number and searches it there.
 */
export const cadastreNumbers: Partial<Record<string, string>> = {
  "moscova-20": "0100414.117.01.254",
};

export const eCadastruPortal = "https://www.cadastru.md/ecadastru/f?p=100:1::::::#";
