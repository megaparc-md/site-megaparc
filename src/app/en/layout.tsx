import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/root-document";
import { pageMetadata, siteUrl } from "@/lib/seo";
import "../globals.css";
import "../experience.css";
import "../leasing.css";
import "../history.css";
import "../alive.css";
import "../premium.css";
import "../leasing-experience.css";
import "../r3.css";
import "../r4.css";
import "../leasing-toolkit.css";

/** Root layout for the EN edition: static HTML is served with lang="en". */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata("en", "home", "/"),
};

export default function ENRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
