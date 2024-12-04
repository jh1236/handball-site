import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import Fixtures from '@/components/HandballComponenets/StatsComponents/Fixtures/Fixtures';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function FixturesPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <h1>Fixtures</h1>
        <Fixtures tournament={tournament!}></Fixtures>
      </SidebarLayout>
    </>
  );
}
