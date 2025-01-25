'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Container, Grid, Image, Text } from '@mantine/core';
import { getTeams } from '@/ServerActions/TeamActions';
import { TeamStructure, TournamentStructure } from '@/ServerActions/types';

//TODO: - Uniform Box Size

function GenerateTeamBubble(team: TeamStructure, tournament?: string) {
  return (
    <Container
      bg="red.5"
      w="auto"
      p={20}
      m={10}
      bd="2 solid black"
      pos="relative"
      style={{ overflow: 'hidden' }}
    >
      <Text size="auto" fw={700} ta="center">
        {team.name}
      </Text>
      <Link href={getLinkForTeam(team, tournament)}>
        <Image alt={team.name} src={team.imageUrl} h="200" w="auto" m="auto"></Image>
      </Link>
      <Text fw={700} ta="center">
        {team.captain.name}
      </Text>
      <Text ta="center">
        {team.nonCaptain?.name} {team.substitute && `& ${team.substitute.name}`}
      </Text>
    </Container>
  );
}

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
  const [chartData, setchartData] = React.useState<TeamStructure[]>([]);
  useEffect(() => {
    getTeams({ tournament }).then((o) => setchartData(o.teams));
  }, [tournament]);

  if (chartData.length === 0) {
    return (
      <div>
        <Text>loading...</Text>
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
