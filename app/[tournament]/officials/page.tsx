import React from 'react';
import { Title } from '@mantine/core';
import { OfficialPageArgs } from '@/app/types';
import Officials from '@/components/HandballComponenets/Officials';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function OfficialsPage({ params }: OfficialPageArgs) {
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
