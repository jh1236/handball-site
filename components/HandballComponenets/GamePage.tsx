'use client';

import React, { useEffect } from 'react';
import { linearGradient } from 'polished';
import { toLocaleString } from 'postcss-preset-mantine';
import { ReactFitty } from 'react-fitty';
import { Box, Button, Grid, ScrollArea, Text, Title } from '@mantine/core';
import classes from '@/app/games/[game]/gamesStyles.module.css';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure } from '@/ServerActions/types';
import {switchStatement} from "@babel/types";

interface GamePageProps {
  gameID: number;
}

export function GamePage({ gameID }: GamePageProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [openDrawer, setOpenDrawer] = React.useState<number>(0);
  localStorage.getItem('permissions');
  useEffect(() => {
    getGame({ gameID }).then(setGame);
  }, [gameID]);
  if (!game) {
    return <SidebarLayout>Loading...</SidebarLayout>;
  }

  const date = new Date(0);
  if (game.startTime && game.startTime > 0) {
    date.setUTCMilliseconds(Math.floor(1000 * game.startTime));
  }
  const LocaleDateIndex: number = date.toLocaleDateString().indexOf(',');
  const localeDate: string[] = [];
  localeDate.push(date.toLocaleDateString().slice(0, LocaleDateIndex + 1));
  localeDate.push(date.toLocaleTimeString().slice(LocaleDateIndex + 1));

  return (
    <SidebarLayout tournamentName={game?.tournament.searchableName}>
      <Box ta="center" w="95vw">
        {/* does the Gradient area*/}
        <Box
          className={classes.gradientBackground}
          w="100%"
          h="300px"
          pos="relative"
          left="0"
          top="100"
          pt="0"
        >
          <Grid
            top="0"
            pt="md"
            justify="center"
            align="center"
            mb={20}
            mah={250}
            w="95%"
            style={{
              verticalAlign: 'middle',
              fontWeight: 'bold',
              fontSize: 50,
              maxHeight: '1',
            }}
          >
            <Grid.Col span={5}>
              <ReactFitty wrapText minSize={20}>
                {game.teamOne.name.length > 30
                  ? `${game.teamOne.name.substring(0, 30)}...`
                  : game.teamOne.name}
              </ReactFitty>
            </Grid.Col>
            <Grid.Col span={2} style={{ fontSize: 30 }}>
              vs
            </Grid.Col>
            <Grid.Col span={5}>
              <ReactFitty wrapText minSize={20}>
                {game.teamTwo.name.length > 30
                  ? `${game.teamTwo.name.substring(0, 30)}...`
                  : game.teamTwo.name}
              </ReactFitty>
            </Grid.Col>
          </Grid>
          <Grid columns={5} pos="relative" top={-25}>
            <Grid.Col span={2} style={{ textAlign: 'end' }}>
              {date.toLocaleDateString(undefined, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Grid.Col>
            <Grid.Col span={1}>
              {date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </Grid.Col>
            <Grid.Col span={2} style={{ textAlign: 'left' }}>
              {(game.length / 60).toFixed(0)} Minutes
            </Grid.Col>
          </Grid>
          <Grid style={{ fontSize: '100px' }} pos="relative" top={-50}>
            <Grid.Col span={5}>{game.teamOneScore}</Grid.Col>
            <Grid.Col span={2}>-</Grid.Col>
            <Grid.Col span={5}>{game.teamTwoScore}</Grid.Col>
          </Grid>
        </Box>
        <Box pos="relative" top={500}>
          <Box>
            <Button id="test1" onClick={() => setOpenDrawer(0)} disabled={openDrawer === 0}>Test 1</Button>
            <Button id="test2" onClick={() => setOpenDrawer(1)}>Test 2</Button>
          </Box>
          <Box>
            <Text>asyfgbakvhb</Text>
            {openDrawer === 0 ? <Text>Some cursed shit!!</Text> : null}
            {openDrawer === 1 && <Text>Some other cursed shit!!</Text>}
          </Box>
        </Box>
      </Box>
    </SidebarLayout>
  );
}
