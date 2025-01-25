'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Grid, Title } from '@mantine/core';
import Fixtures from '@/components/HandballComponenets/StatsComponents/Fixtures/Fixtures';
import Ladder from '@/components/HandballComponenets/StatsComponents/Ladder';
import Players from '@/components/HandballComponenets/StatsComponents/Players';
import { getTournament } from '@/ServerActions/TournamentActions';
import { TournamentStructure } from '@/ServerActions/types';

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
      <Grid w="98.5%">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Box style={{ textAlign: 'center' }}>
            <Link className="hideLink" href={`/${tournament}/players`}>
              <Title order={2}>Ladder</Title>
            </Link>
            <Ladder
              tournament={tournament}
              maxRows={5}
              sortIndex={2}
              columns={['Percentage', 'Games Won']}
              editable={false}
            ></Ladder>
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Link className="hideLink" href={`/${tournament}/ladder`}>
              <Title order={2}>Current Round</Title>
            </Link>
            <Fixtures tournament={tournament} expandable={false} maxRounds={1}></Fixtures>
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Box style={{ textAlign: 'center' }}>
            <Link className="hideLink" href={`/${tournament}/players`}>
              <Title order={2}>Players</Title>
            </Link>
            <Ladder
              tournament={tournament}
              maxRows={5}
              sortIndex={2}
              columns={['Percentage', 'Games Won']}
              editable={false}
            ></Ladder>
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Link className="hideLink" href={`/${tournament}/players`}>
              <Title order={2}>Players</Title>
            </Link>
            <Players
              tournament={tournament}
              maxRows={5}
              sortIndex={2}
              columns={['B&F Votes', 'Points Scored']}
              editable={false}
            ></Players>
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
}
