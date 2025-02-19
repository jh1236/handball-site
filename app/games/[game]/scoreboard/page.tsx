import React from 'react';
import { GamePageArgs } from '@/app/types';
import { TournamentScoreboard } from '@/components/HandballComponenets/GamePageComponents/TournamentScoreboard';

export default async function GamesPage({ params }: GamePageArgs) {
  const { game } = await params;
  return <TournamentScoreboard gameID={+game} />;
}
