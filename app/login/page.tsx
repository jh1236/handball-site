import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import { AuthenticationTitle } from '@/components/Authentication/AuthenticationTitle';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function GamesPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <>
      <SidebarLayout tournamentName={tournament}>
        <AuthenticationTitle></AuthenticationTitle>
      </SidebarLayout>
    </>
  );
}
