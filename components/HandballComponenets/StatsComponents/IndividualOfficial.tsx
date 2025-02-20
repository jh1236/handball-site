'use client';

import React, { Fragment, useEffect } from 'react';
import { IconClock2, IconTable } from '@tabler/icons-react';
import { Card, Container, Grid, Image, NumberInput, Table, Tabs, Text, Title } from '@mantine/core';
import { getGames } from '@/ServerActions/GameActions';
import { getOfficial } from '@/ServerActions/OfficialActions';
import { GameStructure, OfficialStructure } from '@/ServerActions/types';

interface OfficialProps {
  tournament?: string;
  official: string;
}

export default function IndividualOfficial({ tournament, official }: OfficialProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [gamesCount, setGamesCount] = React.useState<number>(20);
  const [games, setGames] = React.useState<GameStructure[]>([]);
  const [officialObj, setOfficialObj] = React.useState<OfficialStructure | undefined>(undefined);

  useEffect(() => {
    getOfficial({ official, tournament }).then((o) => {
      setOfficialObj(o.official);
    });
  }, [official, tournament]);

  useEffect(() => {
    setGames([]);
    getGames({
      official: [official],
      tournament,
      limit: gamesCount,
      includePlayerStats: true,
    }).then((g) => setGames(g.games));
  }, [gamesCount, official, tournament]);

  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          alt="The SUSS handball Logo"
          src={officialObj?.imageUrl ?? 'https://api.squarers.club/image?name=blank'}
          h="100"
          w="auto"
          m="auto"
        ></Image>
        <Title ta="center">{officialObj?.name}</Title>
      </Container>
      <Tabs defaultValue="stats">
        <Tabs.List grow>
          <Tabs.Tab value="stats" leftSection={<IconTable size={12} />}>
            Statistics
          </Tabs.Tab>
          <Tabs.Tab value="prevGames" leftSection={<IconClock2 size={12} />}>
            Previous Games
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stats" w="100%">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="33%" ta="center">
                  Stat
                </Table.Th>
                <Table.Th w="33%" ta="center">
                  Player Value
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.keys(officialObj?.stats ?? {})
                ?.filter((a) => Object.keys(officialObj?.stats ?? []).includes(a))
                .map((stat, key) => (
                  <Table.Tr key={key}>
                    <Table.Th ta="center">{stat}</Table.Th>
                    <Table.Td ta="center">{officialObj?.stats?.[stat] ?? '-'}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
        <Tabs.Panel value="prevGames">
          <NumberInput
            label="Set Games Count"
            min={1}
            value={gamesCount}
            onChange={(a) => setGamesCount(+a)}
          />
          <Grid>
            {games.map((game, k) => (
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card
                  shadow="sm"
                  padding="xl"
                  key={k}
                  component="a"
                  href={`/games/${game.id}`}
                  className="hideLink"
                >
                  <Card.Section>
                    <Image src={game.teamOne.imageUrl} h={80} alt="logo for the other team" />
                    <Image src={game.teamTwo.imageUrl} h={80} alt="logo for the other team" />
                  </Card.Section>

                  <Text fw={500} size="lg" mt="md">
                    {game.teamOne.name} vs {game.teamTwo.name} ({game.teamOneScore} -{' '}
                    {game.teamTwoScore})
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="charts">How did you even get here?</Tabs.Panel>
      </Tabs>
    </>
  );
}
