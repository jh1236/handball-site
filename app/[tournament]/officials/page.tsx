import React from 'react';
import { Title } from '@mantine/core';
import { TournamentPageArgs } from '@/app/types';
import Officials from '@/components/HandballComponenets/Officials';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function OfficialsPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Title>Officials</Title>
        <Officials tournament={tournament}></Officials>
      </SidebarLayout>
    </>
  );
}
