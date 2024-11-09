import React from 'react';
import { TournamentPageArgs } from '@/app/[tournament]/types';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function IndividualTeamPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <IndividualTeam tournament={tournament}></IndividualTeam>
      </SidebarLayout>
    </>
  );
}
