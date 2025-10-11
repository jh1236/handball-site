'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Center, Grid, Image, luminance, Paper, Skeleton, Space, Text } from '@mantine/core';
import { getTeams } from '@/ServerActions/TeamActions';
import { TeamStructure } from '@/ServerActions/types';

//TODO: - Uniform Box Size

function GenerateTeamBubble(team: TeamStructure, tournament?: string) {
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
  const [chartData, setchartData] = React.useState<TeamStructure[]>();
  useEffect(() => {
    getTeams({ tournament }).then((o) => setchartData(o.teams));
  }, [tournament]);

  if (!chartData) {
    return (
      <div>
        <Grid w="98.5%">
          {Array.from({ length: 10 }).map(() => (
            <Grid.Col
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
    <div>
      <Grid w="98.5%">
        {chartData.map((t) => (
          <Grid.Col
            span={{
              base: 6,
              md: 4,
              lg: 3,
            }}
          >
            {GenerateTeamBubble(t, tournament)}
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
