import React from 'react';
import { TeamPageArgs } from '@/app/[tournament]/types';
import IndividualTeam from '@/components/HandballComponenets/IndividualTeam';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function IndividualTeamPage({ params }: TeamPageArgs) {
  const { tournament, team } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <IndividualTeam tournament={tournament} team={team}></IndividualTeam>
      </SidebarLayout>
    </>
  );
}
