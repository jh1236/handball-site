'use client';

import React, { useEffect } from 'react';
import { Box, Text, Title } from '@mantine/core';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure } from '@/ServerActions/types';

interface GamePageProps {
  gameID: number;
}

export function GamePage({ gameID }: GamePageProps) {
  const [game, setGame] = React.useState<GameStructure>();
  localStorage.getItem('permissions')
  useEffect(() => {
    getGame({ gameID }).then(setGame);
  }, [gameID]);
  if (!game) {
    return <SidebarLayout>Loading...</SidebarLayout>;
  }
  return (
    <SidebarLayout tournamentName={game?.tournament.searchableName}>
      <Box style={{ textAlign: 'center' }}>
        <Title order={1}>
          {game.teamOne.name} vs {game.teamTwo.name}
        </Title>
        <Text style={{ fontSize: '100px' }}>
          {game.teamOneScore} - {game.teamTwoScore}
        </Text>
        <Text>
          <b>Round:</b> {game.round}
        </Text>
        {game.tournament.twoCourts && (
          <Text>
            <b>Court:</b> {game.court + 1}
          </Text>
        )}
        <Text>
          <b>Official:</b> {game?.official?.name ?? '-'}
        </Text>
        <Text>
          <b>Status:</b> {game.status}
        </Text>
        <Text>
          <b>Best on Court:</b> {game?.bestPlayer?.name ?? '-'}
        </Text>
      </Box>
    </SidebarLayout>
  );
}
