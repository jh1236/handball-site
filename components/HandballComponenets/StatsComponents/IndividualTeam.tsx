'use client';

import React, { useEffect } from 'react';
import { Text, Title } from '@mantine/core';
import { TeamStructure } from '@/components/HandballComponenets/StatsComponents/types';
import { getTeam } from '@/ServerActions/TeamActions';

interface TeamsProps {
  tournament?: string;
  team: string;
}

export default function IndividualTeam({ tournament, team }: TeamsProps) {
  const [chartData, setChartData] = React.useState<TeamStructure | undefined>(undefined);
  useEffect(() => {
    getTeam(team, tournament, true).then((o) => setChartData(o.team));
  }, [team, tournament]);

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
