'use client';

import React from 'react';
import useSWR from 'swr';
import { tokenFetcher } from '@/components/HandballComponenets/ServerActions';
import { DynamicTable } from '@/components/HandballComponenets/StatsComponents/DynamicTable';

interface PlayersResults {
  players: PersonStructure[];
}

interface LadderProps {
  maxRows?: number;
  tournament?: string;
  columns?: string[];
  editable?: boolean;
}

function linkTo(player: PersonStructure, tournament?: string): string {
  if (tournament) {
    return `/${tournament}/players/${player.searchableName}`;
  }
  return `/players/${player.searchableName}`;
}

export default function Players({
  maxRows = -1,
  tournament,
  columns = ['B&F Votes', 'Elo'],
  editable = true,
}: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = '/api/players?includeStats=true&formatData=true';
  if (tournament) {
    url = `${url}&tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<PlayersResults>(url, tokenFetcher);
  if (error) {
    return `An error has occurred: ${error.message}`;
  }
  if (isLoading) {
    return 'Loading...';
  }

  return (
    <DynamicTable
      columns={columns}
      objToLink={(o) => linkTo(o, tournament)}
      data={data?.players ?? []}
      editable={editable}
      maxRows={maxRows}
    >
    </DynamicTable>
  );
}
