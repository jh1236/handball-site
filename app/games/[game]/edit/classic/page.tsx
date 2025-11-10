import React from 'react';
import { GamePageArgs } from '@/app/types';
import { ClassicEditGame } from '@/components/HandballComponenets/GameEditingComponenets/Classic/ClassicEditGame';

export default async function GamesPage({ params }: GamePageArgs) {
  const { game } = await params;
  return <ClassicEditGame game={Number(game)} />;
}
