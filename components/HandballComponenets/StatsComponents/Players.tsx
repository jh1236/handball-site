'use client';

import React, { useEffect } from 'react';
import { DynamicTable } from '@/components/HandballComponenets/StatsComponents/DynamicTable';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { PersonStructure } from '@/ServerActions/types';

interface LadderProps {
  maxRows?: number;
  tournament?: string;
  columns?: string[];
  editable?: boolean;
  sortIndex?: number;
  playersIn?: PersonStructure[] | null;
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
  playersIn,
  editable = true,
}: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [players, setPlayers] = React.useState<PersonStructure[]>();

  useEffect(() => {
    if (playersIn !== undefined) {
      setPlayers(playersIn || undefined);
    } else {
      getPlayers({
        tournament,
        team: undefined,
        includeStats: true,
        formatData: true,
      }).then((o) => setPlayers(o.players));
    }
  }, [playersIn, tournament]);
  return (
    <DynamicTable
      columns={columns}
      objToLink={(o) => linkTo(o, tournament)}
      sortIndexIn={sortIndex}
      data={players}
      editable={editable}
      maxRows={maxRows}
    ></DynamicTable>
  );
}
