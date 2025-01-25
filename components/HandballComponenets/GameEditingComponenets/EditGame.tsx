'use client';

import React, { useMemo } from 'react';
import { Box, Button, Text, Title } from '@mantine/core';
import {
  GameState,
  sync,
  undo,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { PlayerButton } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton';
import {
  GameStructure,
  PlayerGameStatsStructure,
} from '@/ServerActions/types';
import { getGame } from '@/ServerActions/GameActions';

export function getUrlForID(id: number) {
  return `/api/games/${id}?includePlayerStats=true`;
}

export function EditGame({ game }: { game: number }) {
  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  const [rounds, setRounds] = React.useState<number>(0);
  const [faulted, setFaulted] = React.useState<boolean>(false);
  const [firstTeamServes, setFirstTeamServes] = React.useState<boolean>(false);
  const [teamOneTimeouts, setTeamOneTimeouts] = React.useState<number>(0);
  const [teamOneServedLeft, setTeamOneServedLeft] = React.useState<boolean>(true);
  const [teamOneScore, setTeamOneScore] = React.useState<number>(0);
  const [teamOneLeft, setTeamOneLeft] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamOneRight, setTeamOneRight] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamOneSub, setTeamOneSub] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamTwoTimeouts, setTeamTwoTimeouts] = React.useState<number>(0);
  const [teamTwoServedLeft, setTeamTwoServedLeft] = React.useState<boolean>(true);
  const [teamTwoScore, setTeamTwoScore] = React.useState<number>(0);
  const [teamTwoLeft, setTeamTwoLeft] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamTwoRight, setTeamTwoRight] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamTwoSub, setTeamTwoSub] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const servedFromLeft = useMemo(
    () => (firstTeamServes ? teamOneServedLeft : teamTwoServedLeft),
    [firstTeamServes, teamOneServedLeft, teamTwoServedLeft]
  );

  getGame({ gameID: game }).then((gameIn) => {
    setGameObj(gameIn);
    setFirstTeamServes(gameIn.firstTeamToServe);
    setRounds(gameIn.teamOneScore + gameIn.teamTwoScore);
    setFaulted(gameIn.faulted);
    //Team Specific
    setTeamOneTimeouts(gameIn.teamOneTimeouts);
    setTeamOneScore(gameIn.teamOneScore);
    setTeamOneServedLeft(gameIn.teamOne.servedFromLeft! !== gameIn.firstTeamToServe);
    const { teamOne } = gameIn;
    for (const i of [teamOne.captain, teamOne.nonCaptain, teamOne.substitute]) {
      if (i?.sideOfCourt === 'Left') {
        setTeamOneLeft(i);
      }
      if (i?.sideOfCourt === 'Right') {
        setTeamOneRight(i);
      }
      if (i?.sideOfCourt === 'Substitute') {
        setTeamOneSub(i);
      }
    }
    setTeamTwoTimeouts(gameIn.teamTwoTimeouts);
    setTeamTwoScore(gameIn.teamTwoScore);
    setTeamTwoServedLeft(gameIn.teamTwo.servedFromLeft! === gameIn.firstTeamToServe);
    const { teamTwo } = gameIn;
    for (const i of [teamTwo.captain, teamTwo.nonCaptain, teamTwo.substitute]) {
      if (i?.sideOfCourt === 'Left') {
        setTeamTwoLeft(i);
      }
      if (i?.sideOfCourt === 'Right') {
        setTeamTwoRight(i);
      }
      if (i?.sideOfCourt === 'Substitute') {
        setTeamTwoSub(i);
      }
    }
  });

  const gameState: GameState = {
    firstTeamServes: {
      get: firstTeamServes,
      set: setFirstTeamServes,
    },
    faulted: {
      get: faulted,
      set: setFaulted,
    },
    id: gameObj?.id ?? -1,
    rounds: {
      get: rounds,
      set: setRounds,
    },
    servedFromLeft,
    teamOne: {
      score: {
        get: teamOneScore,
        set: setTeamOneScore,
      },
      timeouts: {
        get: teamOneTimeouts,
        set: setTeamOneTimeouts,
      },
      servedFromLeft: {
        get: teamOneServedLeft,
        set: setTeamOneServedLeft,
      },
      left: {
        get: teamOneLeft,
        set: setTeamOneLeft,
      },
      right: {
        get: teamOneRight,
        set: setTeamOneRight,
      },
      sub: {
        get: teamOneSub,
        set: setTeamOneSub,
      },
    },
    teamTwo: {
      score: {
        get: teamTwoScore,
        set: setTeamTwoScore,
      },
      timeouts: {
        get: teamTwoTimeouts,
        set: setTeamTwoTimeouts,
      },
      servedFromLeft: {
        get: teamTwoServedLeft,
        set: setTeamTwoServedLeft,
      },
      left: {
        get: teamTwoLeft,
        set: setTeamTwoLeft,
      },
      right: {
        get: teamTwoRight,
        set: setTeamTwoRight,
      },
      sub: {
        get: teamTwoSub,
        set: setTeamTwoSub,
      },
    },
  };
  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '50%', height: '100%', float: 'left' }}>
          <PlayerButton game={gameState} firstTeam={true} leftSide={false}></PlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '100%', float: 'right' }}>
          <PlayerButton game={gameState} leftSide={true} firstTeam={true}></PlayerButton>
        </Box>
      </Box>
      <Box
        style={{
          width: '100%',
          height: '20%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flex: 'auto',
            alignContent: 'center',
            justifyContent: 'center',
            width: 'fit-content',
          }}
        >
          <Button size="lg" onClick={() => sync(gameState)}>
            Sync
          </Button>
        </Box>
        <Box
          style={{
            margin: '0px auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flex: '5',
          }}
        >
          <Text size="lg">{gameObj?.teamOne.name}</Text>
          <Title order={1}>{gameState.teamOne.score.get}</Title>
          <Title order={1}>-</Title>
          <Title order={1}>{teamTwoScore}</Title>
          <Text size="lg">{gameObj?.teamTwo.name}</Text>
        </Box>

        <Box
          style={{
            display: 'flex',
            flex: 'auto',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Button size="lg" onClick={() => undo(gameState)}>
            Undo
          </Button>
        </Box>
      </Box>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '50%', height: '100%', float: 'left' }}>
          <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '100%', float: 'right' }}>
          <PlayerButton game={gameState} firstTeam={false} leftSide={false}></PlayerButton>
        </Box>
      </Box>
    </Box>
  );
}
