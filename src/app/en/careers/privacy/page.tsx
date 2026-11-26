import type { Metadata } from "next";
import { CandidatePrivacyPage } from "@/components/pages/candidate-privacy";
import { candidatePrivacyMetadata } from "@/lib/seo";

/** Candidate privacy notice (Codex P1-02) — production keeps this route only once the notice is approved (scripts/package-production.mjs). */
export const metadata: Metadata = candidatePrivacyMetadata("en");

export default function Page() {
  return <CandidatePrivacyPage locale="en" />;
}
