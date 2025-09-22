'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Center, Container, Grid, Image, Skeleton, Space, Text } from '@mantine/core';
import { getOfficials } from '@/ServerActions/OfficialActions';
import { OfficialStructure, TournamentStructure } from '@/ServerActions/types';

//TODO: - Uniform Box Size

const loadingBubble = (
  <Container
    bg="blue.7"
    w="auto"
    h={300}
    p={20}
    m={10}
    bd="2 solid black"
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
  </Container>
);

function GenerateOfficialBubble(official: OfficialStructure, tournament?: string) {
  return (
    <Container
      bg="blue.7"
      w="auto"
      h={300}
      p={20}
      m={10}
      bd="2 solid black"
      pos="relative"
      style={{ overflow: 'hidden' }}
    >
      <Text size="auto" fw={700} ta="center">
        {official.name}
      </Text>
      <Box h={200}>
        <Link href={getLinkForOfficial(official, tournament)}>
          <Image
            alt={official.name}
            src={official.imageUrl}
            fit="contain"
            w="100%"
            h="100%"
          ></Image>
        </Link>
      </Box>
      {tournament && (
        <Text size="auto" ta="center">
          <i>{official.role}</i>
        </Text>
      )}
    </Container>
  );
}

function getLinkForOfficial(team: OfficialStructure, tournament?: string) {
  if (tournament) {
    return `/${tournament}/officials/${team.searchableName}`;
  }
  return `/officials/${team.searchableName}`;
}

interface OfficialsProps {
  tournament?: string;
}

export default function Officials({ tournament }: OfficialsProps) {
  const [tournamentObj, setTournamentObj] = React.useState<TournamentStructure | undefined>();
  const [officials, setOfficials] = React.useState<OfficialStructure[]>();
  useEffect(() => {
    getOfficials({ tournament, returnTournament: true }).then((o) => {
      setOfficials(o.officials);
      setTournamentObj(o.tournament);
    });
  }, [tournament]);

  if (!officials) {
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
        <Head>
          <title>Officials: {tournamentObj?.name ?? 'Tournament Landing Page'}</title>
        </Head>
        {officials.map((t) => (
          <Grid.Col
            span={{
              base: 6,
              md: 4,
              lg: 3,
            }}
          >
            {GenerateOfficialBubble(t, tournament)}
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
