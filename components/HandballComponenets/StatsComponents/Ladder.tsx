'use client';

import React from 'react';
import useSWR from 'swr';
import { tokenFetcher } from '@/components/HandballComponenets/ServerActions';
import { DynamicTable } from '@/components/HandballComponenets/StatsComponents/DynamicTable';

interface LadderResults {
  pooled: boolean;
  ladder?: TeamStructure[];
  pool_one?: TeamStructure[];
  pool_two?: TeamStructure[];
}

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
  editable?: boolean;
}

export default function Ladder({
  maxRows = -1,
  tournament,
  columns = ['Percentage', 'Elo'],
  editable = true,
}: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = '/api/teams/ladder/?includeStats=true&formatData=true';
  if (tournament) {
    url = `${url}&tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<LadderResults>(url, tokenFetcher);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';

  return (
    <DynamicTable
      columns={columns}
      objToLink={(o) => linkTo(o, tournament)}
      data={data?.ladder ?? []}
      editable={editable}
      maxRows={maxRows}
    >
    </DynamicTable>
  );
}
