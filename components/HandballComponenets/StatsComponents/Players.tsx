'use client';

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { tokenFetcher } from '@/components/HandballComponenets/ServerActions';
import { DynamicTable } from '@/components/HandballComponenets/StatsComponents/DynamicTable';
import { PersonStructure } from '@/ServerActions/types';
import { getPlayer, getPlayers } from '@/ServerActions/PlayerActions';

interface LadderProps {
  maxRows?: number;
  tournament?: string;
  columns?: string[];
  editable?: boolean;
  sortIndex?: number;
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
  sortIndex,
  editable = true,
}: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [players, setPlayers] = React.useState<PersonStructure[]>();

  useEffect(() => {
    getPlayers({ tournament, team: undefined, includeStats: true, formatData: true }).then((o) => setPlayers(o.players));
  }, [tournament]);
  return (
    <DynamicTable
      columns={columns}
      objToLink={(o) => linkTo(o, tournament)}
      sortIndexIn={sortIndex}
      data={players ?? []}
      editable={editable}
      maxRows={maxRows}
    >
    </DynamicTable>
  );
}
