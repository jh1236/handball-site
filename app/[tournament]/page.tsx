import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function TournamentPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <h1>This page is still a WIP!</h1>
      </SidebarLayout>
    </>
  );
}
