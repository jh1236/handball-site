'use client';

import React, { useEffect } from 'react';
import { b } from '@storybook/react/dist/public-types-1083bc5a';
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
  const [ladder, setLadder] = React.useState<TeamStructure[]>();
  const [isPooled, setIsPooled] = React.useState<boolean>(false);
  const [poolTwo, setPoolTwo] = React.useState<TeamStructure[]>();
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
        <Title order={3}>Pool One</Title>
        <DynamicTable
          columns={columns}
          sortIndexIn={sortIndex}
          objToLink={(o) => linkTo(o, tournament)}
          data={ladder ?? []}
          editable={editable}
          maxRows={Math.floor(maxRows / 2)}
        >
        </DynamicTable>
        <Title order={3}>Pool Two</Title>
        <DynamicTable
          columns={columns}
          sortIndexIn={sortIndex}
          objToLink={(o) => linkTo(o, tournament)}
          data={poolTwo ?? []}
          editable={false}
          maxRows={Math.floor(maxRows / 2)}
        ></DynamicTable>
      </Box>
    );
  }
  return (
    <DynamicTable
      columns={columns}
      sortIndexIn={sortIndex}
      objToLink={(o) => linkTo(o, tournament)}
      data={ladder ?? []}
      editable={editable}
      maxRows={maxRows}
    >
    </DynamicTable>
  );
}
