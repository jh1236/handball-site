'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Center, Divider, Paper, Tabs } from '@mantine/core';
import { AdminGamePanel } from '@/components/HandballComponenets/AdminGamePanel';
import { DisplayCourtLocation } from '@/components/HandballComponenets/GamePageComponents/DisplayCourtLocation';
import { GamePlayerPointsGraph } from '@/components/HandballComponenets/GamePageComponents/GamePlayerPointsGraph';
import { GamePointsMethodGraph } from '@/components/HandballComponenets/GamePageComponents/GamePointsMethodGraph';
import { GameTimelineLineGraph } from '@/components/HandballComponenets/GamePageComponents/GameTimelineLineGraph';
import { ScoreGraphic } from '@/components/HandballComponenets/GamePageComponents/ScoreGraphic';
import { localLogout, useUserData } from '@/components/HandballComponenets/ServerActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure } from '@/ServerActions/types';
import { PlayerStats } from './PlayerStats';

interface GamePageProps {
  gameID: number;
}

export function GamePage({ gameID }: GamePageProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [activeTab, setActiveTab] = useState<string | null>('stats');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUmpireManager, isOfficial } = useUserData();

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
    });
  }, [gameID, isUmpireManager]);

  useEffect(() => {
    if (activeTab !== 'stats') {
      router.replace(`${window.location.href.split('?')[0]}?tab=${activeTab}`);
    } else {
      router.replace(`${window.location.href.split('?')[0]}`);
    }
  }, [activeTab, router]);
  useEffect(() => {
    const tab = searchParams?.get('tab') ?? 'stats';
    setActiveTab(tab);
  }, [searchParams]);
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
          <Tabs value={activeTab} onChange={setActiveTab} defaultValue="stats">
            <Paper component={Tabs.List} grow shadow="xs" justify="space-between">
              <Tabs.Tab value="stats">Stats</Tabs.Tab>
              <Tabs.Tab value="gameGraph">Game Overview</Tabs.Tab>
              {game.admin && <Tabs.Tab value="admin"> Management </Tabs.Tab>}
            </Paper>
            <Tabs.Panel value="stats">
              <PlayerStats game={game}></PlayerStats>
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
