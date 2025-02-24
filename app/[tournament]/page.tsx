import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import { TournamentLanding } from '@/components/HandballComponenets/TournamentLanding';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function TournamentPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;

  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <TournamentLanding tournament={tournament!}></TournamentLanding>
      </SidebarLayout>
    </>
  );
}
