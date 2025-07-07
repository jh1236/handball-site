import React from 'react';
import Link from 'next/link';
import { Center, Container, Image, Skeleton, Space, Text } from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import { StatCategory } from '@/components/HandballComponenets/TournamentLanding';
import { PersonStructure, TeamStructure } from '@/ServerActions/types';

interface StatBubbleParams {
  players: PersonStructure[] | undefined;
  teams: TeamStructure[] | undefined;
  stat: StatCategory;
  tournament?: string;
}

export function StatBubble({ players, teams, stat, tournament }: StatBubbleParams) {
  if (!teams || !players) {
    return (
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
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
      </Container>
    );
  }
  const sortMultiplier = stat.order === 'asc' ? 1 : -1;
  if (stat.type === 'team') {
    if (teams.length === 0 || !teams.some((a) => a.stats!['Games Played'] >= 1)) {
      return (
        <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
          <Text size="auto" fw={700} ta="center">
            <i>N/A</i>
          </Text>
          <Image
            alt="Question mark"
            src={`${SERVER_ADDRESS}/api/image?name=blank`}
            h="200"
            w="auto"
            m="auto"
          ></Image>
          <Text ta="center">
            <i>No Teams have played in this tournament</i>
          </Text>
        </Container>
      );
    }
    const team = teams?.reduce((a, b) => {
      const diff =
        sortMultiplier *
        (parseFloat(String(b.stats![stat.stat])) - parseFloat(String(a.stats![stat.stat])));
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
        <Link href={`/${tournament}/players/${team.searchableName}`} className="hideLink">
          <Text size="auto" fw={700} ta="center">
            {team.name}
          </Text>
        </Link>
        <Link href={`/${tournament}/players/${team.searchableName}`} className="hideLink">
          <Image alt={team.name} src={team.bigImageUrl} h="200" w="auto" m="auto"></Image>
        </Link>
        <Link href={`/${tournament}/players/${team.searchableName}`} className="hideLink">
          <Text ta="center">
            With {team.stats![stat.stat]} {stat.description}
          </Text>
        </Link>
      </Container>
    );
  }
  if (players.length === 0 || !players.some((a) => a.stats!['Games Played'] >= 1)) {
    return (
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Text size="auto" fw={700} ta="center">
          <i>N/A</i>
        </Text>
        <Image
          alt="Question mark"
          src={`${SERVER_ADDRESS}/api/image?name=blank`}
          h="200"
          w="auto"
          m="auto"
        ></Image>
        <Text ta="center">
          <i>No Players have played in this tournament</i>
        </Text>
      </Container>
    );
  }
  const player = players?.reduce((a, b) => {
    const diff =
      sortMultiplier *
      (parseFloat(String(b.stats![stat.stat])) - parseFloat(String(a.stats![stat.stat])));
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
      <Link href={`/${tournament}/players/${player.searchableName}`} className="hideLink">
        <Text size="auto" fw={700} ta="center">
          {player.name}
        </Text>
      </Link>
      <Link href={`/${tournament}/players/${player.searchableName}`} className="hideLink">
        <Image alt={player.name} src={player.bigImageUrl} h="200" w="auto" m="auto"></Image>
      </Link>
      <Link href={`/${tournament}/players/${player.searchableName}`} className="hideLink">
        <Text ta="center">
          With {player.stats![stat.stat]} {stat.description}
        </Text>
      </Link>
    </Container>
  );
}
