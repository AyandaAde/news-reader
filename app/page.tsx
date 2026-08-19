"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturesSection } from "@/components/features-section";
import { IntegrationSection } from "@/components/integration-section";
import { DownloadAppSection } from "@/components/download-app-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SectionNavHighlight } from "@/components/section-nav-highlight";
import { Leva } from "leva";

export default function Home() {
  return (
    <>
      <SectionNavHighlight />
      <Header />
      <main>
        <Hero />
        <FeaturesSection />
        <IntegrationSection />
        <DownloadAppSection />
        <CtaSection />
      </main>
      <Footer />
      <Leva hidden />
    </>
  );
}
