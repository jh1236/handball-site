'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Center, Container, Grid, Image, Skeleton, Space, Text } from '@mantine/core';
import { getOfficials } from '@/ServerActions/OfficialActions';
import { OfficialStructure } from '@/ServerActions/types';

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
  const [chartData, setchartData] = React.useState<OfficialStructure[]>();
  useEffect(() => {
    getOfficials({ tournament }).then((o) => setchartData(o.officials));
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
            {GenerateOfficialBubble(t, tournament)}
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
