"use client";

import { useEffect } from "react";

/**
 * OWNER review helper (preview edition only — aerial-annotation.tsx never renders it in production): «?aerial=a» or «?aerial=b»
 * in the address switches the aerial annotation between the two variants prepared for the «LOCATION VISUAL INTELLIGENCE R4» review.
 * Without the parameter the recommended variant set in the markup stays.
 */
export function AerialVariantSwitch() {
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("aerial")?.toLowerCase();
    if (wanted !== "a" && wanted !== "b") return;
    document.querySelectorAll<HTMLElement>(".lg-air").forEach((figure) => { figure.dataset.variant = wanted; });
  }, []);
  return null;
}
