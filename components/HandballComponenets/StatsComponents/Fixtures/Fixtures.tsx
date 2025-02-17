'use client';

import React from 'react';
import { Text } from '@mantine/core';
import FixturesInternal from '@/components/HandballComponenets/StatsComponents/Fixtures/FixturesInternal';

interface FixturesProps {
  maxRounds?: number;
  tournament: string;
  expandable?: boolean;
}

export default function   Fixtures({ maxRounds = -1, tournament, expandable = true }: FixturesProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <>
      {expandable && (
        <Text onClick={() => setExpanded(!expanded)} hiddenFrom="md">
          <i>{expanded ? 'See Less' : 'See More'}</i>
        </Text>
      )}
      <br></br>
      <FixturesInternal
        maxRounds={maxRounds}
        tournament={tournament}
        expandable={expandable}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </>
  );
}
