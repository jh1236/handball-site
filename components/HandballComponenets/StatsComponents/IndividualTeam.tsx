'use client';

/*
He who is skilled in coding hides within the deepest recesses of the code. He who is skilled in gaming shoots forth from the heights of the game
 */
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
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getGames } from '@/ServerActions/GameActions';
import { getTeam } from '@/ServerActions/TeamActions';
import { GameStructure, TeamStructure } from '@/ServerActions/types';
import PlayerStatsTable from './PlayerStatsTable';

interface TeamsProps {
  tournament?: string;
  team: string;
}

// const stats = [
//   'Games Played',
//   'Games Won',
//   'Games Lost',
//   'Percentage',
//   'Points Scored',
//   'Points Against',
//   'Point Difference',
//   'Faults',
//   'Double Faults',
//   'Warnings',
//   'Penalty Points',
//   'Green Cards',
//   'Yellow Cards',
//   'Red Cards',
//   'Timeouts Called',
//   'Elo',
// ];

export default function IndividualTeam({ tournament, team }: TeamsProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [games, setGames] = React.useState<GameStructure[]>([]);
  const [teamObj, setTeamObj] = React.useState<TeamStructure | undefined>(undefined);
  const [gamesCount, setGamesCount] = React.useState<number>(20);
  const { isUmpireManager } = useUserData();
  useEffect(() => {
    getTeam({
      team,
      tournament,
      formatData: true,
    }).then((o) => {
      setTeamObj(o.team);
    });
  }, [team, tournament]);
  useEffect(() => {
    setGames([]);
    getGames({
      team: [team],
      tournament,
      limit: gamesCount,
      includePlayerStats: true,
    }).then((g) => setGames(g.games));
  }, [gamesCount, team, tournament]);
  if (!teamObj) {
    return <p>loading...</p>;
  }
  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          alt="The SUSS handball Logo"
          src={teamObj?.imageUrl ?? 'https://api.squarers.club/image?name=blank'}
          h="100"
          w="auto"
          m="auto"
        ></Image>
        <Title ta="center">{teamObj?.name}</Title>
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
          {isUmpireManager && (
            <Tabs.Tab value="mgmt" leftSection={<IconAlertTriangle size={12} />}>
              Cards
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="stats" w="100%">
          <Tabs defaultValue="teamStats" variant="outline">
            <Tabs.List grow>
              <Tabs.Tab value="teamStats">Team Stats</Tabs.Tab>
              <Tabs.Tab value="playerStats">Player Stats</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="teamStats">
              <PlayerStatsTable team={teamObj} tournament={tournament}></PlayerStatsTable>
            </Tabs.Panel>
            <Tabs.Panel value="playerStats">
              <PlayerStatsTable team={teamObj} teamPlayers={true}></PlayerStatsTable>
            </Tabs.Panel>
          </Tabs>
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
              <Grid.Col
                span={{
                  base: 6,
                  sm: 4,
                  md: 3,
                }}
              >
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
                        game.teamOne.searchableName !== team
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

                  {isUmpireManager && (
                    <List>
                      <List.Item>
                        <Box display="flex">
                          <strong>Rating: </strong>{' '}
                          <Rating
                            w="auto"
                            count={4}
                            size="sm"
                            value={teamObj?.gameDetails?.[game.id]?.rating ?? 3}
                            readOnly
                          />
                        </Box>
                        {FEEDBACK_TEXTS[teamObj?.gameDetails?.[game.id]?.rating ?? 3]}
                      </List.Item>
                    </List>
                  )}
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="charts">How did you even get here?</Tabs.Panel>

        <Tabs.Panel value="mgmt">
          <Accordion>
            {isUmpireManager && (
              <Accordion>
                <Accordion.Item value="cards">
                  <Accordion.Control icon={<IconTriangleInvertedFilled />}>Cards</Accordion.Control>
                  <Accordion.Panel>
                    {teamObj &&
                      Object.entries(teamObj.gameDetails ?? {})
                        .map(([, i]) => i.cards)
                        .flat().length === 0 && (
                        <Text>
                          <i>No Cards Recorded Yet</i>
                        </Text>
                      )}
                    <Timeline bulletSize={24}>
                      {teamObj &&
                        Object.entries(teamObj.gameDetails ?? {})
                          .map(([, i]) => i.cards)
                          .flat()
                          .map((card, i) => (
                            <Timeline.Item
                              key={i}
                              title={`${card.eventType} for ${card.player?.name}`}
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
                      {teamObj &&
                        Object.entries(teamObj.gameDetails ?? {}).map(
                          ([id, { notes, game, cards, rating }], i) => (
                            <Table.Tr key={i}>
                              <Table.Th>
                                <Link href={`/games/${id}`} className="hideLink">
                                  {game
                                    ? game.teamOne.searchableName !== team
                                      ? game?.teamOne.name
                                      : game?.teamTwo.name
                                    : `Game ${id}`}
                                </Link>
                              </Table.Th>
                              <Table.Td>
                                <Link href={`/games/${id}`} className="hideLink">
                                  <Rating readOnly value={rating} count={4}></Rating>
                                </Link>
                              </Table.Td>
                              <Table.Td>
                                <Link href={`/games/${id}`} className="hideLink">
                                  {cards.map((card, j) => (
                                    <Text c="dimmed" size="sm" key={j}>
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
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
