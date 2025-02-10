'use client';

import React, { Fragment, useEffect } from 'react';
import { IconAlertTriangle, IconClock2, IconTable } from '@tabler/icons-react';
import { Accordion, Container, Image, Tabs, Text, Title } from '@mantine/core';
import { isUmpireManager } from '@/components/HandballComponenets/ServerActions';
import { getGames } from '@/ServerActions/GameActions';
import { getTeam } from '@/ServerActions/TeamActions';
import { GameStructure, TeamStructure } from '@/ServerActions/types';
import PlayerStatsTable from './PlayerStatsTable';

interface TeamsProps {
  tournament?: string;
  team: string;
}

export default function IndividualTeam({ tournament, team }: TeamsProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [teamObj, setTeamObj] = React.useState<TeamStructure | undefined>(undefined);

  useEffect(() => {
    getTeam({ team, tournament, formatData: true }).then((o) => {
      setTeamObj(o.team);
    });
  }, [team, tournament]);

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
          {isUmpireManager() && (
            <Tabs.Tab value="mgmt" leftSection={<IconAlertTriangle size={12} />}>
              Cards
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="stats" w="100%">
          <PlayerStatsTable team={teamObj}></PlayerStatsTable>
          <p>team: {teamObj?.name}</p>
        </Tabs.Panel>
        <Tabs.Panel value="prevGames">
          <p>put prevgames here</p>
          {/*<NumberInput
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
                        !teamsOf(game.teamOne).includes(team)
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
                      {findteam(game, team)?.stats?.['Points Scored']}
                    </List.Item>
                    <List.Item>
                      <strong>Aces Scored: </strong> {findteam(game, team)?.stats?.['Aces Scored']}
                    </List.Item>
                    <List.Item>
                      <strong>Elo Delta: </strong>
                      <strong
                        style={{
                          color: findteam(game, team).stats?.['Elo Delta'] >= 0 ? 'green' : 'red',
                        }}
                      >
                        {findteam(game, team)?.stats?.['Elo Delta'] > 0 ? '+' : ''}
                        {findteam(game, team)?.stats?.['Elo Delta']}
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
                              value={findteam(game, team)?.rating}
                              readOnly
                            />
                          </Box>
                          {FEEDBACK_TEXTS[findteam(game, team)?.rating]}
                        </List.Item>
                        <List.Item>
                          <p>fix later</p>
                        </List.Item>
                      </>
                    )}
                  </List>
                </Card>
              </Grid.Col>
            ))}
          </Grid>*/}
        </Tabs.Panel>

        <Tabs.Panel value="charts">How did you even get here?</Tabs.Panel>

        <Tabs.Panel value="mgmt">
          <Accordion>
            {isUmpireManager() && (
              <>
                {teamObj &&
                  Object.entries(teamObj.gameDetails)
                    .map(([_, i]) => i.cards)
                    .flat().length === 0 && (
                    <Text>
                      <i>No Cards Recorded Yet</i>
                    </Text>
                  )}
                <p>there was a timeline here</p>
              </>
            )}
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
