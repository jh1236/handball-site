import React from 'react';
import { Title } from '@mantine/core';
import { TournamentPageArgs } from '@/app/types';
import { Management } from '@/components/HandballComponenets/Management';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function ManagementPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Title>Management Page</Title>
        <Management tournament={tournament!}></Management>
      </SidebarLayout>
    </>
  );
}
