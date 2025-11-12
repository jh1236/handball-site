import React from 'react';
import { GamePageArgs } from '@/app/types';
import { Scoreboard } from '@/components/HandballComponenets/GamePageComponents/Scoreboard';

export default async function GamesPage({ params }: GamePageArgs) {
  const { game } = params;
  return <Scoreboard gameID={+game} />;
}
