import React from 'react';
import { GamePageArgs } from '@/app/types';
import { GamePage } from '@/components/HandballComponenets/GamePage';

export default async function GamesPage({ params }: GamePageArgs) {
  const { game } = await params;

  return (
    <>
      <GamePage gameID={+game}></GamePage>
    </>
  );
}
