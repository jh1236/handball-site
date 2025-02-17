import React from 'react';
import { Title } from '@mantine/core';
import { OfficialPageArgs } from '@/app/types';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function IndividualOfficialPage({ params }: OfficialPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <Title>This page is a WIP</Title>
      </SidebarLayout>
    </>
  );
}
