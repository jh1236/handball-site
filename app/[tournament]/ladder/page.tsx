import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import Ladder from '@/components/HandballComponenets/StatsComponents/Ladder';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function LadderPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <h1>Ladder</h1>
        <div>
          <Ladder tournament={tournament}></Ladder>
        </div>
      </SidebarLayout>
    </>
  );
}
