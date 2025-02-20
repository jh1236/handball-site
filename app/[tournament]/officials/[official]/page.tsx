import React from 'react';
import { Title } from '@mantine/core';
import { OfficialPageArgs } from '@/app/types';
import IndividualOfficial from '@/components/HandballComponenets/StatsComponents/IndividualOfficial';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function IndividualOfficialPage({ params }: OfficialPageArgs) {
  const { tournament, official } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Title>Official</Title>
        <IndividualOfficial tournament={tournament} official={official}></IndividualOfficial>
      </SidebarLayout>
    </>
  );
}
