'use client';

import React, { useEffect } from 'react';
import { DynamicTable } from '@/components/HandballComponenets/StatsComponents/DynamicTable';
import { TeamStructure } from '@/components/HandballComponenets/StatsComponents/types';
import { getLadder } from '@/ServerActions/TeamActions';

function linkTo(team: TeamStructure, tournament?: string): string {
  if (tournament) {
    return `/${tournament}/teams/${team.searchableName}`;
  }
  return `/teams/${team.searchableName}`;
}

interface LadderProps {
  maxRows?: number;
  tournament?: string;
  columns?: string[];
  sortIndex?: number;
  editable?: boolean;
}

export default function Ladder({
  maxRows = -1,
  tournament,
  columns = ['Percentage', 'Elo'],
  editable = true,
  sortIndex,
}: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [ladder, setLadder] = React.useState<TeamStructure[]>();
  useEffect(() => {
    getLadder(tournament, true, true).then((o) => {
      setLadder(o.ladder);
    });
  }, [tournament]);
  return (
    <DynamicTable
      columns={columns}
      sortIndexIn={sortIndex}
      objToLink={(o) => linkTo(o, tournament)}
      data={ladder ?? []}
      editable={editable}
      maxRows={maxRows}
    ></DynamicTable>
  );
}
