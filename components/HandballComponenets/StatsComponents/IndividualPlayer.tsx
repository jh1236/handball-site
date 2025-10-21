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
  HoverCard,
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
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamButton';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getGames } from '@/ServerActions/GameActions';
import { getAveragePlayerStats, getPlayer } from '@/ServerActions/PlayerActions';
import {
  GameEventStructure,
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
    'Games Started Left',
    'Games Started Right',
    'Games Started Substitute',
    'Caps',
    'Tournaments',
    'Rounds per Game',
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
    'Percentage of Rounds Carded',
  ],
  'Rating and Voting Metrics': [
    'Elo',
    'Net Elo Delta',
    'Average Elo Delta',
    'Average Rating',
    'B&F Votes',
    'Votes per 100 Games',
    'Votes per Tournament',
    'Merits',
    'Merits per Tournament',
    'Nefarious Votes',
    'Nefarious Rate',
  ],
};
function playersOfSearchable(team?: GameTeamStructure): string[] {
  return playersOf(team).map((a) => a?.searchableName);
}

export function playersOF(): 'looking at tha dirttyyyy yyyyyy' {
  return 'looking at tha dirttyyyy yyyyyy';
}

export function playersOf(team?: GameTeamStructure): PlayerGameStatsStructure[] {
  if (!team) return [];
  return [team.captain, team.nonCaptain, team.substitute].filter((a) => a !== null);
}

export function findPlayer(game: GameStructure, playerName: string): PlayerGameStatsStructure {
  return [
    game.teamOne.captain,
    game.teamOne.nonCaptain,
    game.teamOne.substitute,
    game.teamTwo.captain,
    game.teamTwo.nonCaptain,
    game.teamTwo.substitute,
  ].find((a) => a && a.searchableName === playerName)!;
}

export default function IndividualPlayer({ tournament, player }: PlayersProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [cards, setCards] = React.useState<{ game: GameStructure; card: GameEventStructure }[]>([]);

  const [gamesCount, setGamesCount] = React.useState<number>(20);
  const [games, setGames] = React.useState<GameStructure[]>([]);
  const [playerObj, setPlayerObj] = React.useState<PersonStructure | undefined>(undefined);
  const { isUmpireManager } = useUserData();
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
    getGames({ player: [player], tournament, includePlayerStats: true }).then((g) => {
      g.games.reverse();
      let output: { game: GameStructure; card: GameEventStructure }[] = [];
      for (const game of g.games) {
        output = output.concat(
          (game.admin?.cards ?? [])
            .filter((card) => card.player?.searchableName === player)
            .map((c) => ({ game, card: c }))
        );
      }
      setCards(output);
      setGames(g.games);
    });
  }, [gamesCount, player, tournament]);

  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          alt="The SUSS handball Logo"
          src={playerObj?.bigImageUrl ?? 'https://api.squarers.club/api/image?name=blank'}
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
          {isUmpireManager(tournament) && (
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
                        <Table.Td ta="center">{playerObj?.stats?.[stat] ?? '-'}</Table.Td>
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
            {games
              .filter((_, i) => i < gamesCount)
              .map((game, k) => (
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
                          !playersOfSearchable(game.teamOne).includes(player)
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
                      {isUmpireManager(tournament) && (
                        <>
                          <List.Item>
                            <Box display="flex">
                              <strong>Rating: </strong>{' '}
                              <Rating
                                count={4}
                                w="auto"
                                size="sm"
                                value={
                                  (playersOfSearchable(game.teamOne).includes(player)
                                    ? game?.admin!.teamOneRating
                                    : game?.admin!.teamTwoRating) ?? 3
                                }
                                readOnly
                              />
                            </Box>
                            {
                              FEEDBACK_TEXTS[
                                (playersOfSearchable(game.teamOne).includes(player)
                                  ? game?.admin!.teamOneRating
                                  : game?.admin!.teamTwoRating) ?? 3
                              ]
                            }
                          </List.Item>
                          <List.Item>
                            <strong>Cards: </strong>
                            {(game?.admin?.cards ?? [])
                              .filter((c) => c.player?.searchableName === player)
                              .map((card, j) => (
                                <HoverCard key={j}>
                                  <HoverCard.Target>{eventIcon(card)}</HoverCard.Target>
                                  <HoverCard.Dropdown>
                                    <i>{card.notes}</i>
                                  </HoverCard.Dropdown>
                                </HoverCard>
                              ))}
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
          {isUmpireManager(tournament) && (
            <Accordion>
              <Accordion.Item value="cards">
                <Accordion.Control icon={<IconTriangleInvertedFilled />}>Cards</Accordion.Control>
                <Accordion.Panel>
                  {playerObj && cards.length === 0 && (
                    <Text>
                      <i>No Cards Recorded Yet</i>
                    </Text>
                  )}
                  <Timeline bulletSize={24}>
                    {playerObj &&
                      cards.map(({ game, card }, i) => (
                        <Timeline.Item
                          key={i}
                          title={`${card.eventType} for ${card.player?.name}`}
                          bullet={eventIcon(card)}
                        >
                          <Link href={`/games/${game.id}`} className="hideLink">
                            <Text c="dimmed" size="sm">
                              <strong>{card.notes}</strong>
                            </Text>
                          </Link>
                        </Timeline.Item>
                      ))}
                  </Timeline>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="notes">
                <Accordion.Control icon={<IconStarHalf />}>Notes & Ratings</Accordion.Control>
                <Accordion.Panel>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Opponent</Table.Th>
                        <Table.Th>Rating</Table.Th>
                        <Table.Th>Cards Received</Table.Th>
                        <Table.Th>Notes</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {playerObj &&
                        games
                          .filter(
                            (game) =>
                              game.admin!.cards.filter(
                                (card) => card.player?.searchableName === player
                              ).length > 0 ||
                              ((playersOfSearchable(game.teamOne).includes(player)
                                ? game.admin?.teamOneRating
                                : game.admin?.teamTwoRating) ?? 3) < 2
                          )
                          .map((game, i) => (
                            <Table.Tr key={i}>
                              <Table.Th>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  {!playersOfSearchable(game.teamOne).includes(player)
                                    ? game?.teamOne.name
                                    : game?.teamTwo.name}
                                </Link>
                              </Table.Th>
                              <Table.Td>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  <Rating
                                    readOnly
                                    value={
                                      (playersOfSearchable(game.teamOne).includes(player)
                                        ? game?.admin!.teamOneRating
                                        : game?.admin!.teamTwoRating) ?? 3
                                    }
                                    count={4}
                                  ></Rating>
                                </Link>
                              </Table.Td>
                              <Table.Td>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  {game
                                    .admin!.cards.filter(
                                      (card) => card.player?.searchableName === player
                                    )
                                    .map((card, j) => (
                                      <HoverCard key={j}>
                                        <HoverCard.Target>{eventIcon(card)}</HoverCard.Target>
                                        <HoverCard.Dropdown>
                                          <i>{card.notes}</i>
                                        </HoverCard.Dropdown>
                                      </HoverCard>
                                    ))}
                                </Link>
                              </Table.Td>
                              <Table.Td>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  {game.notes}
                                </Link>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                    </Table.Tbody>
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
