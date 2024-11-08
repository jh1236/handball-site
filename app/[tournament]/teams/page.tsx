import React from 'react';
import { TournamentPageArgs } from '@/app/[tournament]/types';
import Teams from '@/components/HandballComponenets/Teams';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function TeamsPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <h1>Ladder</h1>
        <div>
          <Teams tournament={tournament}></Teams>
        </div>
      </SidebarLayout>
    </>
  );
}
