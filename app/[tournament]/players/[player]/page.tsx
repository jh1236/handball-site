import React from 'react';
import { PlayerPageArgs } from '@/app/[tournament]/types';
import IndividualPlayer from '@/components/HandballComponenets/IndividualPlayer';
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
