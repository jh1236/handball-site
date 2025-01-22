'use client';

import React, { useEffect } from 'react';
import { Text, Title } from '@mantine/core';
import { PersonStructure } from '@/components/HandballComponenets/StatsComponents/types';
import { getPlayer } from '@/ServerActions/PlayerActions';

interface PlayersProps {
  tournament?: string;
  player: string;
}

export default function IndividualPlayer({ tournament, player }: PlayersProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [chartData, setChartData] = React.useState<PersonStructure | undefined>(undefined);
  useEffect(() => {
    getPlayer(player, tournament, undefined, true).then((o) => setChartData(o.player));
  }, [player, tournament]);
  return (
    <>
      <Title>{chartData?.name}</Title>
      {Object.entries(chartData?.stats ?? {}).map(([key, stat], index) => (
        <Text key={index}>
          {key}: {stat}
        </Text>
      ))}
    </>
  );
}
