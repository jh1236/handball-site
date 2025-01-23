'use client';

import React, { useEffect } from 'react';
import { Box, Title } from '@mantine/core';
import Ladder from '@/components/HandballComponenets/StatsComponents/Ladder';
import Players from '@/components/HandballComponenets/StatsComponents/Players';
import { TournamentStructure } from '@/components/HandballComponenets/StatsComponents/types';
import { getTournament } from '@/ServerActions/TournamentActions';

interface TournamentLandingProps {
  tournament: string;
}

export function TournamentLanding({ tournament }: TournamentLandingProps) {
  const [tournamentObj, setTournamentObj] = React.useState<TournamentStructure>();
  useEffect(() => {
    getTournament(tournament!).then((t) => {
      setTournamentObj(t);
    });
  }, [tournament]);

  if (!tournament) {
    return 'Loading...';
  }

  return (
    <>
      <Title order={1}>{tournamentObj?.name}</Title>
      <Box style={{ width: '50%' }}>
        <Title order={2}>Ladder</Title>
        <Ladder
          tournament={tournament}
          maxRows={5}
          sortIndex={2}
          columns={['Percentage', 'Games Won']}
          editable={false}
        ></Ladder>
      </Box>
      <Box style={{ width: '50%' }}>
        <Title order={2}>Players</Title>
        <Players
          tournament={tournament}
          maxRows={5}
          sortIndex={2}
          columns={['B&F Votes', 'Points Scored']}
          editable={false}
        ></Players>
      </Box>
    </>
  );
}
