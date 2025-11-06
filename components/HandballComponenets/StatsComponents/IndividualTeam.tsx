'use client';

/*
He who is skilled in coding hides within the deepest recesses of the code. He who is skilled in gaming shoots forth from the heights of the game
 */
import React, { useEffect } from 'react';
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
  Center,
  Container,
  Grid,
  Group,
  HoverCard,
  Image,
  NumberInput,
  Rating,
  Select,
  Table,
  Tabs,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import GameBlockComfy from '@/components/HandballComponenets/TeamBlock';
import { getGames } from '@/ServerActions/GameActions';
import { getTeam } from '@/ServerActions/TeamActions';
import { GameEventStructure, GameStructure, TeamStructure } from '@/ServerActions/types';
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
  const [cards, setCards] = React.useState<{ game: GameStructure; card: GameEventStructure }[]>([]);
  const [teamObj, setteamObj] = React.useState<TeamStructure | undefined>(undefined);
  const [gamesCount, setGamesCount] = React.useState<number>(20);
  const [tournamentFilter, setTournamentFilter] = React.useState<string | undefined | null>();
  const [filteredTournaments, setFilteredTournaments] = React.useState<string[]>();
  const { isUmpireManager } = useUserData();
  if (tournament) {
    setTournamentFilter(tournament);
  }
  useEffect(() => {
    getTeam({
      team,
      tournament,
      formatData: true,
    }).then((o) => {
      setteamObj(o.team);
    });
  }, [team, tournament]);
  useEffect(() => {
    setGames([]);
    getGames({
      team: [team],
      tournament,
      includePlayerStats: true,
    }).then((g) => {
      let output: { game: GameStructure; card: GameEventStructure }[] = [];
      for (const game of g.games) {
        output = output.concat(
          (game.admin?.cards ?? [])
            .filter((card) => card.firstTeam === (game.teamOne.searchableName === team))
            .map((c) => ({
              game,
              card: c,
            }))
        );
      }
      setCards(output);
      g.games.reverse();
      setGames(g.games);
    });
  }, [gamesCount, team, tournament]);
  useEffect(() => {
    if (!tournament) {
      setFilteredTournaments(
        games
          .map((g) => g.tournament.name)
          .filter((value, index, array) => array.indexOf(value) === index)
      );
    }
  }, [games, tournament, tournamentFilter]);
  if (!teamObj) {
    return <p>loading...</p>;
  }
  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          alt="The SUSS handball Logo"
          src={teamObj?.imageUrl ?? 'https://api.squarers.club/api/image?name=blank'}
          h="100"
          w="auto"
          m="auto"
        ></Image>
        <Title ta="center">{teamObj?.extendedName}</Title>
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
          <Tabs defaultValue="teamStats" variant="outline">
            <Tabs.List grow>
              <Tabs.Tab value="teamStats">Team Stats</Tabs.Tab>
              <Tabs.Tab value="playerStats">Player Stats</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="teamStats">
              <PlayerStatsTable team={teamObj} tournament={tournament}></PlayerStatsTable>
            </Tabs.Panel>
            <Tabs.Panel value="playerStats">
              <PlayerStatsTable
                team={teamObj}
                teamPlayers={true}
                tournament={tournament}
              ></PlayerStatsTable>
            </Tabs.Panel>
          </Tabs>
        </Tabs.Panel>
        <Tabs.Panel value="prevGames">
          <Center>
            <Group mb={25} grow w="50%">
              <NumberInput
                label="Set Games Count"
                min={1}
                value={gamesCount}
                onChange={(a) => setGamesCount(+a)}
              />
              {tournament ? (
                <></>
              ) : (
                <Select
                  label="Select Tournament"
                  value={tournamentFilter}
                  onChange={(a) => setTournamentFilter(a)}
                  data={filteredTournaments}
                  clearable
                />
              )}
            </Group>
          </Center>
          <Center>
            <Grid w="85%">
              {games
                .filter(
                  (g) => g.tournament.name.includes(tournamentFilter ?? '') || !tournamentFilter
                )
                .filter((_, i) => i < gamesCount)
                .map((game) => (
                  <Grid.Col
                    span={{
                      base: 12,
                      sm: 8,
                      md: 6,
                    }}
                  >
                    <GameBlockComfy game={game}></GameBlockComfy>
                  </Grid.Col>
                ))}
            </Grid>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="charts">How did you even get here?</Tabs.Panel>

        <Tabs.Panel value="mgmt">
          <Accordion>
            {isUmpireManager(tournament) && (
              <Accordion>
                <Accordion.Item value="cards">
                  <Accordion.Control icon={<IconTriangleInvertedFilled />}>Cards</Accordion.Control>
                  <Accordion.Panel>
                    {teamObj && cards.length === 0 && (
                      <Text>
                        <i>No Cards Recorded Yet</i>
                      </Text>
                    )}
                    <Timeline bulletSize={24}>
                      {teamObj &&
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
                      <Table.Tr>
                        <Table.Th>Opponent</Table.Th>
                        <Table.Th>Rating</Table.Th>
                        <Table.Th>Cards Received</Table.Th>
                        <Table.Th>Notes</Table.Th>
                      </Table.Tr>
                      {teamObj &&
                        games
                          .filter(
                            (game) =>
                              game.admin!.cards.filter(
                                (card) => card.firstTeam === (game.teamOne.searchableName === team)
                              ).length > 0 ||
                              ((game.teamOne.searchableName === team
                                ? game.admin?.teamOneRating
                                : game.admin?.teamTwoRating) ?? 3) < 2
                          )
                          .map((game, i) => (
                            <Table.Tr key={i}>
                              <Table.Th>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  {game.teamOne.searchableName !== team
                                    ? game?.teamOne.name
                                    : game?.teamTwo.name}
                                </Link>
                              </Table.Th>
                              <Table.Td>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  <Rating
                                    readOnly
                                    value={
                                      (game.teamOne.searchableName !== team
                                        ? game?.admin?.teamOneRating
                                        : game?.admin?.teamTwoRating) ?? 3
                                    }
                                    count={4}
                                  ></Rating>
                                </Link>
                              </Table.Td>
                              <Table.Td>
                                <Link href={`/games/${game.id}`} className="hideLink">
                                  {game
                                    .admin!.cards.filter(
                                      (card) =>
                                        card.firstTeam === (game.teamOne.searchableName === team)
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
                                  {game.admin!.notes}
                                </Link>
                              </Table.Td>
                            </Table.Tr>
                          ))}
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
