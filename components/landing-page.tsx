"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturesSection } from "@/components/features-section";
import { PodcastCreationSection } from "@/components/podcast-creation-section";
import { IntegrationSection } from "@/components/integration-section";
import { DownloadAppSection } from "@/components/download-app-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SectionNavHighlight } from "@/components/section-nav-highlight";
import { Leva } from "leva";

export function LandingPage() {
  return (
    <>
      <SectionNavHighlight />
      <Header logoVariant="wordmark" />
      <main id="main-content">
        <Hero />
        <FeaturesSection />
        <PodcastCreationSection />
        <IntegrationSection />
        <DownloadAppSection />
        <CtaSection />
      </main>
      <Footer />
      <Leva hidden />
    </>
  );
}
