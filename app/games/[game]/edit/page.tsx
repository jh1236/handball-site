'use client';

import React from 'react';
import { GamePageArgs } from '@/app/types';
import { ClassicEditGame } from '@/components/HandballComponenets/GameEditingComponenets/Classic/ClassicEditGame';
import { EditGame } from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import { useUserSettings } from '@/components/hooks/userData';

export default function GamesPage({ params }: GamePageArgs) {
  const game = Number(params.game);
  const { useClassicScorer } = useUserSettings();
  if (useClassicScorer) {
    return <ClassicEditGame game={Number(game)} />;
  }
  return <EditGame game={Number(game)}></EditGame>;
}
