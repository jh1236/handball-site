'use client';

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { Text, Title } from '@mantine/core';
import { tokenFetcher } from '@/components/HandballComponenets/ServerActions';

interface TeamResults {
  team: TeamStructure;
}

interface TeamsProps {
  tournament?: string;
  team: string;
}

export default function IndividualTeam({ tournament, team }: TeamsProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = `/api/teams/${team}?formatData=true`;
  if (tournament) {
    url = `${url}&tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<TeamResults>(url, tokenFetcher);
  const [chartData, setchartData] = React.useState<TeamStructure | undefined>(undefined);
  useEffect(() => {
    if (data) {
      setchartData(data?.team);
    }
  }, [data]);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';
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
