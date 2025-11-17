import React from 'react';
import { GamePageArgs } from '@/app/types';
import { GamePage } from '@/components/HandballComponenets/GamePageComponents/GamePage';

export default async function GamesPage({ params }: GamePageArgs) {
  const { game } = params;

  return (
    <>
      <GamePage gameID={+game}></GamePage>
    </>
  );
}
