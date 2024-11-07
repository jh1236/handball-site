import React from 'react';
import { TournamentPageArgs } from '@/app/[tournament]/types';
import Ladder from '@/components/HandballComponenets/Ladder';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function LadderPage({ params }: TournamentPageArgs) {
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
