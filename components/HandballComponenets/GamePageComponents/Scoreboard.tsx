'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Center,
  Flex,
  Grid,
  Image,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { getGame } from '@/ServerActions/GameActions';
import {
  GameStructure,
  GameTeamStructure,
  PersonStructure,
  PlayerGameStatsStructure,
  TeamStructure,
} from '@/ServerActions/types';

interface ScoreboardProps {
  gameID: number;
}
export function Scoreboard({ gameID }: ScoreboardProps) {
  const [game, setGame] = React.useState<GameStructure>();
  //
  useEffect(() => {
    getGame({
      gameID,
    }).then(setGame);
  }, [gameID]);
  if (!game) {
    return <>Loading...</>;
  }
  //TODO: if a player is carded, strikethrough their name and move currently on player to be on service side
  const gradientBackground: string = `linear-gradient(90deg, rgba(${game.teamOne.teamColorAsRGBABecauseDigbyIsLazy ? game.teamOne.teamColorAsRGBABecauseDigbyIsLazy.toString() : '0,0,255,255'}), rgba(0,0,0,0), rgba(${game.teamTwo.teamColorAsRGBABecauseDigbyIsLazy ? game.teamTwo.teamColorAsRGBABecauseDigbyIsLazy.toString() : '0,0,255,255'})`;
  function getSides(team: GameTeamStructure) :
    { left: PlayerGameStatsStructure | undefined,
      right: PlayerGameStatsStructure | undefined,
      sub: PlayerGameStatsStructure | undefined }
  {
    let left: PlayerGameStatsStructure | undefined;
    let right: PlayerGameStatsStructure | undefined;
    let sub: PlayerGameStatsStructure | undefined;
    for (const p of [team.captain, team.nonCaptain, team.substitute]) {
      if (!p) {
        //
      } else if (p.sideOfCourt === 'Left') {
        left = p;
      } else if (p.sideOfCourt === 'Right') {
        right = p;
      } else if (p.sideOfCourt === 'Substitute') {
        sub = p;
      }
    }
    return { left, right, sub };
  }
  function createNamePlate(team: GameTeamStructure, side: 'left' | 'right' | 'sub') {
    const p: PersonStructure | undefined = getSides(team)[side];
    if (!p) { return <p> error: player not found</p>; }
    if (!game) { return <p>error</p>; }
    return (
      <Text
        fz="5vh"
        fw={(game.firstTeamToServe)
          ? ((team.name === game.teamOne.name && side === game.sideToServe.toLowerCase()) ? 'bold' : '')
          : ((team.name === game.teamTwo.name && side === game.sideToServe.toLowerCase()) ? 'bold' : '')}
        td={p.cardTimeRemaining === 0 ? '' : 'line-through'}>
          {team === game.teamOne
          ? `[${side === 'left' ? 'L' : 'R'}] ${p.name}`
          : `${p.name} [${side === 'left' ? 'L' : 'R'}]`}
      </Text>
    );
  }
  //
  const test = `linear-gradient(90deg, rgba(${game.teamOne.teamColorAsRGBABecauseDigbyIsLazy.toString()})`
  return (
    <Box h="100vh" w="100vw" style={{ background: `rgba(0,0,0,0) 25%), linear-gradient(270deg, #fff, transparent)` }}>
      <Center component={Title}>
        {game.teamOne.name} vs {game.teamTwo.name}
      </Center>
      <Box mt="auto">
        <Box pos="absolute" left="15%"><Text fz="50vh" fw="semi-bold">{game.teamOneScore}</Text></Box>
        <Box pos="absolute" right="15%"><Text fz="50vh" fw="semi-bold">{game.teamTwoScore}</Text></Box>
        <Box pos="absolute" left="10%" bottom="10%">
          {createNamePlate(game.teamOne, 'right')}
          {createNamePlate(game.teamOne, 'left')}
        </Box>
        <Box pos="absolute" right="10%" bottom="10%" style={{ textAlign: 'right' }}>
          {createNamePlate(game.teamTwo, 'right')}
          {createNamePlate(game.teamTwo, 'left')}
        </Box>
        <Box pos="absolute" bottom={20} w="100%">
          { game.court !== 0 ? <Text ta="center" fz={20}>Court : {game.court}</Text> : <Text></Text> }
          <Text ta="center" fz={20}>Official: {game.official.name}</Text>
          <Text ta="center" fz={20}>Time Elapsed: {"bruh"}</Text>
        </Box>
      </Box>
    </Box>
  );
}
