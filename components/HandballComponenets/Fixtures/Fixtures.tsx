'use client';

import React from 'react';
import { Text } from '@mantine/core';
import FixturesInternal from '@/components/HandballComponenets/Fixtures/FixturesInternal';

interface FixturesProps {
  maxRounds?: number;
  tournament: string;
}

export default function Fixtures({ maxRounds = -1, tournament }: FixturesProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <>
      <Text onClick={() => setExpanded(!expanded)} hiddenFrom="md">
        <i>{expanded ? 'See Less' : 'See More'}</i>
      </Text>
      <br></br>
      <FixturesInternal
        maxRounds={maxRounds}
        tournament={tournament}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </>
  );
}
