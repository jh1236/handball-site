'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Center, Divider, Grid, Paper, Tabs, useMatches } from '@mantine/core';
import { AdminGamePanel } from '@/components/HandballComponenets/AdminGamePanel';
import GameBlockComfy from '@/components/HandballComponenets/GameBlock';
import { DisplayCourtLocation } from '@/components/HandballComponenets/GamePageComponents/DisplayCourtLocation';
import { GamePlayerPointsGraph } from '@/components/HandballComponenets/GamePageComponents/GamePlayerPointsGraph';
import { GamePointsMethodGraph } from '@/components/HandballComponenets/GamePageComponents/GamePointsMethodGraph';
import { GameTimelineLineGraph } from '@/components/HandballComponenets/GamePageComponents/GameTimelineLineGraph';
import { ScoreGraphic } from '@/components/HandballComponenets/GamePageComponents/ScoreGraphic';
import { localLogout } from '@/components/HandballComponenets/ServerActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame, getGames } from '@/ServerActions/GameActions';
import { GameStructure } from '@/ServerActions/types';
import { PlayerStats } from './PlayerStats';
import { useUserData } from '@/components/hooks/userData';

interface GamePageProps {
  gameID: number;
}

export function GamePage({ gameID }: GamePageProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [activeTab, setActiveTab] = useState<string | null>('stats');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUmpireManager, isOfficial } = useUserData();
  const [prevGames, setPrevGames] = React.useState<GameStructure[]>([]);
  const limit = useMatches({ base: 4, md: 8 });
  const defaultTab = useMemo(() => (game?.started ? 'stats' : 'headToHead'), [game]);
  useEffect(() => {
    getGame({
      gameID,
      includeStats: true,
      includeGameEvents: true,
      formatData: false,
    }).then((g) => {
      setGame(g);
      if (isUmpireManager(g.tournament.searchableName) && g && !g.admin) {
        localLogout();
      }
      if (!g.started) {
        getGames({
          team: [g.teamOne.searchableName, g.teamTwo.searchableName],
          limit: 8,
        }).then((g2) => setPrevGames(g2.games.toReversed()));
      }
    });
  }, [gameID, isUmpireManager]);
  useEffect(() => {
    if (activeTab !== defaultTab) {
      router.replace(`${window.location.href.split('?')[0]}?tab=${activeTab}`);
    } else {
      router.replace(`${window.location.href.split('?')[0]}`);
    }
  }, [activeTab, defaultTab, router]);
  useEffect(() => {
    const tab = searchParams?.get('tab') ?? defaultTab;
    setActiveTab(tab);
  }, [defaultTab, searchParams]);
  if (!game) {
    return <SidebarLayout>Loading...</SidebarLayout>;
  }

  const date = new Date(0);
  if (game.startTime && game.startTime > 0) {
    date.setUTCMilliseconds(Math.floor(1000 * game.startTime));
  }

  return (
    <SidebarLayout tournamentName={game.tournament.searchableName}>
      <Box ta="center" w="100%">
        <ScoreGraphic game={game} />
        <Divider></Divider>
        <Box pos="relative">
          <Tabs value={activeTab} onChange={setActiveTab} defaultValue={defaultTab}>
            <Paper component={Tabs.List} grow shadow="xs" justify="space-between">
              {game.started && <Tabs.Tab value="stats">Stats</Tabs.Tab>}
              {!game.started && <Tabs.Tab value="headToHead">Head To Head</Tabs.Tab>}
              {!game.started && <Tabs.Tab value="stats">Stats</Tabs.Tab>}
              {game.started && <Tabs.Tab value="gameGraph">Game Overview</Tabs.Tab>}
              {game.admin && <Tabs.Tab value="admin"> Management </Tabs.Tab>}
            </Paper>
            <Tabs.Panel value="stats">
              <PlayerStats game={game}></PlayerStats>
            </Tabs.Panel>
            <Tabs.Panel value="headToHead">
              <Grid>
                {prevGames
                  .filter((_, i) => i < limit)
                  .map((prevGame, index) => (
                    <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                      <GameBlockComfy game={prevGame} markWinner />
                    </Grid.Col>
                  ))}
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="gameGraph">
              <Tabs defaultValue="worm">
                <Tabs.List grow>
                  <Tabs.Tab value="worm">Worm</Tabs.Tab>
                  <Tabs.Tab value="playerPoints">Points by Player</Tabs.Tab>
                  <Tabs.Tab value="methodPoints">Points by Score Method</Tabs.Tab>
                  <Tabs.Tab value="heatmap">Heatmap</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="worm">
                  <Box style={{ marginTop: '30px' }} w="100%">
                    <GameTimelineLineGraph game={game} />
                  </Box>
                </Tabs.Panel>
                <Tabs.Panel value="playerPoints">
                  <Box style={{ marginTop: '30px' }} w="100%" h={{ base: 300, md: 600 }}>
                    <GamePlayerPointsGraph game={game} />
                  </Box>
                </Tabs.Panel>
                <Tabs.Panel value="methodPoints">
                  <Box style={{ marginTop: '30px' }} w="100%" h={{ base: 300, md: 600 }}>
                    <GamePointsMethodGraph game={game} />
                  </Box>
                </Tabs.Panel>
                <Tabs.Panel value="heatmap">
                  <Center style={{ marginTop: '30px' }} w="100%" h={{ base: 300, md: 600 }}>
                    <DisplayCourtLocation game={game} />
                  </Center>
                </Tabs.Panel>
              </Tabs>
            </Tabs.Panel>
            {isOfficial(game.tournament.searchableName) && (
              <Tabs.Panel value="admin">
                <AdminGamePanel game={game}></AdminGamePanel>
              </Tabs.Panel>
            )}
          </Tabs>
          <Box></Box>
        </Box>
      </Box>
    </SidebarLayout>
  );
}
