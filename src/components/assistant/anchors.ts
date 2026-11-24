/**
 * In-page targets of the assistant's actions: a section of the page («#plans») or one of its drawers («#economics» → the
 * dialog `lg-drawer-economics`, opened by the drawer's own hash listener). An action lists candidate ids because the same
 * tool may carry another id on another template (the land calculator: «model» or «scenario»); the first that exists wins.
 */
export const GOTO_KEY = "mca:goto";

export const anchorExists = (candidates: string[]) => candidates.some((id) => document.getElementById(id) || document.getElementById(`lg-drawer-${id}`));

export function openAnchor(candidates: string[]): boolean {
  for (const id of candidates) {
    const drawer = document.getElementById(`lg-drawer-${id}`);
    const section = document.getElementById(id);
    if (!drawer && !section) continue;
    if (window.location.hash === `#${id}`) {
      // already the current hash: the drawer listens to `hashchange`, a section only needs the scroll
      if (drawer) window.dispatchEvent(new HashChangeEvent("hashchange"));
      else section?.scrollIntoView({ block: "start" });
    } else window.location.hash = `#${id}`;
    return true;
  }
  return false;
}
