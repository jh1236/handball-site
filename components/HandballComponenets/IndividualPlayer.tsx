'use client';

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { Text, Title } from '@mantine/core';
import { fetcher, SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';

interface PlayerResults {
  player: PersonStructure;
}

interface PlayersProps {
  tournament: string;
  player: string;
}

export default function IndividualPlayer({ tournament, player }: PlayersProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = `${SERVER_ADDRESS}/api/players/${player}?formatData=true`;
  if (tournament) {
    url = `${url}&tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<PlayerResults>(url, fetcher);
  const [chartData, setchartData] = React.useState<PersonStructure | undefined>(undefined);
  useEffect(() => {
    if (data) {
      setchartData(data?.player);
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
