'use client';

import React, { useEffect } from 'react';
import { Box, Title } from '@mantine/core';
import { DynamicTable } from '@/components/HandballComponenets/StatsComponents/DynamicTable';
import { getLadder } from '@/ServerActions/TeamActions';
import { TeamStructure } from '@/ServerActions/types';

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
  const [columnState, setColumnState] = React.useState<string[]>(columns);
  const [ladder, setLadder] = React.useState<TeamStructure[]>();
  const [isPooled, setIsPooled] = React.useState<boolean>(false);
  const [poolTwo, setPoolTwo] = React.useState<TeamStructure[]>();
  const [pooledSortIndex, setPooledSortIndex] = React.useState<number>(sortIndex ?? 0);
  useEffect(() => {
    getLadder({ tournament, includeStats: true, formatData: true }).then((o) => {
      setIsPooled(o.pooled);
      if (o.pooled) {
        setLadder(o.poolOne);
        setPoolTwo(o.poolTwo);
      } else {
        setLadder(o.ladder);
      }
    });
  }, [tournament]);

  if (isPooled) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <Title order={4}>Pool One</Title>
        <DynamicTable<TeamStructure>
          columnsIn={columnState}
          setColumnsIn={setColumnState}
          sortIndexIn={pooledSortIndex}
          setSortIndexIn={setPooledSortIndex}
          objToLink={(o) => linkTo(o, tournament)}
          data={ladder}
          editable={editable}
          maxRows={Math.floor(maxRows / 2)}
        ></DynamicTable>
        <Title order={4}>Pool Two</Title>
        <DynamicTable
          columnsIn={columnState}
          sortIndexIn={pooledSortIndex}
          setSortIndexIn={setPooledSortIndex}
          objToLink={(o) => linkTo(o, tournament)}
          data={poolTwo}
          editable={false}
          maxRows={Math.floor(maxRows / 2)}
        ></DynamicTable>
      </Box>
    );
  }
  return (
    <DynamicTable
      columnsIn={columns}
      sortIndexIn={sortIndex}
      objToLink={(o) => linkTo(o, tournament)}
      data={ladder}
      editable={editable}
      maxRows={maxRows}
    ></DynamicTable>
  );
}
