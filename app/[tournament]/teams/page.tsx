import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import Teams from '@/components/HandballComponenets/StatsComponents/Teams';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function TeamsPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <h1>Teams</h1>
        <div>
          <Teams tournament={tournament}></Teams>
        </div>
      </SidebarLayout>
    </>
  );
}
