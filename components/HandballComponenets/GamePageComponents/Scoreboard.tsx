'use client';

import React, { useEffect } from 'react';
import { linearGradient } from 'polished';
import { Box, Center, Flex, Grid, Image, Text, Title, useMantineColorScheme } from '@mantine/core';
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
  function generateBackground(): any {
    const team1Col = game.teamOne.teamColorAsRGBABecauseDigbyIsLazy?.toString() ?? '50,50,125,255';
    const team2Col = game.teamTwo.teamColorAsRGBABecauseDigbyIsLazy?.toString() ?? '50,50,125,255';
    const imgURL1 = game.teamOne.bigImageUrl ?? game.teamOne.imageUrl;
    const imgURL2 = game.teamTwo.bigImageUrl ?? game.teamTwo.imageUrl;
    const style = {
      background: `
      linear-gradient(90deg, rgba(${team1Col}) 0%, rgba(0,0,0,0) 60%), 
      linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(${team2Col}) 100%), 
      url(${imgURL1}), 
      url(${imgURL2})`,
      backgroundPosition: '0 0, 0 0, -10vw center, 60vw center',
      backgroundSize: 'cover, cover, 50vw auto, 50vw auto',
      backgroundRepeat: 'no-repeat',
    };
    return style;
  }

  function getSides(team: GameTeamStructure): {
    left: PlayerGameStatsStructure | undefined;
    right: PlayerGameStatsStructure | undefined;
    sub: PlayerGameStatsStructure | undefined;
  } {
    let left: PlayerGameStatsStructure | undefined;
    let right: PlayerGameStatsStructure | undefined;
    let sub: PlayerGameStatsStructure | undefined;
    const players: PlayerGameStatsStructure[] = [
      team.captain,
      team.nonCaptain,
      team.substitute,
    ].filter((a): PlayerGameStatsStructure => a);
    if (players.length === 1) {
      if (game?.sideToServe === 'Left') {
        [left] = players;
      } else {
        [right] = players;
      }
    } else {
      for (const p of players) {
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
    }

    return { left, right, sub };
  }

  function createNamePlate(team: GameTeamStructure, side: 'left' | 'right' | 'sub') {
    const p: PersonStructure | undefined = getSides(team)[side];
    if (!p) {
      return <p> error: player not found</p>;
    }
    if (!game) {
      return <p>error</p>;
    }
    return (
      <Text
        fz="5vh"
        fw={
          game.firstTeamToServe
            ? team.name === game.teamOne.name && side === game.sideToServe.toLowerCase()
              ? 'bold'
              : ''
            : team.name === game.teamTwo.name && side === game.sideToServe.toLowerCase()
              ? 'bold'
              : ''
        }
        td={p.cardTimeRemaining === 0 ? '' : 'line-through'}
      >
        {team === game.teamOne
          ? `[${side === 'left' ? 'L' : 'R'}] ${p.name}`
          : `${p.name} [${side === 'left' ? 'L' : 'R'}]`}
      </Text>
    );
  }

  //
  return (
    <Box style={generateBackground()} h="100vh" w="100vw">
      <Box w="100vw" pos="absolute" top="25px">
        <Center component={Title} fz={40}>
          {game.teamOne.name} vs {game.teamTwo.name}
        </Center>
      </Box>
      <Box mt="auto">
        <Box pos="absolute" left="15%">
          <Text fz="50vh" fw="semi-bold">
            {game.teamOneScore}
          </Text>
        </Box>
        <Box pos="absolute" right="15%">
          <Text fz="50vh" fw="semi-bold">
            {game.teamTwoScore}
          </Text>
        </Box>
        <Box pos="absolute" left="10%" bottom="10%">
          {createNamePlate(game.teamOne, 'right')}
          {createNamePlate(game.teamOne, 'left')}
        </Box>
        <Box pos="absolute" right="10%" bottom="10%" style={{ textAlign: 'right' }}>
          {createNamePlate(game.teamTwo, 'right')}
          {createNamePlate(game.teamTwo, 'left')}
        </Box>
        <Box pos="absolute" bottom={20} w="100%">
          <Text ta="center" fz={20}>
            Court : {game.court + 1}
          </Text>
          <Text ta="center" fz={20}>
            Official: {game.official.name}
          </Text>
          <Text ta="center" fz={20}>
            Time Elapsed: bruh
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
