import { getSeasonById, getFixturesBySeason } from "@/lib/actions/seasons";
import { notFound } from "next/navigation";
import FixtureClient from "./_components/fixture-client";
import { Suspense } from "react";

interface FixturePageProps {
  params: {
    seasonId: string;
  };
}

export default async function FixturePage({ params }: FixturePageProps) {
  const season = await getSeasonById(params.seasonId);
  if (!season) {
    notFound();
  }
  const fixtures = await getFixturesBySeason(params.seasonId);

  return (
    <Suspense fallback={<div>Cargando fixture...</div>}>
      <FixtureClient season={season} fixtures={fixtures} />
    </Suspense>
  );
}
