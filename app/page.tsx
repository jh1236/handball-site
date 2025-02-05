'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconInfoCircle, IconRefresh } from '@tabler/icons-react';
import { Blockquote, Box, Center, Container, Grid, Image, Stack, Text, Title } from '@mantine/core';
import Ladder from '@/components/HandballComponenets/StatsComponents/Ladder';
import Players from '@/components/HandballComponenets/StatsComponents/Players';
import { StatCategory } from '@/components/HandballComponenets/TournamentLanding';
import { TournamentList } from '@/components/HandballComponenets/TournamentList';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getQOTD } from '@/ServerActions/MiscActions';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { getTeams } from '@/ServerActions/TeamActions';
import { PersonStructure, TeamStructure } from '@/ServerActions/types';

const STATS: StatCategory[] = [
  {
    type: 'player',
    stat: 'Percentage of Points Scored For Team',
    title: 'Most Selfish Player',
    description: 'of points scored for their team',
  },
  {
    type: 'player',
    stat: 'Votes per 100 games',
    title: 'Leading Player',
    description: 'votes for every 100 games played',
  },
  {
    type: 'player',
    stat: 'Percentage of Points Scored For Team',
    title: 'Least Selfish Player',
    order: 'asc',
    description: 'of points scored for their team',
  },
  {
    type: 'player',
    stat: 'Faults per Game',
    title: 'Most Faults Per Game',
    description: 'faults served every game',
  },
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
    stat: 'Points per Loss',
    title: 'Best Performing Player',
    description: 'points scored for every loss',
  },
  {
    type: 'player',
    stat: 'Rounds on Court',
    title: 'Most Rounds Played',
    description: 'rounds played',
  },
];

export default function HomePage() {
  const [statIndex, setStatIndex] = React.useState<number>(0);
  const [qotd, setQotd] = React.useState<{ quote: string; author: string }>();
  const [teams, setTeams] = React.useState<TeamStructure[]>();

  const [players, setPlayers] = React.useState<PersonStructure[]>();

  useEffect(() => {
    getQOTD().then(setQotd);
    getTeams({ includeStats: true, formatData: true }).then((t) => setTeams(t.teams));
    getPlayers({ includeStats: true, formatData: true }).then((t) => setPlayers(t.players));
    setStatIndex(Math.floor(Math.random() * STATS.length));
  }, []);

  function createRandomStatBubble() {
    if (!teams || !players) return 'Loading...';
    const sortMultiplier = STATS[statIndex].order === 'asc' ? 1 : -1;
    if (STATS[statIndex].type === 'team') {
      const team = teams?.reduce((a, b) => {
        const diff =
          sortMultiplier *
          (parseFloat(String(b.stats![STATS[statIndex].stat])) -
            parseFloat(String(a.stats![STATS[statIndex].stat])));
        if (diff > 0) {
          return a;
        }
        if (diff === 0) {
          return Math.random() > 0.5 ? a : b;
        }
        return b;
      }, teams[0]);
      return (
        <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
          <Link href={`/players/${team.searchableName}`} className="hideLink">
            <Text size="auto" fw={700} ta="center">
              {team.name}
            </Text>
          </Link>
          <Link href={`/players/${team.searchableName}`} className="hideLink">
            <Image alt={team.name} src={team.imageUrl} h="200" w="auto" m="auto"></Image>
          </Link>
          <Link href={`/players/${team.searchableName}`} className="hideLink">
            <Text ta="center">
              With {team.stats![STATS[statIndex].stat]} {STATS[statIndex].description}
            </Text>
          </Link>
        </Container>
      );
    }
    const player = players?.reduce((a, b) => {
      const diff =
        sortMultiplier *
        (parseFloat(String(b.stats![STATS[statIndex].stat])) -
          parseFloat(String(a.stats![STATS[statIndex].stat])));
      if (diff > 0) {
        return a;
      }
      if (diff === 0) {
        return Math.random() > 0.5 ? a : b;
      }
      return b;
    }, players[0]);
    return (
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Link href={`/players/${player.searchableName}`} className="hideLink">
          <Text size="auto" fw={700} ta="center">
            {player.name}
          </Text>
        </Link>
        <Link href={`/players/${player.searchableName}`} className="hideLink">
          <Image alt={player.name} src={player.imageUrl} h="200" w="auto" m="auto"></Image>
        </Link>
        <Link href={`/players/${player.searchableName}`} className="hideLink">
          <Text ta="center">
            With {player.stats![STATS[statIndex].stat]} {STATS[statIndex].description}
          </Text>
        </Link>
      </Container>
    );
  }

  return (
    <>
      <SidebarLayout>
        <>
          <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
            <Image
              alt="The SUSS handball Logo"
              src="https://api.squarers.club/image?name=SUSS"
              h="100"
              w="auto"
              m="auto"
            ></Image>
            <Title ta="center">Welcome to S.U.S.S. Handball.</Title>
          </Container>
          <Grid w="98.5%">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Box style={{ textAlign: 'center' }}>
                <Title order={2}>Tournaments</Title>
                <TournamentList></TournamentList>
              </Box>
              <Box style={{ textAlign: 'center' }}>
                <Link className="hideLink" href="/ladder">
                  <Title order={2}>Ladder</Title>
                </Link>
                <Ladder
                  maxRows={5}
                  sortIndex={2}
                  columns={['Percentage', 'Games Won']}
                  editable={false}
                ></Ladder>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Box style={{ textAlign: 'center' }} m={20}>
                <Title order={2}>
                  {STATS[statIndex]?.title ?? 'Loading...'}{' '}
                  <IconRefresh onClick={() => setStatIndex((statIndex! + 1) % STATS.length)} />
                </Title>
                {createRandomStatBubble()}
              </Box>
              <Box style={{ textAlign: 'center' }}>
                <Title order={2}>Quote of the day</Title>
                <Blockquote
                  color="blue"
                  iconSize={46}
                  cite={`– ${qotd?.author ?? 'Loading...'}`}
                  icon={<IconInfoCircle />}
                  mt="xl"
                >
                  {qotd?.quote ?? 'Loading...'}
                </Blockquote>
              </Box>
              <Box style={{ textAlign: 'center' }}>
                <Link className="hideLink" href="/players">
                  <Title order={2}>Players</Title>
                </Link>
                <Players
                  maxRows={5}
                  sortIndex={2}
                  columns={['B&F Votes', 'Points Scored']}
                  editable={false}
                ></Players>
              </Box>
            </Grid.Col>
          </Grid>
        </>
      </SidebarLayout>
    </>
  );
}
