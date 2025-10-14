'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Center, Grid, Image, luminance, Paper, Skeleton, Space, Text } from '@mantine/core';
import { getTeams, getWinningTeams } from '@/ServerActions/TeamActions';
import { TeamStructure } from '@/ServerActions/types';

//TODO: - Uniform Box Size

interface TeamBubbleParams {
  team: TeamStructure;
  tournament?: string;
  [key: string]: any;
}

function TeamBubble({ team, tournament, ...props }: TeamBubbleParams) {
  return (
    <Paper
      bg={team.teamColor ? team.teamColor : undefined}
      w="auto"
      h={350}
      p={20}
      m={10}
      shadow="xl"
      // bd="1 solid black"
      withBorder={!team.teamColor}
      pos="relative"
      style={{ overflow: 'hidden' }}
      {...props}
    >
      <Text
        size="auto"
        fw={700}
        ta="center"
        c={team.teamColor && luminance(team.teamColor) < 0.5 ? 'white' : 'black'}
        lineClamp={2}
      >
        {team.name}
      </Text>
      <Box h={200}>
        <Link href={getLinkForTeam(team, tournament)}>
          <Image alt={team.name} src={team.imageUrl} fit="contain" w="100%" h="100%"></Image>
        </Link>
      </Box>
      <Text
        fw={700}
        ta="center"
        c={team.teamColor && luminance(team.teamColor) < 0.5 ? 'white' : 'black'}
      >
        {team.captain.name}
      </Text>
      <Text ta="center" c={team.teamColor && luminance(team.teamColor) < 0.5 ? 'white' : 'black'}>
        {team.nonCaptain?.name} {team.substitute && `& ${team.substitute.name}`}
      </Text>
    </Paper>
  );
}

const loadingBubble = (
  <Paper
    w="auto"
    h={350}
    p={20}
    m={10}
    shadow="xl"
    withBorder={true}
    pos="relative"
    style={{ overflow: 'hidden' }}
  >
    <Center>
      <Skeleton h={16} mt={6} radius="xl" w="20%"></Skeleton>
    </Center>
    <Space h="md"></Space>
    <Center>
      <Skeleton circle height={200}></Skeleton>
    </Center>
    <Center>
      <Skeleton h={8} mt={6} radius="xl" w="60%"></Skeleton>
    </Center>
    <Center>
      <Skeleton h={8} mt={6} radius="xl" w="60%"></Skeleton>
    </Center>
    <Center>
      <Skeleton h={8} mt={6} radius="xl" w="70%"></Skeleton>
    </Center>
  </Paper>
);

function getLinkForTeam(team: TeamStructure, tournament?: string) {
  if (tournament) {
    return `/${tournament}/teams/${team.searchableName}`;
  }
  return `/teams/${team.searchableName}`;
}

interface TeamsProps {
  tournament?: string;
}

export default function Teams({ tournament }: TeamsProps) {
  const [winningTeams, setWinningTeams] = React.useState<TeamStructure[]>([]);
  const [teams, setTeams] = React.useState<TeamStructure[]>();
  useEffect(() => {
    getTeams({ tournament }).then((o) => setTeams(o.teams));
    if (tournament) {
      getWinningTeams({ tournament })
        .then((r) => setWinningTeams(r.topThree))
        .catch();
    }
  }, [tournament]);

  if (!teams) {
    return (
      <div>
        <Grid w="98.5%">
          {Array.from({ length: 10 }).map((_, i) => (
            <Grid.Col
              key={i}
              span={{
                base: 6,
                md: 4,
                lg: 3,
              }}
            >
              {loadingBubble}
            </Grid.Col>
          ))}
        </Grid>
      </div>
    );
  }
  return (
    <Box w="98.5%">
      {!!winningTeams.length && (
        <>
          <Image
            pos="relative"
            left={{ base: 'calc(50% - 75px)', md: 'calc(50% - 100px)' }}
            top="20px"
            src="/images/crown.png"
            w={{ base: 150, md: 200 }}
            style={{ zIndex: 999 }}
          ></Image>
          <Center>
            <TeamBubble
              team={winningTeams[0]}
              tournament={tournament}
              w={{ base: '46.5%', md: '30.5%', lg: '22%' }}
              style={{ boxShadow: '0 0 20px gold' }}
            ></TeamBubble>
          </Center>
        </>
      )}
      <Grid>
        {teams
          .filter((t) => winningTeams[0]?.searchableName !== t.searchableName)
          .map((t, i) => (
            <Grid.Col
              key={i}
              span={{
                base: 6,
                md: 4,
                lg: 3,
              }}
            >
              <TeamBubble team={t} tournament={tournament}></TeamBubble>
            </Grid.Col>
          ))}
      </Grid>
    </Box>
  );
}
