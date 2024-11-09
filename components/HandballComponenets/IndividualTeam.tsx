'use client';

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { fetcher, SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';

interface TeamResults {
  team: TeamStructure;
}

interface TeamsProps {
  tournament: string;
  team
}

export default function Teams({ tournament }: TeamsProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = `${SERVER_ADDRESS}/api/teams`;
  if (tournament) {
    url = `${url}?tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<TeamResults>(url, fetcher);
  const [chartData, setchartData] = React.useState<TeamStructure | undefined>(undefined);
  useEffect(() => {
    setchartData(data?.team);
  }, [data]);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';
  return 'asd';
}
