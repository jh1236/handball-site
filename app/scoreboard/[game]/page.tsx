import React from 'react';
import { GamePageArgs } from '@/app/types';
import { Scoreboard } from '@/components/HandballComponenets/Scoreboard';

export default async function GamesPage({ params }: GamePageArgs) {
  const { game } = await params;

  return (
    <>
      <Scoreboard gameId={+game}></Scoreboard>
    </>
  );
}
