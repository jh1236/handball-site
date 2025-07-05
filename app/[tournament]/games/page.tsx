import React from 'react';
import { Title } from '@mantine/core';
import { OfficialPageArgs } from '@/app/types';
import { Games } from '@/components/HandballComponenets/Games';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function GamesPage({ params }: OfficialPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Title>Games</Title>
        <Games tournament={tournament!}></Games>
      </SidebarLayout>
    </>
  );
}
