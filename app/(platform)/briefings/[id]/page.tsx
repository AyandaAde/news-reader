import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformBriefingScreen } from "@/components/platform/briefing-screen";
import { getBriefingById, topBriefingsItems } from "@/lib/platform-briefings";

type BriefingPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return topBriefingsItems.map((briefing) => ({ id: briefing.id }));
}

export async function generateMetadata({
  params,
}: BriefingPageProps): Promise<Metadata> {
  const { id } = await params;
  const briefing = getBriefingById(id);

  if (!briefing) {
    return { title: "Briefing | EILO" };
  }

  return {
    title: `${briefing.title} | Your Briefings | EILO`,
    description: briefing.description,
  };
}

export default async function BriefingPage({ params }: BriefingPageProps) {
  const { id } = await params;
  const briefing = getBriefingById(id);

  if (!briefing) {
    notFound();
  }

  return <PlatformBriefingScreen briefing={briefing} />;
}
