import { HeroSection } from '@/components/public/hero-section';
import { LeagueHighlights } from '@/components/public/league-highlights';
import { FeatureHighlights } from '@/components/public/feature-highlights';
import { CallToActionSection } from '@/components/public/cta-section';
import { LiveGamesBanner } from '@/components/public/live-games-banner';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<div className="h-12 bg-card" />}>
        <LiveGamesBanner />
      </Suspense>
      <HeroSection />
      <LeagueHighlights />
      <FeatureHighlights />
      <CallToActionSection />
    </div>
  );
}