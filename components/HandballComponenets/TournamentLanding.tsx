'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconRefresh } from '@tabler/icons-react';
import { Box, Container, Grid, Image, Title } from '@mantine/core';
import { StatBubble } from '@/components/HandballComponenets/StatBubble';
import Fixtures from '@/components/HandballComponenets/StatsComponents/Fixtures/Fixtures';
import Ladder from '@/components/HandballComponenets/StatsComponents/Ladder';
import Players from '@/components/HandballComponenets/StatsComponents/Players';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { getTeams } from '@/ServerActions/TeamActions';
import { getTournament } from '@/ServerActions/TournamentActions';
import { PersonStructure, TeamStructure, TournamentStructure } from '@/ServerActions/types';

interface TournamentLandingProps {
  tournament: string;
}

export type StatCategory = {
  type: 'player' | 'team';
  title: string;
  stat: string;
  description: string;
  order?: 'asc' | 'desc';
};
const STATS: StatCategory[] = [
  {
    type: 'player',
    stat: 'Percentage of Points Scored For Team',
    title: 'Most Selfish Player',
    description: 'of points scored for their team',
  },
  { type: 'player', stat: 'B&F Votes', title: 'Leading Player', description: 'votes for B&F' },
  {
    type: 'player',
    stat: 'Percentage of Points Scored For Team',
    title: 'Least Selfish Player',
    order: 'asc',
    description: 'of points scored for their team',
  },
  { type: 'player', stat: 'Faults', title: 'Most Faults', description: 'faults served' },
  {
    type: 'team',
    stat: 'Timeouts Called',
    title: 'Most Timeouts used',
    description: 'timeouts used',
  },
  {
    type: 'player',
    stat: 'Serve Ace Rate',
    title: 'Best server',
    description: 'chance of serving an ace',
  },
  {
    type: 'team',
    stat: 'Percentage',
    title: 'Leading Team',
    description: 'percent of wins',
  },
  {
    type: 'player',
    stat: 'Max Ace Streak',
    title: 'Biggest Ace Streak',
    description: 'aces in a row',
  },
  {
    type: 'player',
    stat: 'Points Served',
    title: 'Most Points served',
    description: 'points served',
  },
  {
    type: 'player',
    stat: 'Rounds on Court',
    title: 'Most Rounds Played',
    description: 'rounds played',
  },
];

export function TournamentLanding({ tournament }: TournamentLandingProps) {
  const [teams, setTeams] = React.useState<TeamStructure[]>();
  const [players, setPlayers] = React.useState<PersonStructure[]>();
  const [tournamentObj, setTournamentObj] = React.useState<TournamentStructure>();
  const [statIndex, setStatIndex] = React.useState<number>(0);

  useEffect(() => {
    getTournament(tournament!).then((t) => {
      setTournamentObj(t);
    });
    getTeams({ tournament, includeStats: true, formatData: true }).then((t) => setTeams(t.teams));
    getPlayers({ tournament, includeStats: true, formatData: true }).then((t) =>
      setPlayers(t.players)
    );
    setStatIndex(Math.floor(Math.random() * STATS.length));
  }, [tournament]);

  if (!tournament) {
    return 'Loading...';
  }

  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          src={tournamentObj?.imageUrl ?? 'https://api.squarers.club/image?name=SUSS'}
          alt="The SUSS handball Logo"
          h="100"
          w="auto"
          m="auto"
        ></Image>
        <Title ta="center">{tournamentObj?.name ?? 'Loading...'}</Title>
      </Container>
      <Grid w="98.5%">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Box style={{ textAlign: 'center' }}>
            <Link className="hideLink" href={`/${tournament}/ladder`}>
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
            <Link className="hideLink" href={`/${tournament}/fixtures`}>
              <Title order={2}>Current Round</Title>
            </Link>
            <Fixtures tournament={tournament} expandable={false} maxRounds={1}></Fixtures>
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Box style={{ textAlign: 'center' }}>
            <Title order={2}>
              {STATS[statIndex]?.title ?? 'Loading...'}{' '}
              <IconRefresh onClick={() => setStatIndex((statIndex! + 1) % STATS.length)} />
            </Title>
            <StatBubble
              players={players}
              teams={teams}
              tournament={tournament}
              stat={STATS[statIndex]}
            ></StatBubble>
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
