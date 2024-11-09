import React from 'react';
import { Text } from '@mantine/core';
import { TournamentPageArgs } from '@/app/[tournament]/types';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function GamesPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Text>I am a WIP!!</Text>
      </SidebarLayout>
    </>
  );
}
