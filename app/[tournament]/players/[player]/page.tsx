import React from 'react';
import { PlayerPageArgs } from '@/app/types';
import IndividualPlayer from '@/components/HandballComponenets/StatsComponents/IndividualPlayer';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function IndividualPlayerPage({ params }: PlayerPageArgs) {
  const { tournament, player } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <IndividualPlayer tournament={tournament} player={player}></IndividualPlayer>
      </SidebarLayout>
    </>
  );
}
