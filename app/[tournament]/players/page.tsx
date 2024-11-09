import React from 'react';
import { Title } from '@mantine/core';
import { TournamentPageArgs } from '@/app/[tournament]/types';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import Players from '@/components/HandballComponenets/Players';

export default async function PlayersPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Title>Players</Title>
        <Players tournament={tournament}></Players>
      </SidebarLayout>
    </>
  );
}
