'use client';

import React, { Fragment, useEffect } from 'react';
import Link from 'next/link';
import {
  IconAlertTriangle,
  IconClock2,
  IconStarHalf,
  IconTable,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Card,
  Container,
  Grid,
  Image,
  List,
  NumberInput,
  Rating,
  Table,
  Tabs,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { isUmpireManager } from '@/components/HandballComponenets/ServerActions';
import { getGames } from '@/ServerActions/GameActions';
import { getAveragePlayerStats, getPlayer } from '@/ServerActions/PlayerActions';
import {
  GameStructure,
  GameTeamStructure,
  PersonStructure,
  PlayerGameStatsStructure,
} from '@/ServerActions/types';

interface PlayersProps {
  tournament?: string;
  player: string;
}

const CATEGORIES = {
  'Ace and Serve Metrics': [
    'Aces Scored',
    'Serve Ace Rate',
    'Aces per Game',
    'Average Ace Streak',
    'Max Ace Streak',
    'Serves per Ace',
    'Serves per Fault',
    'Serves per Game',
    'Serves Received',
    'Serves Returned',
    'Serve Return Rate',
    'Max Serve Streak',
    'Average Serve Streak',
  ],
  'Fault and Error Metrics': ['Faults', 'Double Faults', 'Faults per Game', 'Serve Fault Rate'],
  'Points and Scoring Metrics': [
    'Points Scored',
    'Points Served',
    'Percentage of Points Scored',
    'Percentage of Points Scored For Team',
    'Percentage of Points Served Won',
    'Points per Game',
    'Points per Loss',
  ],
  'Game and Match Metrics': [
    'Games Played',
    'Rounds on Court',
    'Percentage of Games Starting Left',
    'Games Won',
    'Games Lost',
    'Percentage',
  ],
  'Card and Penalty Metrics': [
    'Cards',
    'Warnings',
    'Green Cards',
    'Yellow Cards',
    'Red Cards',
    'Rounds Carded',
    'Cards per Game',
    'Penalty Points',
    'Points per Card',
  ],
  'Rating and Voting Metrics': [
    'Elo',
    'Net Elo Delta',
    'Average Elo Delta',
    'Average Rating',
    'B&F Votes',
    'Votes per 100 Games',
  ],
};

export function playersOf(team?: GameTeamStructure): string[] {
  if (!team) return [];
  return [team.captain, team.nonCaptain, team.substitute]
    .filter((a) => a !== null)
    .map((a) => a?.searchableName);
}

export function findPlayer(game: GameStructure, playerName: string): PlayerGameStatsStructure {
  return [
    game.teamOne.captain,
    game.teamOne.nonCaptain,
    game.teamOne.substitute,
    game.teamTwo.captain,
    game.teamTwo.nonCaptain,
    game.teamTwo.substitute,
  ].find((a) => a && a.searchableName === playerName);
}

export default function IndividualPlayer({ tournament, player }: PlayersProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [gamesCount, setGamesCount] = React.useState<number>(20);
  const [games, setGames] = React.useState<GameStructure[]>([]);
  const [playerObj, setPlayerObj] = React.useState<PersonStructure | undefined>(undefined);
  const [averageStats, setAverageStats] = React.useState<
    { stats: { [p: string]: any } } | undefined
  >(undefined);

  useEffect(() => {
    getPlayer({ player, tournament, formatData: true }).then((o) => {
      setPlayerObj(o.player);
    });
    getAveragePlayerStats({ tournament, formatData: true }).then((o) => {
      setAverageStats(o);
    });
  }, [player, tournament]);

  useEffect(() => {
    setGames([]);
    getGames({ player: [player], tournament, limit: gamesCount, includePlayerStats: true }).then(
      (g) => setGames(g.games)
    );
  }, [gamesCount, player, tournament]);

  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          alt="The SUSS handball Logo"
          src={playerObj?.imageUrl ?? 'https://api.squarers.club/image?name=blank'}
          h="100"
          w="auto"
          m="auto"
        ></Image>
        <Title ta="center">{playerObj?.name}</Title>
      </Container>
      <Tabs defaultValue="stats">
        <Tabs.List grow>
          <Tabs.Tab value="stats" leftSection={<IconTable size={12} />}>
            Statistics
          </Tabs.Tab>
          <Tabs.Tab value="prevGames" leftSection={<IconClock2 size={12} />}>
            Previous Games
          </Tabs.Tab>
          {/*<Tabs.Tab value="graphs" leftSection={<IconChartScatter size={12} />}>*/}
          {/*  Graphs*/}
          {/*</Tabs.Tab>*/}
          {isUmpireManager() && (
            <Tabs.Tab value="mgmt" leftSection={<IconAlertTriangle size={12} />}>
              Cards
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="stats" w="100%">
          {Object.entries(CATEGORIES).map(([title, stats], index) => (
            <Fragment key={index}>
              <Title ta="center">{title}</Title>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w="33%" ta="center">
                      Stat
                    </Table.Th>
                    <Table.Th w="33%" ta="center">
                      Player Value
                    </Table.Th>
                    <Table.Th w="33%" ta="center">
                      Average Value
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {stats
                    .filter((a) => Object.keys(playerObj?.stats ?? []).includes(a))
                    .map((stat, key) => (
                      <Table.Tr key={key}>
                        <Table.Th ta="center">{stat}</Table.Th>
                        <Table.Td ta="center">{playerObj?.stats[stat] ?? '-'}</Table.Td>
                        <Table.Td ta="center">{averageStats?.stats[stat] ?? '-'}</Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </Fragment>
          ))}
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
                    <Image
                      src={
                        !playersOf(game.teamOne).includes(player)
                          ? game.teamOne.imageUrl
                          : game.teamTwo.imageUrl
                      }
                      h={160}
                      alt="logo for the other team"
                    />
                  </Card.Section>

                  <Text fw={500} size="lg" mt="md">
                    {game.teamOne.name} vs {game.teamTwo.name} ({game.teamOneScore} -{' '}
                    {game.teamTwoScore})
                  </Text>

                  <List mt="xs" c="dimmed" size="sm">
                    <List.Item>
                      <strong>Points Scored: </strong>{' '}
                      {findPlayer(game, player)?.stats?.['Points Scored']}
                    </List.Item>
                    <List.Item>
                      <strong>Aces Scored: </strong>{' '}
                      {findPlayer(game, player)?.stats?.['Aces Scored']}
                    </List.Item>
                    <List.Item>
                      <strong>Elo Delta: </strong>
                      <strong
                        style={{
                          color:
                            findPlayer(game, player).stats?.['Elo Delta'] >= 0 ? 'green' : 'red',
                        }}
                      >
                        {findPlayer(game, player)?.stats?.['Elo Delta'] > 0 ? '+' : ''}
                        {findPlayer(game, player)?.stats?.['Elo Delta']}
                      </strong>
                    </List.Item>
                    {isUmpireManager() && (
                      <>
                        <List.Item>
                          <Box display="flex">
                            <strong>Rating: </strong>{' '}
                            <Rating
                              w="auto"
                              size="sm"
                              value={findPlayer(game, player)?.rating}
                              readOnly
                            />
                          </Box>
                          {FEEDBACK_TEXTS[findPlayer(game, player)?.rating]}
                        </List.Item>
                        <List.Item>
                          <strong>Cards: </strong>
                          {
                            (game?.admin?.cards ?? []).filter(
                              (c) => c.player.searchableName === player
                            ).length
                          }
                        </List.Item>
                      </>
                    )}
                  </List>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="charts">How did you even get here?</Tabs.Panel>

        <Tabs.Panel value="mgmt">
          {isUmpireManager() && (
            <Accordion>
              <Accordion.Item value="cards">
                <Accordion.Control icon={<IconTriangleInvertedFilled />}>Cards</Accordion.Control>
                <Accordion.Panel>
                  {playerObj &&
                    Object.entries(playerObj.gameDetails)
                      .map(([_, i]) => i.cards)
                      .flat().length === 0 && (
                      <Text>
                        <i>No Cards Recorded Yet</i>
                      </Text>
                    )}
                  <Timeline bulletSize={24}>
                    {playerObj &&
                      Object.entries(playerObj.gameDetails)
                        .map(([_, i]) => i.cards)
                        .flat()
                        .map((card, i) => (
                          <Timeline.Item
                            key={i}
                            title={`${card.eventType} for ${card.player.name}`}
                            bullet={eventIcon(card)}
                          >
                            <Text c="dimmed" size="sm">
                              <strong>{card.notes}</strong>
                            </Text>
                          </Timeline.Item>
                        ))}
                  </Timeline>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="notes">
                <Accordion.Control icon={<IconStarHalf />}>Notes & Ratings</Accordion.Control>
                <Accordion.Panel>
                  <Table>
                    <Table.Tr>
                      <Table.Th>Opponent</Table.Th>
                      <Table.Th>Rating</Table.Th>
                      <Table.Th>Cards Received</Table.Th>
                      <Table.Th>Notes</Table.Th>
                    </Table.Tr>
                    {playerObj &&
                      Object.entries(playerObj.gameDetails).map(
                        ([id, { notes, game, cards, rating }], i) => (
                          <Table.Tr key={i}>
                            <Table.Th>
                              <Link href={`/games/${id}`} className="hideLink">
                                {game
                                  ? !playersOf(game.teamOne).includes(player)
                                    ? game?.teamOne.name
                                    : game?.teamTwo.name
                                  : `Game ${id}`}
                              </Link>
                            </Table.Th>
                            <Table.Td>
                              <Link href={`/games/${id}`} className="hideLink">
                                <Rating readOnly value={rating}></Rating>
                              </Link>
                            </Table.Td>
                            <Table.Td>
                              <Link href={`/games/${id}`} className="hideLink">
                                {cards.map((card, j) => (
                                  <Text c="dimmed" size="sm">
                                    <strong>{card.eventType}:</strong>
                                    <i>{card.notes}</i>
                                  </Text>
                                ))}
                              </Link>
                            </Table.Td>
                            <Table.Td>
                              <Link href={`/games/${id}`} className="hideLink">
                                {notes}
                              </Link>
                            </Table.Td>
                          </Table.Tr>
                        )
                      )}
                  </Table>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
